# Testing Documentation & Verification Procedures

## Quality Assurance & Automated Test Framework

---

### 1. Test Architecture

The testing framework employs Python's `pytest` and `unittest` with FastAPI's `TestClient` (Starlette) to achieve full test coverage across the NLP engines, API endpoints, error handlers, and persistence layer.

```
backend/app/tests/
├── test_twenty_cases.py       # 20 Comprehensive Unit & Integration Test Cases
├── test_preprocessing.py      # Cleaning, segmentation, tokenization, lemmatization
├── test_summarizers.py        # Frequency, TF-IDF, and Hybrid mathematical scoring
├── test_ranking.py            # Rank assignment, Top-K selection, chronological reordering
├── test_statistics.py         # Word counts, sentence counts, compression ratio, latency
├── test_document_parser.py    # In-memory TXT and PDF ingestion, extension checks
├── test_history.py            # SQLite CRUD operations and 404 error handling
├── test_api.py                # End-to-end FastAPI endpoint integration
└── qa_comprehensive_pass.py   # Comprehensive 23-point system validation
```

---

### 2. Running Automated Tests

#### A. Run 20 Comprehensive Test Cases (Recommended)
```bash
python -m unittest backend/app/tests/test_twenty_cases.py -v
```
or via Pytest:
```bash
python -m pytest backend/app/tests/test_twenty_cases.py -v
```

#### B. Run Full Pytest Suite
```bash
python -m pytest backend/app/tests
```

#### C. Run Comprehensive QA Pass
```bash
python -m backend.app.tests.qa_comprehensive_pass
```

---

### 3. Comprehensive 20-Point Test Cases & Verification Matrix

| TC ID | Module | Test Function | Objective & Target Assertions | Status |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | **NLP Preprocessing** | `test_01_text_cleaning_and_sanitization` | Decodes HTML entities (`&amp;` $\rightarrow$ `&`), strips tags (`<div>`, `<p>`), unlinks URLs, removes Markdown citations (`[1]`, `[citation needed]`), and normalizes whitespace. | **PASS** |
| **TC-02** | **NLP Preprocessing** | `test_02_multilingual_sentence_segmentation` | Detects sentence boundaries on English `.!?` and Hindi Devanagari `। ॥`, preserves sentence count and structure, and auto-detects language code (`en` / `hi`). | **PASS** |
| **TC-03** | **NLP Preprocessing** | `test_03_word_tokenization_and_lowercasing` | Isolates alphanumeric words, standardizes tokens to lowercase, preserves hyphens/apostrophes (`state-of-the-art`, `aren't`), and strips punctuation marks. | **PASS** |
| **TC-04** | **NLP Preprocessing** | `test_04_stopword_removal_and_morphological_lemmatization` | Eliminates high-frequency stopwords in English (`the`, `is`, `in`) and Hindi (`का`, `है`, `एक`), reducing inflected words (`algorithms` $\rightarrow$ `algorithm`, `processing` $\rightarrow$ `process`) to dictionary lemmas. | **PASS** |
| **TC-05** | **Core Algorithm** | `test_05_frequency_word_weighting_and_sentence_scoring` | Implements Luhn's frequency model: normalizes word weights $\frac{f(w)}{\max f(v)} \in [0.0, 1.0]$ and applies sub-linear sentence length normalization $\sqrt{\|S_i\| + \epsilon}$. | **PASS** |
| **TC-06** | **Core Algorithm** | `test_06_tfidf_vector_space_sentence_scoring` | Treats document sentences as a localized corpus with Laplace-smoothed inverse document frequency ($\text{IDF}(t) = \ln(\frac{1+N}{1+\text{DF}(t)}) + 1$), asserting strictly non-negative sentence scores. | **PASS** |
| **TC-07** | **Core Algorithm** | `test_07_hybrid_parametric_scoring_and_weights` | Computes linear parametric blend $\alpha \cdot \text{Score}_{\text{Freq}} + \beta \cdot \text{Score}_{\text{TF-IDF}}$ ($\alpha=0.7, \beta=0.3$) and asserts exact consistency between normalized sub-scores and composite score. | **PASS** |
| **TC-08** | **Core Algorithm** | `test_08_anti_hallucination_and_chronological_ordering` | Guarantees 100% factual integrity: extracted summary sentences are verified as verbatim source substrings, and selected sentences are sorted chronologically by original document index. | **PASS** |
| **TC-09** | **Ranking & Budget** | `test_09_ranking_top_k_selection_and_budget_clamping` | Ranks sentences strictly descending by score (Rank 1 = maximum score), and safely clamps requested budget $K > N$ to total available sentence count without throwing exceptions. | **PASS** |
| **TC-10** | **Telemetry** | `test_10_document_telemetry_and_compression_ratio` | Computes telemetry: word counts, sentence counts, compression ratio $\frac{\text{summary\_words}}{\text{original\_words}}$, and execution latency (ms). | **PASS** |
| **TC-11** | **Evaluation** | `test_11_rouge_metric_evaluation_precision_recall_f1` | Validates precision, recall, and F1 calculations for ROUGE-1 (unigram overlap), ROUGE-2 (bigram overlap), and ROUGE-L (longest common subsequence), checking values fall in $[0.0, 1.0]$. | **PASS** |
| **TC-12** | **Evaluation** | `test_12_rouge_metric_boundary_conditions` | Tests mathematical boundary conditions: identical candidate and reference summaries yield $F1 = 1.0$; completely disjoint summaries yield $F1 = 0.0$. | **PASS** |
| **TC-13** | **Document Parser** | `test_13_plain_text_document_extraction_in_memory` | Ingests `.txt` streams via `io.BytesIO` in RAM without touching permanent disk, returning decoded text, word count, and sentence count. | **PASS** |
| **TC-14** | **Document Parser** | `test_14_pdf_document_parsing_in_memory` | Ingests binary PDF streams dynamically rendered in memory via PyMuPDF (`fitz`), validating multi-sentence extraction and metadata generation without file persistence. | **PASS** |
| **TC-15** | **Parser Security** | `test_15_unsupported_file_extension_rejection` | Validates file upload security gatekeeping: rejects disallowed file extensions (`.exe`, `.bin`, `.png`) with HTTP `400 Bad Request`. | **PASS** |
| **TC-16** | **Parser Security** | `test_16_corrupt_and_empty_document_error_handling` | Gracefully rejects empty 0-byte files with HTTP `400 Bad Request` and damaged/corrupt PDF byte streams with HTTP `400` or `422`. | **PASS** |
| **TC-17** | **REST Gateway** | `test_17_api_health_check_endpoint` | Probes service liveness and readiness at `GET /api/health`, asserting HTTP status `200 OK` and payload `{"status": "healthy"}`. | **PASS** |
| **TC-18** | **REST Gateway** | `test_18_api_summarization_endpoint_execution` | Sends `POST /api/summarize` for `frequency`, `tfidf`, and `hybrid` algorithms, verifying complete response schema: extracted summary, scored sentences array, and telemetry. | **PASS** |
| **TC-19** | **REST Gateway** | `test_19_api_request_validation_and_rejection` | Enforces Pydantic v2 validation: rejects empty text payloads, short inputs ($<10$ chars), and unsupported algorithm strings with HTTP `422 Unprocessable Content`. | **PASS** |
| **TC-20** | **Persistence** | `test_20_sqlite_history_persistence_crud_lifecycle` | Validates complete SQLite persistence lifecycle: `POST /api/history` (create), `GET /api/history` (list), `GET /api/history/{id}` (fetch), `DELETE /api/history/{id}` (remove), and verifies HTTP `404 Not Found` on deleted IDs. | **PASS** |
