def _norm(s: str) -> str:
    """Normalize whitespace and case for robust exact-substring checking."""
    return " ".join((s or "").lower().split())

def snippet_in_source(snippet: str, source_text: str) -> bool:
    """
    Anti-hallucination check:
    Snippet must have at least 4 words and be present in normalized source text.
    """
    if not snippet or not source_text:
        return False
    sn = _norm(snippet)
    words = sn.split()
    if len(words) < 4:
        return False
    return sn in _norm(source_text)

def filter_claims(claims: list, source_text: str) -> list:
    """Keep only claims whose snippet is verified to exist in the source text."""
    return [c for c in claims if snippet_in_source(c.get("snippet", ""), source_text)]

