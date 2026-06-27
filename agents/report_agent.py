from llm.provider import ask_llm

from prompts import REPORT_PROMPT
from state.interview_state import InterviewState


def report_agent(state: InterviewState) -> InterviewState:
    """
    Generate the final interview report.
    """

    average_score = round(
        state["total_score"] /
        max(state["question_number"], 1),
        2
    )

    candidate_info = {
        "candidate_category": state["candidate_category"],
        "interview_difficulty": state["interview_difficulty"],
        "resume_match_score": state["resume_match_score"],
        "interview_confidence": state["interview_confidence"],
        "average_score": average_score,
        "questions_asked": state["question_number"],
        "topics_covered": state["covered_topics"],
        "missing_skills": state["missing_skills"],
        "strengths": state["strengths"],
        "weaknesses": state["weaknesses"]
    }

    prompt = REPORT_PROMPT.format(
        candidate_info=candidate_info
    )

    try:

        report = ask_llm(
            prompt,
            max_tokens=800
        )

    except Exception:

        if average_score >= 8:
            recommendation = "Strong Hire"

        elif average_score >= 6:
            recommendation = "Hire"

        elif average_score >= 4:
            recommendation = "Borderline"

        else:
            recommendation = "Reject"

        report = f"""
==============================
INTERVIEW REPORT
==============================

Candidate Category:
{state["candidate_category"]}

Interview Difficulty:
{state["interview_difficulty"]}

Resume Match:
{state["resume_match_score"]}%

Interview Confidence:
{state["interview_confidence"]}%

Average Score:
{average_score}/10

Questions Asked:
{state["question_number"]}

Topics Covered:
{", ".join(state["covered_topics"]) or "None"}

Missing JD Skills:
{", ".join(state["missing_skills"]) or "None"}

Recommendation:
{recommendation}

Strengths:
{chr(10).join("- " + s for s in state["strengths"]) or "- None"}

Weaknesses:
{chr(10).join("- " + w for w in state["weaknesses"]) or "- None"}

Interview Status:
Completed
"""

    state["report"] = report

    return state