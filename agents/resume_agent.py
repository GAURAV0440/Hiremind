import json

from llm.provider import ask_llm

from prompts import RESUME_ANALYZER_PROMPT
from state.interview_state import InterviewState


def resume_agent(state: InterviewState) -> InterviewState:
    """
    Analyze the resume and extract structured candidate information.
    """

    prompt = RESUME_ANALYZER_PROMPT.format(
        resume=state["resume_text"]
    )

    try:

        response = ask_llm(prompt)

        data = json.loads(response)

        state["extracted_skills"] = data.get(
            "Technical Skills",
            []
        )

        state["candidate_projects"] = data.get(
            "Projects",
            []
        )

        state["candidate_experience"] = data.get(
            "Experience",
            []
        )

        state["candidate_education"] = data.get(
            "Education",
            []
        )

    except Exception:

        state["extracted_skills"] = []

        state["candidate_projects"] = []

        state["candidate_experience"] = []

        state["candidate_education"] = []

    return state