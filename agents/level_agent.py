import re

from state.interview_state import InterviewState


def level_agent(state: InterviewState) -> InterviewState:
    """
    Determine candidate category and interview difficulty.

    Candidate Category:
    - Fresher (<1 year full-time)
    - Experienced (1-3 years full-time)
    - Senior (3+ years full-time)

    Interview Difficulty:
    - Basic
    - Medium
    - Advanced
    """

    # ==========================
    # Candidate Category
    # ==========================

    full_time_years = 0.0

    for exp in state["candidate_experience"]:

        if not isinstance(exp, dict):
            continue

        title = (
            exp.get("title", "")
            + " "
            + exp.get("company", "")
        ).lower()

        # Ignore internships
        if "intern" in title:
            continue

        duration = exp.get("duration", "")

        numbers = re.findall(
            r"\d+\.?\d*",
            duration
        )

        if numbers:
            full_time_years += float(numbers[0])

    if full_time_years < 1:
        category = "Fresher"

    elif full_time_years < 3:
        category = "Experienced"

    else:
        category = "Senior"

    state["candidate_category"] = category
    state["candidate_level"] = category

    # ==========================
    # Interview Difficulty
    # ==========================

    difficulty_score = 0

    difficulty_score += min(
        len(state["candidate_projects"]),
        4
    )

    difficulty_score += min(
        len(state["extracted_skills"]) // 5,
        4
    )

    internship_count = 0

    for exp in state["candidate_experience"]:

        if not isinstance(exp, dict):
            continue

        title = (
            exp.get("title", "")
            + " "
            + exp.get("company", "")
        ).lower()

        if "intern" in title:
            internship_count += 1

    difficulty_score += internship_count

    if difficulty_score >= 8:
        difficulty = "Advanced"

    elif difficulty_score >= 4:
        difficulty = "Medium"

    else:
        difficulty = "Basic"

    state["interview_difficulty"] = difficulty

    return state