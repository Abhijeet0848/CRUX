"""
Unit Tests for Preprocessing Service
====================================
"""

import unittest
from backend.app.services.preprocessing import Preprocessor


class TestPreprocessing(unittest.TestCase):

    def test_clean_text_html_removal(self):
        raw = "<div><p>Natural Language Processing <b>(NLP)</b> &amp; text analysis.</p></div>"
        cleaned = Preprocessor.clean_text(raw)
        self.assertNotIn("<p>", cleaned)
        self.assertNotIn("</div>", cleaned)
        self.assertIn("Natural Language Processing (NLP) & text analysis.", cleaned)

    def test_clean_text_empty_and_whitespace(self):
        self.assertEqual(Preprocessor.clean_text(""), "")
        self.assertEqual(Preprocessor.clean_text(None), "")
        raw = "   Multiple   \n\n\t spaces and \r\n line breaks.   "
        self.assertEqual(Preprocessor.clean_text(raw, preserve_newlines=False), "Multiple spaces and line breaks.")

    def test_segment_sentences(self):
        text = "This is sentence one. Sentence two is here! Is this sentence three? Yes, it is."
        sentences = Preprocessor.segment_sentences(text)
        self.assertEqual(len(sentences), 4)
        self.assertEqual(sentences[0], "This is sentence one.")
        self.assertEqual(sentences[1], "Sentence two is here!")
        self.assertEqual(sentences[2], "Is this sentence three?")
        self.assertEqual(sentences[3], "Yes, it is.")

    def test_segment_sentences_with_newlines_and_bullets(self):
        text = "Introductory text.\n- First bullet point\n- Second bullet point\nConcluding sentence."
        sentences = Preprocessor.segment_sentences(text)
        self.assertEqual(len(sentences), 4)
        self.assertEqual(sentences[0], "Introductory text.")
        self.assertEqual(sentences[1], "- First bullet point")
        self.assertEqual(sentences[2], "- Second bullet point")
        self.assertEqual(sentences[3], "Concluding sentence.")

    def test_segment_sentences_with_hanging_colon(self):
        text = "Key Advantage:\nZero Hallucination Guarantee\nLow Compute Footprint: Runs fast."
        sentences = Preprocessor.segment_sentences(text)
        self.assertEqual(len(sentences), 2)
        self.assertEqual(sentences[0], "Key Advantage: Zero Hallucination Guarantee")
        self.assertEqual(sentences[1], "Low Compute Footprint: Runs fast.")

    def test_tokenize_and_normalize(self):
        text = "The artificial intelligence algorithms are running quickly and analyzing documents."
        tokens = Preprocessor.tokenize_and_normalize(text)
        # Check stop-words are eliminated
        self.assertNotIn("the", tokens)
        self.assertNotIn("are", tokens)
        self.assertNotIn("and", tokens)
        # Check normalization / lemmatization
        self.assertTrue(any(t.startswith("run") for t in tokens))
        self.assertTrue(any(t.startswith("analyz") for t in tokens))
        self.assertTrue(any(t.startswith("algorithm") for t in tokens))

    def test_clean_sentence_strips_quotes(self):
        # 1. Double quotes
        raw_double = '"Natural Language Processing is a subfield of AI."'
        self.assertEqual(
            Preprocessor.clean_sentence(raw_double),
            "Natural Language Processing is a subfield of AI."
        )

        # 2. Single quotes
        raw_single = "'Extractive summarization preserves original phrasing.'"
        self.assertEqual(
            Preprocessor.clean_sentence(raw_single),
            "Extractive summarization preserves original phrasing."
        )

        # 3. Unicode curly quotes (“ ”)
        raw_curly = "“Deep learning models rely on neural networks.”"
        self.assertEqual(
            Preprocessor.clean_sentence(raw_curly),
            "Deep learning models rely on neural networks."
        )

        # 4. Whitespace padding around quotes
        raw_padded = '   "Text analytics provides actionable insights."   '
        self.assertEqual(
            Preprocessor.clean_sentence(raw_padded),
            "Text analytics provides actionable insights."
        )

        # 5. Internal quotes MUST be preserved intact
        internal_single = '"The researcher declared, \'Transformers revolutionized NLP\', during the conference."'
        self.assertEqual(
            Preprocessor.clean_sentence(internal_single),
            "The researcher declared, 'Transformers revolutionized NLP', during the conference."
        )

        internal_double = '\'The author wrote, "Knowledge is power", in chapter one.\''
        self.assertEqual(
            Preprocessor.clean_sentence(internal_double),
            'The author wrote, "Knowledge is power", in chapter one.'
        )

    def test_segment_sentences_strips_quotes(self):
        text = '"First sentence with quotes." "Second sentence with quotes." “Third sentence with curly quotes.”'
        sentences = Preprocessor.segment_sentences(text)
        self.assertEqual(len(sentences), 3)
        self.assertEqual(sentences[0], "First sentence with quotes.")
        self.assertEqual(sentences[1], "Second sentence with quotes.")
        self.assertEqual(sentences[2], "Third sentence with curly quotes.")

    def test_check_critical_keywords(self):
        legal_text = "The vendor shall indemnify the client against all liabilities for any breach."
        has_crit, matched = Preprocessor.check_critical_keywords(legal_text)
        self.assertTrue(has_crit)
        self.assertIn("indemnify", matched)
        self.assertIn("liabilities", matched)
        self.assertIn("breach", matched)

        medical_text = "Standard dosage is 10mg and contraindication applies to hypertensive patients."
        has_crit, matched = Preprocessor.check_critical_keywords(medical_text)
        self.assertTrue(has_crit)
        self.assertIn("dosage", matched)
        self.assertIn("contraindication", matched)

        neutral_text = "The sunny morning sky welcomed birds singing in the garden."
        has_crit, matched = Preprocessor.check_critical_keywords(neutral_text)
        self.assertFalse(has_crit)
        self.assertEqual(matched, [])

    def test_preprocess_structured_output(self):
        raw = "<p>Quantum computers use qubits. Classical systems use binary bits.</p>"
        result = Preprocessor.preprocess(raw)
        self.assertIn("original_sentences", result)
        self.assertIn("processed_sentences", result)
        self.assertIn("tokens", result)
        self.assertEqual(len(result["original_sentences"]), 2)
        self.assertEqual(len(result["processed_sentences"]), 2)
        self.assertEqual(result["processed_sentences"][0]["id"], 1)
        self.assertEqual(result["processed_sentences"][1]["id"], 2)
        self.assertEqual(result["processed_sentences"][0]["original_text"], "Quantum computers use qubits.")


if __name__ == "__main__":
    unittest.main()

