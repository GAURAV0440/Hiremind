from config import settings

from llm.provider import ask_llm

from prompts import (
    QUESTION_GENERATOR_PROMPT,
    FOLLOWUP_QUESTION_PROMPT
)

from state.interview_state import InterviewState


def question_agent(state: InterviewState) -> InterviewState:
    """
    Generate the next interview question.
    """

    if (
        state["interview_confidence"] >= 90
        or state["question_number"] >= settings.MAX_INTERVIEW_QUESTIONS
        or (
            not state["remaining_topics"]
            and state.get("next_action") != "ask_followup"
        )
    ):

        state["next_action"] = "end_interview"
        state["interview_finished"] = True

        return state

    is_followup = (
        state.get("next_action") == "ask_followup"
    )

    # =====================================
    # Follow-up Question
    # =====================================

    if is_followup:

        prompt = FOLLOWUP_QUESTION_PROMPT.format(
            topic=state["current_topic"],
            question=state["current_question"],
            answer=state["previous_answer"],
            weaknesses=state["weaknesses"]
        )

    # =====================================
    # New Topic
    # =====================================

    else:

        state["current_topic"] = (
            state["remaining_topics"][0]
        )

        prompt = QUESTION_GENERATOR_PROMPT.format(
            topic=state["current_topic"],
            category=state["candidate_category"],
            difficulty=state["interview_difficulty"],
            skills=state["extracted_skills"],
            projects=state["candidate_projects"],
            experience=state["candidate_experience"],
            education=state["candidate_education"],
            job_description=state["job_description"],
            asked_questions=state["asked_questions"]
        )

    try:

        question = ask_llm(
            prompt,
            max_tokens=250
        ).strip()

    except Exception:

        question = (
            f"Can you explain how you used "
            f"{state['current_topic']} "
            f"in one of your projects?"
        )

    state["current_question"] = question

    if not is_followup:

        state["question_number"] += 1

        state["asked_questions"].append(question)

    return state