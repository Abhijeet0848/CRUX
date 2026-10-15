"""
Twenty Comprehensive Test Cases for Summarsphere
================================================
Intelligent Extractive Text Summarization System
Automated Test Suite covering:
  - Module 1 (TC-01 to TC-04): NLP Preprocessing & Linguistic Operations
  - Module 2 (TC-05 to TC-08): Extractive Summarization Core Algorithms
  - Module 3 (TC-09 to TC-12): Ranking, Telemetry & ROUGE Evaluation
  - Module 4 (TC-13 to TC-16): In-Memory Document Ingestion & Parser Security
  - Module 5 (TC-17 to TC-20): FastAPI REST Gateway & SQLite Persistence
"""

import io
import unittest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.services.preprocessing import Preprocessor, ENGLISH_STOP_WORDS, HINDI_STOP_WORDS
from backend.app.services.frequency_summarizer import FrequencySummarizer
from backend.app.services.tfidf_summarizer import TfidfSummarizer
from backend.app.services.hybrid_summarizer import HybridSummarizer
from backend.app.services.ranking import RankingService
from backend.app.services.statistics import StatisticsService
from backend.app.services.evaluation import RougeEvaluator
from backend.app.services.document_parser import DocumentParser

client = TestClient(app)


class TestSummarsphereTwentyCases(unittest.TestCase):
    """
    Exhaustive 20-Point Test Suite for Intelligent Extractive Summarizer.
    Each test represents a distinct functional or non-functional requirement.
    """

    @classmethod
    def setUpClass(cls):
        cls.sample_english_text = (
            "Natural language processing is an essential subfield of artificial intelligence. "
            "Extractive text summarization algorithms select the most informative sentences directly from source texts. "
            "Unlike abstractive models, extractive systems prevent factual hallucination and guarantee 100% fidelity. "
            "Mathematical sentence scoring utilizes term frequency distributions and vector space representations. "
            "Chronological order restoration ensures that extracted sentences retain document coherence."
        )

        cls.sample_hindi_text = (
            "प्राकृतिक भाषा प्रसंस्करण कृत्रिम बुद्धिमत्ता का एक महत्वपूर्ण क्षेत्र है। "
            "पाठ सारांशीकरण महत्वपूर्ण वाक्यों को मूल पाठ से सीधे चुनता है। "
            "यह प्रणाली बिना किसी मनगढ़ंत जानकारी के सही सारांश बनाती है।"
        )

    # =========================================================================
    # MODULE 1: NLP Preprocessing & Linguistic Operations (TC-01 to TC-04)
    # =========================================================================

    def test_01_text_cleaning_and_sanitization(self):
        """
        [TC-01] Text Cleaning & Sanitization
        Verify HTML/XML stripping, entity decoding, Markdown link parsing,
        and citation bracket removal while preserving core sentence tokens.
        """
        raw_text = (
            r"<div><p>Artificial intelligence &amp; machine learning are transformative. [1] "
            r"Read more at [OpenAI Portal](https://openai.com). &nbsp; "
            r"Extractive models preserve factual truth [citation needed].</p></div>"
        )
        cleaned = Preprocessor.clean_text(raw_text)

        # Assert HTML tags and entities are stripped / decoded
        self.assertNotIn("<div>", cleaned)
        self.assertNotIn("<p>", cleaned)
        self.assertNotIn("&amp;", cleaned)
        self.assertNotIn("&nbsp;", cleaned)
        self.assertIn("&", cleaned)

        # Assert citation markers and markdown URLs are stripped
        self.assertNotIn("[1]", cleaned)
        self.assertNotIn("[citation needed]", cleaned)
        self.assertNotIn("https://", cleaned)

        # Assert anchor text and legitimate text are preserved
        self.assertIn("OpenAI Portal", cleaned)
        self.assertIn("Artificial intelligence", cleaned)
        self.assertIn("Extractive models preserve factual truth.", cleaned)

    def test_02_multilingual_sentence_segmentation(self):
        """
        [TC-02] Multilingual Sentence Segmentation
        Verify sentence boundary detection for English punctuation (. ! ?)
        and Hindi Devanagari terminators (। ॥).
        """
        # English segmentation
        en_text = "First sentence here. Is this the second sentence? Yes, it is! Finally, sentence four."
        en_sentences = Preprocessor.segment_sentences(en_text)
        self.assertEqual(len(en_sentences), 4)
        self.assertEqual(en_sentences[0], "First sentence here.")
        self.assertEqual(en_sentences[1], "Is this the second sentence?")
        self.assertEqual(en_sentences[2], "Yes, it is!")
        self.assertEqual(en_sentences[3], "Finally, sentence four.")

        # Hindi segmentation
        hi_sentences = Preprocessor.segment_sentences(self.sample_hindi_text)
        self.assertEqual(len(hi_sentences), 3)
        self.assertTrue(hi_sentences[0].startswith("प्राकृतिक"))
        self.assertEqual(Preprocessor.detect_language(self.sample_hindi_text), "hi")
        self.assertEqual(Preprocessor.detect_language(self.sample_english_text), "en")

    def test_03_word_tokenization_and_lowercasing(self):
        """
        [TC-03] Word Tokenization & Lowercasing
        Verify extraction of alphanumeric tokens, lowercase conversion,
        handling of apostrophes and hyphens, and exclusion of punctuation.
        """
        text = "State-of-the-art NLP models aren't prone to errors; they analyze 100% of tokens!"
        tokens = Preprocessor.tokenize(text, lowercase=True)

        self.assertIn("state-of-the-art", tokens)
        self.assertIn("nlp", tokens)
        self.assertIn("models", tokens)
        self.assertIn("aren't", tokens)
        self.assertIn("100", tokens)
        # Ensure punctuation marks are not isolated tokens
        self.assertNotIn("!", tokens)
        self.assertNotIn(";", tokens)
        self.assertTrue(all(t.islower() or t.isdigit() or '-' in t or "'" in t for t in tokens))

    def test_04_stopword_removal_and_morphological_lemmatization(self):
        """
        [TC-04] Stop-Word Removal & Morphological Lemmatization
        Verify filtering of high-frequency functional words in English/Hindi
        and reduction of inflected word forms to base lemmas.
        """
        # English stop-word filtering & lemmatization
        en_input = ["the", "algorithms", "are", "processing", "large", "datasets", "in", "parallel"]
        en_filtered = Preprocessor.filter_and_lemmatize(en_input, lang="en")

        self.assertNotIn("the", en_filtered)
        self.assertNotIn("are", en_filtered)
        self.assertNotIn("in", en_filtered)
        # Check lemmatization / morphological reduction
        self.assertTrue(any(t.startswith("algorithm") for t in en_filtered))
        self.assertTrue(any(t.startswith("process") for t in en_filtered))
        self.assertTrue(any(t.startswith("dataset") for t in en_filtered))

        # Hindi stop-word filtering
        hi_input = ["कृत्रिम", "का", "एक", "महत्वपूर्ण", "क्षेत्र", "है"]
        hi_filtered = Preprocessor.filter_and_lemmatize(hi_input, lang="hi")
        self.assertNotIn("का", hi_filtered)
        self.assertNotIn("है", hi_filtered)
        self.assertNotIn("एक", hi_filtered)
        self.assertIn("कृत्रिम", hi_filtered)

    # =========================================================================
    # MODULE 2: Extractive Summarization Core Algorithms (TC-05 to TC-08)
    # =========================================================================

    def test_05_frequency_word_weighting_and_sentence_scoring(self):
        """
        [TC-05] Frequency-Based Word Weighting & Sentence Scoring
        Verify Luhn's normalized frequency calculation where max weight is 1.0
        and sentence score incorporates length normalization.
        """
        tokens = ["nlp", "model", "nlp", "data", "nlp", "model"]
        weights = FrequencySummarizer.calculate_word_frequencies(tokens)

        # Most frequent token must have weight 1.0
        self.assertEqual(weights["nlp"], 1.0)
        # 'model' appears 2 times vs 'nlp' 3 times -> 2/3
        self.assertAlmostEqual(weights["model"], 2 / 3, places=3)
        self.assertAlmostEqual(weights["data"], 1 / 3, places=3)

        sentences = ["NLP model analyzes data.", "Data is useful."]
        scored = FrequencySummarizer.score_sentences(sentences, weights)
        self.assertEqual(len(scored), 2)
        # Sentence 1 has more salient words -> higher score
        self.assertGreater(scored[0]["score"], scored[1]["score"])
        self.assertTrue(all(s["score"] >= 0.0 for s in scored))

    def test_06_tfidf_vector_space_sentence_scoring(self):
        """
        [TC-06] TF-IDF Vector Space Sentence Scoring
        Verify TF-IDF sentence scoring using smoothed inverse document
        frequencies across sentences treated as a mini-corpus.
        """
        sentences = [
            "Deep neural networks process speech and image inputs.",
            "Text summarization condenses lengthy articles into concise abstracts.",
            "Natural language models evaluate contextual semantic vectors."
        ]
        scored = TfidfSummarizer.score_sentences(sentences)

        self.assertEqual(len(scored), len(sentences))
        for item in scored:
            self.assertIn("score", item)
            self.assertIn("id", item)
            self.assertIn("text", item)
            self.assertGreaterEqual(item["score"], 0.0)

        # Verify that score is strictly positive for sentences with unique terms
        scores = [s["score"] for s in scored]
        self.assertTrue(all(score > 0.0 for score in scores))

    def test_07_hybrid_parametric_scoring_and_weights(self):
        """
        [TC-07] Hybrid Parametric Scoring & Tunable Weights
        Verify linear combination of normalized Frequency and TF-IDF scores:
        Score_Hybrid = alpha * Score_Freq + beta * Score_TFIDF.
        """
        sentences = Preprocessor.segment_sentences(self.sample_english_text)
        tokens = Preprocessor.tokenize_and_normalize(self.sample_english_text)
        weights = FrequencySummarizer.calculate_word_frequencies(tokens)

        alpha = 0.7
        beta = 0.3
        scored = HybridSummarizer.score_sentences(
            sentences=sentences,
            word_weights=weights,
            weight_freq=alpha,
            weight_tfidf=beta
        )

        self.assertEqual(len(scored), len(sentences))
        max_freq = max(item["freq_score"] for item in scored) or 1.0
        max_tfidf = max(item["tfidf_score"] for item in scored) or 1.0

        for item in scored:
            self.assertIn("freq_score", item)
            self.assertIn("tfidf_score", item)
            self.assertIn("score", item)
            norm_f = item["freq_score"] / max_freq
            norm_t = item["tfidf_score"] / max_tfidf
            expected_hybrid = (alpha * norm_f) + (beta * norm_t)
            self.assertAlmostEqual(item["score"], expected_hybrid, places=3)

    def test_08_anti_hallucination_and_chronological_ordering(self):
        """
        [TC-08] Anti-Hallucination & Chronological Order Restoration
        Verify that 100% of extracted summary sentences are verbatim substrings
        of the source text and that final summary preserves document sequence.
        """
        summary, annotated = FrequencySummarizer.summarize(self.sample_english_text, num_sentences=2)
        selected_sentences = [s for s in annotated if s["selected"]]

        self.assertEqual(len(selected_sentences), 2)
        # Anti-hallucination assertion: extracted text must be an exact substring of source
        for item in selected_sentences:
            self.assertIn(item["text"], self.sample_english_text)

        # Chronological sequence assertion: IDs must be strictly ascending
        selected_ids = [item["id"] for item in selected_sentences]
        self.assertEqual(selected_ids, sorted(selected_ids))
        self.assertLess(selected_ids[0], selected_ids[1])

    # =========================================================================
    # MODULE 3: Ranking, Telemetry & ROUGE Evaluation (TC-09 to TC-12)
    # =========================================================================

    def test_09_ranking_top_k_selection_and_budget_clamping(self):
        """
        [TC-09] Ranking Top-K Selection & Budget Clamping
        Verify rank ordering (Rank 1 = highest score) and safe clamping
        when requested K exceeds total available document sentences.
        """
        mock_scored = [
            {"id": 1, "text": "Sentence alpha.", "score": 0.40},
            {"id": 2, "text": "Sentence beta.", "score": 0.95},
            {"id": 3, "text": "Sentence gamma.", "score": 0.70},
        ]

        # Top 2 selection
        summary, annotated = RankingService.rank_and_select(mock_scored, num_sentences=2)
        rank_map = {item["id"]: item["rank"] for item in annotated}
        self.assertEqual(rank_map[2], 1)  # 0.95 is highest
        self.assertEqual(rank_map[3], 2)  # 0.70 is second
        self.assertEqual(rank_map[1], 3)  # 0.40 is third

        # Clamping check: Request K=10 on 3-sentence corpus
        clamp_summary, clamp_annotated = RankingService.rank_and_select(mock_scored, num_sentences=10)
        selected_count = sum(1 for item in clamp_annotated if item["selected"])
        self.assertEqual(selected_count, 3)
        self.assertEqual(len(clamp_annotated), 3)

    def test_10_document_telemetry_and_compression_ratio(self):
        """
        [TC-10] Document Telemetry & Compression Ratio Calculation
        Verify accurate calculation of word counts, sentence counts,
        compression ratio (summary_words / original_words), and timing telemetry.
        """
        orig_text = "Sentence one is long and detailed. Sentence two is brief. Sentence three concludes."
        summ_text = "Sentence two is brief."

        stats = StatisticsService.compute_summary_stats(
            original_text=orig_text,
            summary_text=summ_text,
            original_sentence_count=3,
            summary_sentence_count=1,
            processing_time_ms=8.5
        )

        self.assertEqual(stats["original_sentence_count"], 3)
        self.assertEqual(stats["summary_sentence_count"], 1)
        self.assertEqual(stats["summary_word_count"], 4)
        self.assertGreater(stats["original_word_count"], stats["summary_word_count"])
        expected_ratio = round(stats["summary_word_count"] / stats["original_word_count"], 4)
        self.assertEqual(stats["compression_ratio"], expected_ratio)
        self.assertEqual(stats["processing_time_ms"], 8.5)

    def test_11_rouge_metric_evaluation_precision_recall_f1(self):
        """
        [TC-11] ROUGE Metric Evaluation (ROUGE-1, ROUGE-2, ROUGE-L)
        Verify calculation of Precision, Recall, and F1 for unigram, bigram,
        and Longest Common Subsequence (LCS) overlap.
        """
        candidate = "Artificial intelligence drives automated text summarization."
        reference = "Artificial intelligence powers automated text summarization and extraction."

        metrics = RougeEvaluator.evaluate(candidate=candidate, reference=reference)

        for key in ("rouge_1", "rouge_2", "rouge_l"):
            self.assertIn(key, metrics)
            prf = metrics[key]
            self.assertIn("precision", prf)
            self.assertIn("recall", prf)
            self.assertIn("f1", prf)
            self.assertTrue(0.0 <= prf["precision"] <= 1.0)
            self.assertTrue(0.0 <= prf["recall"] <= 1.0)
            self.assertTrue(0.0 <= prf["f1"] <= 1.0)

        # Candidate is shorter than reference but high overlap -> high precision
        self.assertGreaterEqual(metrics["rouge_1"]["precision"], 0.8)
        self.assertGreaterEqual(metrics["rouge_1"]["f1"], 0.7)

    def test_12_rouge_metric_boundary_conditions(self):
        """
        [TC-12] ROUGE Boundary Conditions
        Verify that identical candidate and reference yield F1 = 1.0,
        while completely disjoint inputs yield F1 = 0.0.
        """
        # Identical inputs -> perfect 1.0
        identical_text = "Natural language processing enables computers to comprehend human language."
        perfect_res = RougeEvaluator.evaluate(identical_text, identical_text)
        self.assertEqual(perfect_res["rouge_1"]["f1"], 1.0)
        self.assertEqual(perfect_res["rouge_2"]["f1"], 1.0)
        self.assertEqual(perfect_res["rouge_l"]["f1"], 1.0)

        # Completely disjoint inputs -> 0.0
        cand_disjoint = "Apples oranges bananas grapes."
        ref_disjoint = "Quantum computing superconductor magnetic resonance."
        zero_res = RougeEvaluator.evaluate(cand_disjoint, ref_disjoint)
        self.assertEqual(zero_res["rouge_1"]["f1"], 0.0)
        self.assertEqual(zero_res["rouge_2"]["f1"], 0.0)
        self.assertEqual(zero_res["rouge_l"]["f1"], 0.0)

    # =========================================================================
    # MODULE 4: In-Memory Document Ingestion & Parser Security (TC-13 to TC-16)
    # =========================================================================

    def test_13_plain_text_document_extraction_in_memory(self):
        """
        [TC-13] Plain Text (.txt) In-Memory Document Extraction
        Verify RAM ingestion of text files, character encoding support,
        and telemetry computation without touching the permanent filesystem.
        """
        sample_doc = (
            "Extractive summarization preserves original sentences without alteration.\n"
            "This ensures zero factual hallucination and complete mathematical interpretability."
        )
        file_payload = {
            "file": ("sample_paper.txt", io.BytesIO(sample_doc.encode("utf-8")), "text/plain")
        }
        res = client.post("/api/extract_document", files=file_payload)

        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["filename"], "sample_paper.txt")
        self.assertEqual(data["extension"], ".txt")
        self.assertEqual(data["sentence_count"], 2)
        self.assertGreater(data["word_count"], 15)
        self.assertIn("Extractive summarization", data["text"])

    def test_14_pdf_document_parsing_in_memory(self):
        """
        [TC-14] PDF Document Parsing In-Memory
        Verify dynamic synthesis and parsing of a PDF document stream in RAM
        using PyMuPDF without writing temporary PDF files to disk.
        """
        try:
            import pymupdf as fitz
        except ImportError:
            import fitz

        doc = fitz.open()
        page = doc.new_page()
        text_content = (
            "PDF Ingestion Pipeline test document. "
            "Natural language processing systems ingest binary document streams in memory. "
            "Extractive summarization extracts salient sentences from academic PDF documents."
        )
        page.insert_textbox(fitz.Rect(50, 50, 500, 700), text_content)
        pdf_bytes = doc.write()
        doc.close()

        file_payload = {
            "file": ("report.pdf", io.BytesIO(pdf_bytes), "application/pdf")
        }
        res = client.post("/api/extract_document", files=file_payload)

        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["filename"], "report.pdf")
        self.assertEqual(data["extension"], ".pdf")
        self.assertEqual(data["sentence_count"], 3)
        self.assertIn("PDF Ingestion Pipeline", data["text"])

    def test_15_unsupported_file_extension_rejection(self):
        """
        [TC-15] Unsupported File Extension Rejection
        Verify security validation rejecting disallowed file extensions
        (such as .exe, .bin, .jpg) with HTTP 400 Bad Request.
        """
        file_payload = {
            "file": ("malicious_script.exe", io.BytesIO(b"MZ\x90\x00executable binary"), "application/octet-stream")
        }
        res = client.post("/api/extract_document", files=file_payload)

        self.assertEqual(res.status_code, 400)
        self.assertIn("unsupported file format", res.json()["detail"].lower())

    def test_16_corrupt_and_empty_document_error_handling(self):
        """
        [TC-16] Corrupt and Empty Document Error Handling
        Verify graceful error responses for 0-byte empty files (HTTP 400)
        and damaged / unreadable PDF bytes (HTTP 400 or 422).
        """
        # Empty file test
        empty_payload = {
            "file": ("empty.txt", io.BytesIO(b""), "text/plain")
        }
        res_empty = client.post("/api/extract_document", files=empty_payload)
        self.assertEqual(res_empty.status_code, 400)
        self.assertIn("empty", res_empty.json()["detail"].lower())

        # Corrupted PDF test
        corrupt_payload = {
            "file": ("damaged.pdf", io.BytesIO(b"%PDF-1.4 damaged broken payload EOF"), "application/pdf")
        }
        res_corrupt = client.post("/api/extract_document", files=corrupt_payload)
        self.assertIn(res_corrupt.status_code, (400, 422))

    # =========================================================================
    # MODULE 5: FastAPI REST Gateway & SQLite Persistence (TC-17 to TC-20)
    # =========================================================================

    def test_17_api_health_check_endpoint(self):
        """
        [TC-17] API Health Check Gateway Endpoint
        Verify liveness check at GET /api/health returns HTTP 200 and healthy status.
        """
        response = client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "healthy")

    def test_18_api_summarization_endpoint_execution(self):
        """
        [TC-18] API Summarization Endpoint Execution
        Verify POST /api/summarize executes Frequency, TF-IDF, and Hybrid pipelines,
        returning structured sentence arrays and performance statistics.
        """
        for method in ("frequency", "tfidf", "hybrid"):
            payload = {
                "text": self.sample_english_text,
                "method": method,
                "num_sentences": 2,
                "weight_frequency": 0.6,
                "weight_tfidf": 0.4
            }
            res = client.post("/api/summarize", json=payload)
            self.assertEqual(res.status_code, 200, f"Method {method} failed with {res.status_code}")
            data = res.json()

            self.assertEqual(data["method"], method)
            self.assertIn("summary", data)
            self.assertTrue(len(data["summary"]) > 0)
            self.assertIn("sentences", data)
            self.assertEqual(len(data["sentences"]), 5)  # 5 total sentences in sample
            self.assertEqual(data["statistics"]["summary_sentence_count"], 2)
            self.assertGreater(data["processing_time_ms"], 0.0)

    def test_19_api_request_validation_and_rejection(self):
        """
        [TC-19] API Request Validation and Rejection
        Verify Pydantic v2 input validation rejects empty text, short inputs (<10 chars),
        and unsupported algorithm identifiers with HTTP 422.
        """
        # Empty text
        res1 = client.post("/api/summarize", json={"text": "", "method": "frequency", "num_sentences": 2})
        self.assertEqual(res1.status_code, 422)

        # Very short text (< 10 chars)
        res2 = client.post("/api/summarize", json={"text": "Short.", "method": "frequency", "num_sentences": 1})
        self.assertEqual(res2.status_code, 422)

        # Invalid algorithm name
        res3 = client.post("/api/summarize", json={
            "text": self.sample_english_text,
            "method": "unsupported_deep_learning_network",
            "num_sentences": 2
        })
        self.assertEqual(res3.status_code, 422)

    def test_20_sqlite_history_persistence_crud_lifecycle(self):
        """
        [TC-20] SQLite History Persistence CRUD Lifecycle
        Verify end-to-end SQLite database operations:
        Create entry, List all, Get single by ID, Delete entry, and Verify 404.
        """
        # 1. Create entry
        create_payload = {
            "original_text": self.sample_english_text,
            "summary": "Extractive text summarization algorithms select the most informative sentences directly.",
            "method": "hybrid",
            "num_selected_sentences": 1,
            "original_word_count": 55,
            "summary_word_count": 10,
            "compression_ratio": 0.1818,
            "processing_time_ms": 6.8
        }
        create_res = client.post("/api/history", json=create_payload)
        self.assertEqual(create_res.status_code, 201)
        record = create_res.json()
        record_id = record["id"]
        self.assertEqual(record["method"], "hybrid")

        # 2. List history
        list_res = client.get("/api/history")
        self.assertEqual(list_res.status_code, 200)
        items = list_res.json()
        self.assertTrue(any(item["id"] == record_id for item in items))

        # 3. Retrieve single entry by ID
        get_res = client.get(f"/api/history/{record_id}")
        self.assertEqual(get_res.status_code, 200)
        self.assertEqual(get_res.json()["id"], record_id)
        self.assertEqual(get_res.json()["num_selected_sentences"], 1)

        # 4. Delete entry by ID
        del_res = client.delete(f"/api/history/{record_id}")
        self.assertEqual(del_res.status_code, 200)
        self.assertEqual(del_res.json().get("status"), "deleted")

        # 5. Verify 404 Not Found on deleted entry
        verify_del = client.get(f"/api/history/{record_id}")
        self.assertEqual(verify_del.status_code, 404)


if __name__ == "__main__":
    unittest.main()
