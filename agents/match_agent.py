from state.interview_state import InterviewState


def normalize(skills: list[str]) -> set[str]:
    """
    Normalize skills.
    """

    normalized = set()

    for skill in skills:

        skill = skill.strip().lower()

        if skill:
            normalized.add(skill)

    return normalized


def match_agent(state: InterviewState) -> InterviewState:
    """
    Compare Resume vs JD.
    """

    resume = normalize(
        state["extracted_skills"]
    )

    required = normalize(
        state["jd_required_skills"]
    )

    preferred = normalize(
        state["jd_preferred_skills"]
    )

    jd = required | preferred

    if not jd:

        state["matched_skills"] = sorted(resume)

        state["missing_skills"] = []

        state["extra_skills"] = []

        state["resume_match_score"] = 100.0

        return state

    matched_required = resume & required

    matched_preferred = resume & preferred

    matched = sorted(
        matched_required | matched_preferred
    )

    missing = sorted(
        jd - resume
    )

    extra = sorted(
        resume - jd
    )

    # -----------------------------
    # Weighted Score
    # Required = 70%
    # Preferred = 30%
    # -----------------------------

    required_score = 100

    if required:

        required_score = (
            len(matched_required)
            / len(required)
        ) * 100

    preferred_score = 100

    if preferred:

        preferred_score = (
            len(matched_preferred)
            / len(preferred)
        ) * 100

    final_score = (
        required_score * 0.7
        + preferred_score * 0.3
    )

    state["matched_skills"] = matched

    state["missing_skills"] = missing

    state["extra_skills"] = extra

    state["resume_match_score"] = round(
        final_score,
        2
    )

    return state