"""
Unit Tests for Ranking, Top-K Selection, and Order Restoration
==============================================================
"""

import unittest
from backend.app.services.ranking import RankingService


class TestRanking(unittest.TestCase):

    def test_ranking_and_order_restoration(self):
        scored_sentences = [
            {"id": 1, "text": "First sentence with medium importance.", "score": 0.5},
            {"id": 2, "text": "Second sentence with highest importance.", "score": 0.95},
            {"id": 3, "text": "Third sentence with lowest importance.", "score": 0.1},
            {"id": 4, "text": "Fourth sentence with second highest importance.", "score": 0.8},
        ]

        summary, annotated = RankingService.rank_and_select(scored_sentences, num_sentences=2, apply_mmr=False)

        # Check ranks
        rank_dict = {item["id"]: item["rank"] for item in annotated}
        self.assertEqual(rank_dict[2], 1)  # id 2 has highest score 0.95 -> Rank 1
        self.assertEqual(rank_dict[4], 2)  # id 4 has score 0.8 -> Rank 2

        # Check selection
        selected_ids = [item["id"] for item in annotated if item["selected"]]
        self.assertEqual(selected_ids, [2, 4])

        # Check summary restored to chronological order (Sentence 2 then Sentence 4)
        self.assertEqual(
            summary,
            "Second sentence with highest importance. Fourth sentence with second highest importance."
        )

    def test_ranking_edge_cases(self):
        # Empty input
        summary, annotated = RankingService.rank_and_select([], num_sentences=2)
        self.assertEqual(summary, "")
        self.assertEqual(annotated, [])

        # K greater than sentence count
        single = [{"id": 1, "text": "Only one sentence.", "score": 1.0}]
        summary, annotated = RankingService.rank_and_select(single, num_sentences=5)
        self.assertEqual(summary, "Only one sentence.")
        self.assertEqual(len(annotated), 1)
        self.assertTrue(annotated[0]["selected"])

    def test_dialogue_marker_detection(self):
        """Verifies regex detection of conversational markers in Hindi and English."""
        # Hindi quotation and dialogue verbs
        self.assertTrue(RankingService.has_dialogue_marker('खरगोश ने शेर से कहा, "कुएं में दूसरा शेर रहता है।"'))
        self.assertTrue(RankingService.has_dialogue_marker('लोमड़ी ने बोला कि तुम बहुत सुंदर हो।'))
        self.assertTrue(RankingService.has_dialogue_marker('उसने पूछा कि क्या तुम सच बोल रहे हो?'))
        self.assertTrue(RankingService.has_dialogue_marker('साधु ने उत्तर दिया कि धैर्य रखो।'))
        self.assertTrue(RankingService.has_dialogue_marker('कौआ जोर से चिल्लाया।'))
        self.assertTrue(RankingService.has_dialogue_marker('राजा कहने लगा कि हम शांति चाहते हैं।'))
        
        # English quotation and dialogue verbs
        self.assertTrue(RankingService.has_dialogue_marker('"Knowledge is power," said the philosopher.'))
        self.assertTrue(RankingService.has_dialogue_marker('The detective asked who was present at the scene.'))
        
        # Non-dialogue sentences
        self.assertFalse(RankingService.has_dialogue_marker('यह एक साधारण ऐतिहासिक विवरण है जिसमें कोई संवाद नहीं है।'))
        self.assertFalse(RankingService.has_dialogue_marker('Artificial intelligence processes text via statistical algorithms.'))

    def test_dialogue_boost_multiplier_prioritizes_climax(self):
        """
        Verifies that a 1.15x dialogue boost elevates a conversational sentence
        over a slightly higher-scoring expository sentence.
        """
        sentences = [
            {"id": 1, "text": "शेर जंगल का बहुत शक्तिशाली और भयानक राजा था।", "score": 0.80},
            {"id": 2, "text": "खरगोश ने शेर से कहा, 'कुएं में एक और शेर बैठा है!'", "score": 0.75},
        ]

        # Without dialogue boost: Sentence 1 (0.80) beats Sentence 2 (0.75)
        _, raw_annotated = RankingService.rank_and_select(sentences, num_sentences=1, boost_dialogue=False)
        self.assertEqual(raw_annotated[0]["rank"], 1)  # ID 1 is rank 1
        self.assertEqual(raw_annotated[1]["rank"], 2)  # ID 2 is rank 2

        # With 1.15x dialogue boost: Sentence 2 score becomes 0.75 * 1.15 = 0.8625 -> beats Sentence 1 (0.80)
        summary, boosted_annotated = RankingService.rank_and_select(sentences, num_sentences=1, boost_dialogue=True)
        self.assertEqual(boosted_annotated[1]["rank"], 1)  # ID 2 becomes rank 1
        self.assertTrue(boosted_annotated[1]["selected"])
        self.assertTrue(boosted_annotated[1]["has_dialogue"])
        self.assertEqual(boosted_annotated[1]["dialogue_boost"], 1.15)
        self.assertIn("कुएं में एक और शेर बैठा है", summary)

    def test_mmr_diversity_avoids_frequency_trap(self):
        """
        [MMR Diversity Verification]
        Verifies that when a sentence has > 50% word overlap with an already selected sentence,
        its score is penalized by 50% (MMR penalty), breaking the Frequency Trap and ensuring
        diverse topics (e.g. hardware architecture) are selected instead of duplicate sentences.
        """
        sentences = [
            {
                "id": 1,
                "text": "Computers process data and computers execute instructions on digital computer hardware.",
                "score": 0.95
            },
            {
                "id": 2,
                "text": "Computers process data and computers execute instructions efficiently.",
                "score": 0.92  # High overlap (> 50%) with sentence 1
            },
            {
                "id": 3,
                "text": "Early calculating machines date back to the abacus in ancient history.",
                "score": 0.70
            },
            {
                "id": 4,
                "text": "Modern hardware architecture features multicore CPUs and graphics processing units.",
                "score": 0.75
            }
        ]

        # Without MMR: Sentence 1 (0.95) and Sentence 2 (0.92) are selected (Frequency Trap)
        raw_summary, raw_annotated = RankingService.rank_and_select(sentences, num_sentences=2, apply_mmr=False)
        raw_selected_ids = [s["id"] for s in raw_annotated if s["selected"]]
        self.assertEqual(raw_selected_ids, [1, 2])

        # With MMR: Sentence 2 receives 50% penalty (0.92 * 0.50 = 0.46) -> Sentence 4 (0.75) is selected!
        mmr_summary, mmr_annotated = RankingService.rank_and_select(sentences, num_sentences=2, apply_mmr=True)
        mmr_selected_ids = [s["id"] for s in mmr_annotated if s["selected"]]
        self.assertEqual(mmr_selected_ids, [1, 4])
        
        # Verify MMR metadata
        s2 = next(s for s in mmr_annotated if s["id"] == 2)
        self.assertTrue(s2["has_high_overlap"])
        self.assertEqual(s2["redundancy_penalty"], 0.50)
        self.assertAlmostEqual(s2["effective_score"], 0.46, places=2)
        self.assertFalse(s2["selected"])

        s4 = next(s for s in mmr_annotated if s["id"] == 4)
        self.assertTrue(s4["selected"])
        self.assertIn("Modern hardware architecture", mmr_summary)

    def test_request_clamping_graceful_handling(self):
        """
        [Graceful Clamping Verification]
        Verifies that if a user requests 20 sentences but the document only has 8 (or 10 on 6),
        the engine gracefully clamps and returns all available sentences without raising a 500 error.
        """
        eight_sentences = [
            {"id": i, "text": f"Sentence number {i} of document.", "score": 0.5 + (i * 0.05)}
            for i in range(1, 9)
        ]
        self.assertEqual(len(eight_sentences), 8)

        # Request 20 sentences on an 8-sentence document
        summary, annotated = RankingService.rank_and_select(eight_sentences, num_sentences=20)
        
        # All 8 sentences should be returned and selected
        self.assertEqual(len(annotated), 8)
        selected = [s for s in annotated if s["selected"]]
        self.assertEqual(len(selected), 8)
        # Verify chronological ordering preserved
        self.assertEqual([s["id"] for s in selected], list(range(1, 9)))

    def test_hybrid_redundancy_penalty_avoids_ranking_convergence(self):
        """
        [Hybrid Redundancy Penalty Verification]
        Verifies that when a sentence has > 50% word overlap with an already selected sentence,
        the Hybrid model applies a 20% penalty (0.80 multiplier) to force selection of a unique,
        diverse sentence rather than converging to identical sentences as TF-IDF.
        """
        from backend.app.services.hybrid_summarizer import HybridSummarizer

        sentences = [
            {"id": 1, "text": "Quantum computers process complex calculations using quantum qubits and quantum states.", "score": 0.95},
            {"id": 2, "text": "Quantum computers calculate complex problems using quantum qubits efficiently.", "score": 0.90},  # > 50% overlap with #1
            {"id": 3, "text": "Superconducting circuits and cryogenic refrigerators form the physical infrastructure.", "score": 0.78},  # diverse topic
        ]

        # In Hybrid selection: Sentence 1 is picked first (0.95).
        # Sentence 2 shares > 50% of words with Sentence 1 -> penalized by 20% (0.90 * 0.80 = 0.72).
        # Sentence 3 (0.78) beats Sentence 2 (0.72) -> Hybrid selects [1, 3]!
        summary, annotated = HybridSummarizer.select_sentences(sentences, num_sentences=2, overlap_threshold=0.50, penalty=0.20)
        selected_ids = [s["id"] for s in annotated if s["selected"]]
        self.assertEqual(selected_ids, [1, 3])

        s2 = next(s for s in annotated if s["id"] == 2)
        self.assertTrue(s2["has_high_overlap"])
        self.assertEqual(s2["redundancy_penalty"], 0.80)
        self.assertEqual(s2["effective_score"], 0.72)
        self.assertFalse(s2["selected"])

        s3 = next(s for s in annotated if s["id"] == 3)
        self.assertTrue(s3["selected"])
        self.assertIn("Superconducting circuits", summary)


if __name__ == "__main__":
    unittest.main()
