"""
FastAPI Summary Length Slider & Pydantic Boundary Validation Tests
==================================================================
Comprehensive pytest suite covering:
1. Valid boundary target (num_sentences=20 on a 30-sentence document) -> 200 OK, 20 sentences returned
2. Invalid boundary target (num_sentences=21 payload limit) -> 422 Unprocessable Entity
3. Clamping test (num_sentences=20 on a 3-sentence document) -> 200 OK, graceful clamp to 3 sentences
4. Zero / Negative validation test (num_sentences=0 and num_sentences=-1) -> 422 Unprocessable Entity
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

# 30-sentence sample document for boundary testing
THIRTY_SENTENCE_DOC = " ".join([
    f"Sentence number {i} describes an essential factual aspect of the natural language pipeline."
    for i in range(1, 31)
])

# 3-sentence sample document for clamping testing
THREE_SENTENCE_DOC = (
    "Natural language processing enables computers to extract salient information from source texts. "
    "Extractive summarization preserves original phrasing to eliminate factual hallucinations. "
    "Chronological sentence order restoration ensures readability and coherent narrative flow."
)


def test_valid_boundary_max_sentences_returns_200():
    """
    1. Valid Boundary Test:
    Send a request with num_sentences=20 on a document with 30 sentences.
    Assert response status is 200, and exactly 20 sentences are returned.
    """
    payload = {
        "text": THIRTY_SENTENCE_DOC,
        "method": "frequency",
        "num_sentences": 20
    }
    response = client.post("/api/summarize", json=payload)
    
    assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}: {response.text}"
    data = response.json()
    
    # Assert statistics confirm exactly 20 sentences extracted
    assert data["statistics"]["summary_sentence_count"] == 20
    assert data["statistics"]["original_sentence_count"] >= 30
    
    # Assert annotated sentences array contains exactly 20 selected sentences
    selected_sentences = [s for s in data["sentences"] if s["selected"]]
    assert len(selected_sentences) == 20
    
    # Verify non-empty summary text
    assert len(data["summary"].strip()) > 0


def test_invalid_boundary_exceeds_max_returns_422():
    """
    2. Invalid Boundary Test (Payload limit):
    Send a request with num_sentences=21.
    Assert response status is 422 (Unprocessable Entity), verifying Pydantic le=20 constraint.
    """
    payload = {
        "text": THIRTY_SENTENCE_DOC,
        "method": "frequency",
        "num_sentences": 21
    }
    response = client.post("/api/summarize", json=payload)
    
    assert response.status_code == 422, f"Expected 422 Unprocessable Entity, got {response.status_code}"
    error_details = response.json().get("detail", [])
    
    # Verify Pydantic validation error explicitly mentions num_sentences and the upper bound limit
    field_errors = [e for e in error_details if "num_sentences" in e.get("loc", [])]
    assert len(field_errors) > 0, "Expected validation error on 'num_sentences' field"
    assert any("20" in e.get("msg", "") for e in field_errors), "Expected error message to mention maximum limit of 20"


def test_clamping_graceful_handling_returns_200():
    """
    3. Clamping Test (Graceful Failure / Clamping):
    Send a request with num_sentences=20 on a document with only 3 sentences.
    Assert response status is 200, and it returns exactly 3 sentences without crashing.
    """
    payload = {
        "text": THREE_SENTENCE_DOC,
        "method": "frequency",
        "num_sentences": 20
    }
    response = client.post("/api/summarize", json=payload)
    
    assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}: {response.text}"
    data = response.json()
    
    # Assert engine gracefully clamped to available sentence count (3)
    assert data["statistics"]["original_sentence_count"] == 3
    assert data["statistics"]["summary_sentence_count"] == 3
    
    selected_sentences = [s for s in data["sentences"] if s["selected"]]
    assert len(selected_sentences) == 3


def test_zero_and_negative_num_sentences_returns_422():
    """
    4. Zero / Negative Test:
    Send num_sentences=0 and num_sentences=-1.
    Assert 422 Unprocessable Entity for both requests (ge=1 constraint).
    """
    # Test num_sentences = 0
    resp_zero = client.post("/api/summarize", json={
        "text": THREE_SENTENCE_DOC,
        "method": "frequency",
        "num_sentences": 0
    })
    assert resp_zero.status_code == 422, f"Expected 422 for num_sentences=0, got {resp_zero.status_code}"
    errors_zero = resp_zero.json().get("detail", [])
    assert any("num_sentences" in e.get("loc", []) for e in errors_zero)

    # Test num_sentences = -1
    resp_neg = client.post("/api/summarize", json={
        "text": THREE_SENTENCE_DOC,
        "method": "frequency",
        "num_sentences": -1
    })
    assert resp_neg.status_code == 422, f"Expected 422 for num_sentences=-1, got {resp_neg.status_code}"
    errors_neg = resp_neg.json().get("detail", [])
    assert any("num_sentences" in e.get("loc", []) for e in errors_neg)

