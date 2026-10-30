"""
Sentence Ranking and Chronological Selection Module
===================================================
Handles:
1. Sentence Ranking: Sorts sentences descending by calculated importance score (Rank 1 = Highest Score).
2. Dialogue/Quote Boost: Detects conversational markers in Hindi and English and applies a 1.15x multiplier.
3. Top-K Selection: Filters the top K most informative sentences.
4. Original Order Restoration: Re-sorts selected sentences by their original chronological document position (Sentence ID).
5. Summary Synthesis: Concatenates chosen sentences into a coherent final extractive summary.
"""

import re
from typing import List, Dict, Any, Tuple, Set
from backend.app.services.preprocessing import Preprocessor


class RankingService:
    """Manages sentence ranking, dialogue boost, MMR diversity selection, and chronological order preservation."""

    # Regex detecting conversational markers (quotes, dialogue indicators in Hindi & English)
    DIALOGUE_PATTERN = re.compile(
        r'["\'“”‘’«»]|'
        r'(?:\b|\s|^)(?:'
        r'ने\s+कहा|कहा(?:\s+कि)?|कहने\s+लग[ाीे]|'
        r'बोला|बोली|बोले|बोलने\s+लग[ाीे]|'
        r'पूछा|पूछी|पूछे|पूछने\s+लग[ाीे]|'
        r'उत्तर\s+दिया|जवाब\s+दिया|'
        r'चिल्ला[याीे]|'
        r'said|asked|replied|shouted|whispered|exclaimed'
        r')(?:\b|\s|[.,!?।॥:;]|$)',
        re.IGNORECASE | re.UNICODE
    )

    DIALOGUE_MULTIPLIER = 1.15
    MMR_OVERLAP_THRESHOLD = 0.50
    MMR_PENALTY_MULTIPLIER = 0.50

    @classmethod
    def has_dialogue_marker(cls, sentence: str) -> bool:
        """
        Detects conversational markers, quotation marks, or dialogue indicators.
        Supports Hindi conversational verbs ('ने कहा', 'बोला', 'पूछा') and quote marks.
        """
        if not sentence or not isinstance(sentence, str):
            return False
        return bool(cls.DIALOGUE_PATTERN.search(sentence))

    @classmethod
    def apply_dialogue_boost(
        cls,
        scored_sentences: List[Dict[str, Any]],
        multiplier: float = DIALOGUE_MULTIPLIER
    ) -> List[Dict[str, Any]]:
        """
        Applies a 1.15x multiplier to the final score of sentences containing
        conversational markers (quotes or dialogue indicators).
        Ensures climax/moral sentences in stories are prioritized.
        """
        boosted = []
        for item in scored_sentences:
            s_copy = dict(item)
            text = s_copy.get("text", "")
            if not s_copy.get("dialogue_boost_applied") and cls.has_dialogue_marker(text):
                s_copy["score"] = round(s_copy["score"] * multiplier, 4)
                s_copy["has_dialogue"] = True
                s_copy["dialogue_boost"] = multiplier
                s_copy["dialogue_boost_applied"] = True
            elif s_copy.get("dialogue_boost_applied"):
                pass  # Already applied
            else:
                s_copy["has_dialogue"] = s_copy.get("has_dialogue", False)
                s_copy["dialogue_boost"] = s_copy.get("dialogue_boost", 1.0)
            boosted.append(s_copy)
        return boosted

    @classmethod
    def calculate_word_overlap(cls, tokens_a: Set[str], tokens_b: Set[str]) -> float:
        """
        Calculates meaningful word overlap ratio between candidate sentence tokens (A)
        and an already selected summary sentence (B).
        Returns max(|A ∩ B| / len(A), |A ∩ B| / min(len(A), len(B))).
        """
        if not tokens_a or not tokens_b:
            return 0.0
        intersection = tokens_a.intersection(tokens_b)
        overlap = len(intersection) / max(1, len(tokens_a))
        containment = len(intersection) / max(1, min(len(tokens_a), len(tokens_b)))
        return max(overlap, containment)

    @classmethod
    def apply_mmr_selection(
        cls,
        scored_sentences: List[Dict[str, Any]],
        target_k: int,
        overlap_threshold: float = MMR_OVERLAP_THRESHOLD,
        penalty_multiplier: float = MMR_PENALTY_MULTIPLIER
    ) -> List[Dict[str, Any]]:
        """
        Implements Maximal Marginal Relevance (MMR) greedy diversity selection:
        1. Iteratively selects sentences with maximum effective score.
        2. When evaluating candidate sentences against sentences ALREADY in the summary,
           if word-overlap exceeds 50%, penalizes its score by 50% (score * 0.50).
        3. Prevents the 'Frequency Trap' where repetitive sentences with the same keyword
           crowd out diverse topics (e.g. history, hardware, application).
        """
        if not scored_sentences:
            return []

        # Make deep copies of candidate items
        candidates = []
        for item in scored_sentences:
            c = dict(item)
            text = c.get("text", "")
            tokens = set(Preprocessor.tokenize_and_normalize(text))
            if not tokens:
                tokens = set(re.findall(r'[a-zA-Z0-9\u0900-\u097F]+', text.lower()))
            c["_tokens"] = tokens
            c["effective_score"] = c["score"]
            c["has_high_overlap"] = False
            c["redundancy_penalty"] = 1.0
            c["max_overlap"] = 0.0
            candidates.append(c)

        selected = []
        selected_token_sets = []
        k = min(max(1, target_k), len(candidates))

        for step in range(k):
            # Recalculate effective scores for all remaining candidates
            for c in candidates:
                if not selected_token_sets:
                    max_overlap = 0.0
                else:
                    max_overlap = max(
                        cls.calculate_word_overlap(c["_tokens"], s_toks)
                        for s_toks in selected_token_sets
                    )

                c["max_overlap"] = round(max_overlap, 4)
                if max_overlap > overlap_threshold:
                    c["effective_score"] = round(c["score"] * penalty_multiplier, 4)
                    c["has_high_overlap"] = True
                    c["redundancy_penalty"] = penalty_multiplier
                else:
                    c["effective_score"] = c["score"]
                    c["has_high_overlap"] = False
                    c["redundancy_penalty"] = 1.0

            # Greedy selection: pick candidate with highest effective score
            candidates.sort(key=lambda x: (x["effective_score"], -x["id"]), reverse=True)
            best = candidates.pop(0)
            best["rank"] = step + 1
            best["selected"] = True
            selected.append(best)
            selected_token_sets.append(best["_tokens"])

        # Compute final overlap & effective scores for unselected candidates
        for c in candidates:
            if selected_token_sets:
                max_overlap = max(
                    cls.calculate_word_overlap(c["_tokens"], s_toks)
                    for s_toks in selected_token_sets
                )
            else:
                max_overlap = 0.0
            c["max_overlap"] = round(max_overlap, 4)
            if max_overlap > overlap_threshold:
                c["effective_score"] = round(c["score"] * penalty_multiplier, 4)
                c["has_high_overlap"] = True
                c["redundancy_penalty"] = penalty_multiplier
            else:
                c["effective_score"] = c["score"]
                c["has_high_overlap"] = False
                c["redundancy_penalty"] = 1.0

        # Rank remaining candidates after the selected ones
        candidates.sort(key=lambda x: (x["effective_score"], -x["id"]), reverse=True)
        for idx, c in enumerate(candidates):
            c["rank"] = k + 1 + idx
            c["selected"] = False

        # Combine and sort back by original document ID (1 to N)
        all_sentences = selected + candidates
        all_sentences.sort(key=lambda x: x["id"])

        # Clean internal helper fields before returning
        for s in all_sentences:
            s.pop("_tokens", None)

        return all_sentences

    @classmethod
    def rank_and_select(
        cls,
        scored_sentences: List[Dict[str, Any]],
        num_sentences: int = 3,
        boost_dialogue: bool = True,
        apply_mmr: bool = True,
        mmr_threshold: float = MMR_OVERLAP_THRESHOLD,
        mmr_penalty: float = MMR_PENALTY_MULTIPLIER
    ) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Executes:
        1. Optionally applies dialogue/quote boost (1.15x multiplier).
        2. Applies MMR diversity selection to penalize word-overlap redundancy (>50% overlap -> 50% penalty).
        3. Restores selected sentences back to their original document sequence.
        4. Joins selected sentences to form the finalized summary text.
        
        Args:
            scored_sentences: List of dicts with 'id', 'text', 'score'
            num_sentences: Target count (K) of sentences to extract
            boost_dialogue: Whether to apply the 1.15x dialogue boost to quotes/conversational sentences
            apply_mmr: Whether to apply Maximal Marginal Relevance diversity selection
            mmr_threshold: Word-overlap threshold to trigger redundancy penalty (default: 0.50)
            mmr_penalty: Multiplier applied to redundant sentence score (default: 0.50)
            
        Returns:
            Tuple of (summary_text, annotated_sentences_list)
        """
        if not scored_sentences:
            return "", []

        # 1. Apply dialogue/quote boost if enabled
        if boost_dialogue:
            scored_sentences = cls.apply_dialogue_boost(scored_sentences)

        total_count = len(scored_sentences)
        k = min(max(1, num_sentences), total_count)

        # 2. MMR diversity selection or standard descending sort
        if apply_mmr and total_count > 1 and k > 1:
            annotated_sentences = cls.apply_mmr_selection(
                scored_sentences,
                target_k=k,
                overlap_threshold=mmr_threshold,
                penalty_multiplier=mmr_penalty
            )
        else:
            # Standard ranking by score descending (tie-breaker by original ID)
            sorted_by_score = sorted(
                scored_sentences,
                key=lambda x: (x["score"], -x["id"]),
                reverse=True
            )
            rank_map = {}
            for rank_idx, item in enumerate(sorted_by_score):
                rank_map[item["id"]] = rank_idx + 1

            top_k_ids = set(item["id"] for item in sorted_by_score[:k])

            annotated_sentences = []
            for item in scored_sentences:
                is_selected = item["id"] in top_k_ids
                annotated_sentences.append({
                    "id": item["id"],
                    "text": item["text"],
                    "score": item["score"],
                    "effective_score": item.get("effective_score", item["score"]),
                    "rank": rank_map[item["id"]],
                    "selected": is_selected,
                    "token_count": item.get("token_count", 0),
                    "has_dialogue": item.get("has_dialogue", False),
                    "dialogue_boost": item.get("dialogue_boost", 1.0),
                    "has_high_overlap": False,
                    "redundancy_penalty": 1.0
                })

        # 3. Restore selected sentences to original chronological document order
        selected_in_order = [
            item for item in annotated_sentences if item["selected"]
        ]
        # Strictly sort by original ID (1, 2, 3...)
        selected_in_order.sort(key=lambda x: x["id"])

        # 4. Construct final extractive summary
        summary = " ".join(item["text"].strip() for item in selected_in_order)

        return summary, annotated_sentences
