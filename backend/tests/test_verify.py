import pytest
from backend.app.verify import snippet_in_source, filter_claims

SOURCE_SAMPLE = (
    "The Adalaj stepwell was built in 1498 by Queen Rudabai in memory of Rana Veer Singh. "
    "It features Solanki style subterranean five-storey architecture with elaborate octagonal shafts."
)

def test_snippet_present_exactly():
    snippet = "built in 1498 by Queen Rudabai"
    assert snippet_in_source(snippet, SOURCE_SAMPLE) is True

def test_snippet_case_and_whitespace_variation():
    snippet = "  BUILT   in  1498 by   queen  rudabai  "
    assert snippet_in_source(snippet, SOURCE_SAMPLE) is True

def test_snippet_shorter_than_four_words():
    snippet = "Queen Rudabai 1498"
    assert snippet_in_source(snippet, SOURCE_SAMPLE) is False

def test_invented_snippet_not_in_source():
    snippet = "built in 1650 by Emperor Shah Jahan"
    assert snippet_in_source(snippet, SOURCE_SAMPLE) is False

def test_empty_snippet():
    assert snippet_in_source("", SOURCE_SAMPLE) is False
    assert snippet_in_source("   ", SOURCE_SAMPLE) is False

def test_filter_claims():
    claims = [
        {"text": "Built in 1498 by Queen Rudabai", "snippet": "built in 1498 by Queen Rudabai"},
        {"text": "Fake claim about Taj Mahal", "snippet": "built in 1650 by Emperor Shah Jahan"},
        {"text": "Short snippet claim", "snippet": "Queen Rudabai"},
        {"text": "Subterranean architecture", "snippet": "subterranean five-storey architecture with elaborate octagonal"},
    ]
    survivors = filter_claims(claims, SOURCE_SAMPLE)
    assert len(survivors) == 2
    assert survivors[0]["text"] == "Built in 1498 by Queen Rudabai"
    assert survivors[1]["text"] == "Subterranean architecture"

