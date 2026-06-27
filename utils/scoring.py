def calculate_average_score(history: list[dict]) -> float:
    """
    Calculate interview average score.
    """

    if not history:
        return 0.0

    total = sum(
        item["score"]
        for item in history
    )

    return round(
        total / len(history),
        2
    )


def calculate_verdict(score: float) -> str:
    """
    Generate interview verdict.
    """

    if score >= 8:
        return "Strong Hire"

    if score >= 6:
        return "Hire"

    if score >= 4:
        return "Borderline"

    return "Reject"

def calculate_confidence(
    covered_topics: list[str],
    interview_plan: list[str],
    average_score: float
) -> float:
    """
    Calculate interview confidence.
    """

    if not interview_plan:
        return 0.0

    coverage = (
        len(covered_topics)
        / len(interview_plan)
    ) * 100

    score_component = (
        average_score / 10
    ) * 100

    confidence = (
        coverage * 0.6
        + score_component * 0.4
    )

    return round(
        min(confidence, 100),
        2
    )