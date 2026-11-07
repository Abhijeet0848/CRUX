"""
Hybrid Extractive Summarization Module
======================================
Combines Frequency and TF-IDF scoring metrics using configurable linear weights:
    Score_hybrid(s) = (alpha * Score_freq_norm(s)) + (beta * Score_tfidf_norm(s))

Where:
- alpha (default 0.5): Weight assigned to word frequency dominance
- beta  (default 0.5): Weight assigned to TF-IDF term uniqueness
"""

import re
from typing import List, Dict, Any, Tuple
from backend.app.services.preprocessing import Preprocessor
from backend.app.services.frequency_summarizer import FrequencySummarizer
from backend.app.services.tfidf_summarizer import TfidfSummarizer


class HybridSummarizer:
    """Combines normalized term frequency and TF-IDF sentence scores."""

    @staticmethod
    def score_sentences(
        sentences: List[str],
        word_weights: Dict[str, float],
        weight_freq: float = 0.5,
        weight_tfidf: float = 0.5
    ) -> List[Dict[str, Any]]:
        """
        Calculates hybrid score for each sentence:
        1. Obtains frequency-based scores.
        2. Obtains TF-IDF scores.
        3. Scales both score distributions to [0, 1].
        4. Computes weighted sum: alpha * norm_freq + beta * norm_tfidf.
        """
        if not sentences:
            return []

        freq_scored = FrequencySummarizer.score_sentences(sentences, word_weights)
        tfidf_scored = TfidfSummarizer.score_sentences(sentences)

        # Find maximum scores for min-max / relative scaling
        max_freq_score = max((s["score"] for s in freq_scored), default=1.0) or 1.0
        max_tfidf_score = max((s["score"] for s in tfidf_scored), default=1.0) or 1.0

        hybrid_scored = []
        for i in range(len(sentences)):
            norm_f = freq_scored[i]["score"] / max_freq_score
            norm_t = tfidf_scored[i]["score"] / max_tfidf_score

            combined_score = (weight_freq * norm_f) + (weight_tfidf * norm_t)

            # Lead Bias (Positional Bonus): Prioritize introductory definition sentences
            if i == 0:
                combined_score *= 1.25
            elif i == 1:
                combined_score *= 1.10

            # Critical Keyword Booster (Legal/Medical High-Stakes Clauses)
            has_critical, matched_keywords = Preprocessor.check_critical_keywords(sentences[i])
            if has_critical:
                combined_score *= Preprocessor.CRITICAL_KEYWORD_BOOST

            hybrid_scored.append({
                "id": i + 1,
                "text": sentences[i],
                "score": round(combined_score, 4),
                "token_count": freq_scored[i]["token_count"],
                "freq_score": round(freq_scored[i]["score"], 4),
                "tfidf_score": round(tfidf_scored[i]["score"], 4),
                "has_critical_keyword": has_critical,
                "critical_keywords": matched_keywords
            })
        return hybrid_scored

    @classmethod
    def select_sentences(
        cls,
        scored_sentences: List[Dict[str, Any]],
        num_sentences: int = 3,
        overlap_threshold: float = 0.50,
        penalty: float = 0.20
    ) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Greedy diversity selection loop for the Hybrid Model with Redundancy Penalty:
        1. When selecting a sentence, checks if it shares > 50% of its words with
           any sentence ALREADY selected in the summary.
        2. If it does, applies a 20% penalty to its score (multiplies by 0.80).
        3. Prevents 'Ranking Convergence' between TF-IDF and Hybrid models on short documents,
           forcing the Hybrid model to select a distinct, diverse sentence.
        """
        if not scored_sentences:
            return "", []

        # 1. Prepare candidates and extract normalized words
        candidates = []
        for item in scored_sentences:
            c = dict(item)
            text = c.get("text", "")
            words = set(Preprocessor.tokenize_and_normalize(text))
            if not words:
                words = set(re.findall(r'[a-zA-Z0-9\u0900-\u097F]+', text.lower()))
            c["_words"] = words
            c["effective_score"] = c["score"]
            c["has_high_overlap"] = False
            c["redundancy_penalty"] = 1.0
            c["max_overlap"] = 0.0
            candidates.append(c)

        selected = []
        k = min(max(1, num_sentences), len(candidates))
        penalty_multiplier = 1.0 - penalty  # e.g., 0.80 for 20% penalty

        # 2. Iterative selection loop
        for step in range(k):
            # Check overlap against sentences already in summary
            for c in candidates:
                c_words = c["_words"]
                max_overlap = 0.0

                for s in selected:
                    s_words = s["_words"]
                    if not s_words or not c_words:
                        continue
                    # Overlap ratio: percentage of candidate's words shared with summary sentence
                    overlap = len(c_words.intersection(s_words)) / len(c_words)
                    if overlap > max_overlap:
                        max_overlap = overlap

                c["max_overlap"] = round(max_overlap, 4)

                # Apply 20% penalty if overlap exceeds 50% threshold
                if max_overlap > overlap_threshold:
                    c["effective_score"] = round(c["score"] * penalty_multiplier, 4)
                    c["has_high_overlap"] = True
                    c["redundancy_penalty"] = round(penalty_multiplier, 2)
                else:
                    c["effective_score"] = c["score"]
                    c["has_high_overlap"] = False
                    c["redundancy_penalty"] = 1.0

            # Greedily pick candidate with highest effective score (tie-breaker by lower ID)
            candidates.sort(key=lambda x: (x["effective_score"], -x["id"]), reverse=True)
            best = candidates.pop(0)
            best["rank"] = step + 1
            best["selected"] = True
            selected.append(best)

        # Mark remaining unselected candidates
        for idx, c in enumerate(candidates):
            c["rank"] = k + 1 + idx
            c["selected"] = False

        # 3. Restore original chronological order (Sentence ID 1 to N)
        all_sentences = selected + candidates
        all_sentences.sort(key=lambda x: x["id"])

        for s in all_sentences:
            s.pop("_words", None)
            s["text"] = s["text"].strip().strip('"\'“”').strip()

        # 4. Construct final summary text
        summary = " ".join(s["text"].strip().strip('"\'“”').strip() for s in all_sentences if s["selected"])
        return summary, all_sentences

    @classmethod
    def summarize(
        cls,
        text: str,
        num_sentences: int = 3,
        weight_freq: float = 0.5,
        weight_tfidf: float = 0.5,
        overlap_threshold: float = 0.50,
        redundancy_penalty: float = 0.20
    ) -> Tuple[str, List[Dict[str, Any]]]:
        """
        End-to-end hybrid summarization pipeline:
        Preprocess -> Score (Freq + TF-IDF) -> Weighted Blend -> Rank & Select with Redundancy Penalty -> Restore Order.
        """
        preprocessed = Preprocessor.preprocess(text)
        sentences = preprocessed["original_sentences"]
        if not sentences:
            return "", []

        weights = FrequencySummarizer.calculate_word_frequencies(preprocessed["tokens"])
        scored = cls.score_sentences(
            sentences,
            weights,
            weight_freq=weight_freq,
            weight_tfidf=weight_tfidf
        )
        return cls.select_sentences(
            scored,
            num_sentences=num_sentences,
            overlap_threshold=overlap_threshold,
            penalty=redundancy_penalty
        )
