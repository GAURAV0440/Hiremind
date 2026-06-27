import json

from llm.provider import ask_llm

from state.interview_state import InterviewState


JD_ANALYZER_PROMPT = """
You are an expert technical recruiter.

Analyze the following Job Description.

Return ONLY valid JSON.

{{
    "required_skills": [],
    "preferred_skills": [],
    "responsibilities": [],
    "tools": [],
    "experience": ""
}}

Job Description:

{job_description}
"""


def jd_agent(state: InterviewState) -> InterviewState:
    """
    Analyze the Job Description.
    """

    # No JD provided
    if not state["job_description"].strip():

        state["jd_required_skills"] = []
        state["jd_preferred_skills"] = []
        state["jd_responsibilities"] = []
        state["jd_tools"] = []
        state["jd_experience"] = ""

        return state

    prompt = JD_ANALYZER_PROMPT.format(
        job_description=state["job_description"]
    )

    try:

        response = ask_llm(prompt)

        data = json.loads(response)

        state["jd_required_skills"] = data.get(
            "required_skills",
            []
        )

        state["jd_preferred_skills"] = data.get(
            "preferred_skills",
            []
        )

        state["jd_responsibilities"] = data.get(
            "responsibilities",
            []
        )

        state["jd_tools"] = data.get(
            "tools",
            []
        )

        state["jd_experience"] = data.get(
            "experience",
            ""
        )

    except Exception:

        state["jd_required_skills"] = []
        state["jd_preferred_skills"] = []
        state["jd_responsibilities"] = []
        state["jd_tools"] = []
        state["jd_experience"] = ""

    return state