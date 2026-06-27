import json

from llm.provider import ask_llm

from prompts import EVALUATION_PROMPT
from state.interview_state import InterviewState
from utils.scoring import calculate_confidence

def evaluation_agent(state: InterviewState) -> InterviewState:
    """
    Evaluate candidate answer for the current topic.
    """

    prompt = EVALUATION_PROMPT.format(
        topic=state["current_topic"],
        question=state["current_question"],
        answer=state["previous_answer"]
    )

    try:

        response = ask_llm(
            prompt,
            max_tokens=300
        )

        evaluation = json.loads(response)

        score = float(
            evaluation.get("score", 0)
        )

        score = max(0.0, min(score, 10.0))

        strengths = evaluation.get(
            "strengths",
            []
        )

        if not isinstance(strengths, list):
            strengths = []

        weaknesses = evaluation.get(
            "weaknesses",
            []
        )

        if not isinstance(weaknesses, list):
            weaknesses = []

        topic_completed = evaluation.get(
            "topic_completed",
            True
        )

        state["score"] = score

        state["total_score"] += score

        state["strengths"] = strengths

        state["weaknesses"] = weaknesses

        state["topic_score"] = score

        # Update interview confidence
        average_score = (
            state["total_score"]
            / max(state["question_number"], 1)
        )

        state["interview_confidence"] = calculate_confidence(
            covered_topics=state["covered_topics"],
            interview_plan=state["interview_plan"],
            average_score=average_score
        )

        # Let Python strategy decide interview flow
        if topic_completed:
            state["next_action"] = "next_question"
        else:
            state["next_action"] = "ask_followup"

    except Exception:

        state["score"] = 0.0

        state["topic_score"] = 0.0

        state["strengths"] = []

        state["weaknesses"] = [
            "Evaluation failed."
        ]

        state["next_action"] = "next_question"

    return state