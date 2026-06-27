from config import settings
from state.interview_state import InterviewState


CONFIDENCE_THRESHOLD = 85.0
LOW_SCORE_LIMIT = 3


def _complete_current_topic(state: InterviewState):
    """
    Move the current topic from remaining_topics
    to covered_topics.
    """

    topic = state.get("current_topic", "")

    if (
        topic
        and topic in state["remaining_topics"]
    ):
        state["remaining_topics"].remove(topic)

    if (
        topic
        and topic not in state["covered_topics"]
    ):
        state["covered_topics"].append(topic)


def strategy_agent(state: InterviewState) -> InterviewState:
    """
    Decide the next interview action.
    Pure Python logic.
    """

    # ==========================================
    # End interview after repeated weak answers
    # ==========================================

    if state["consecutive_low_scores"] >= LOW_SCORE_LIMIT:

        _complete_current_topic(state)

        state["next_action"] = "end_interview"
        state["interview_finished"] = True

        return state

    # ==========================================
    # End interview
    # ==========================================

    if state["interview_confidence"] >= CONFIDENCE_THRESHOLD:

        _complete_current_topic(state)

        state["next_action"] = "end_interview"
        state["interview_finished"] = True

        return state

    if state["question_number"] >= settings.MAX_INTERVIEW_QUESTIONS:

        _complete_current_topic(state)

        state["next_action"] = "end_interview"
        state["interview_finished"] = True

        return state

    # ==========================================
    # Strong answer
    # ==========================================

    if state["topic_score"] >= 8:

        _complete_current_topic(state)

        state["followup_count"] = 0

        if not state["remaining_topics"]:
            state["next_action"] = "end_interview"
            state["interview_finished"] = True
        else:
            state["next_action"] = "next_question"

        return state

    # ==========================================
    # Average answer
    # ==========================================

    if state["topic_score"] >= 6:

        if (
            state["followup_count"]
            < settings.MAX_FOLLOWUP_QUESTIONS
        ):

            state["followup_count"] += 1

            state["next_action"] = "ask_followup"

        else:

            _complete_current_topic(state)

            state["followup_count"] = 0

            if not state["remaining_topics"]:
                state["next_action"] = "end_interview"
                state["interview_finished"] = True
            else:
                state["next_action"] = "next_question"

        return state

    # ==========================================
    # Weak answer
    # ==========================================

    if (
        state["followup_count"]
        < settings.MAX_FOLLOWUP_QUESTIONS
    ):

        state["followup_count"] += 1

        state["next_action"] = "ask_followup"

    else:

        _complete_current_topic(state)

        state["followup_count"] = 0

        if not state["remaining_topics"]:
            state["next_action"] = "end_interview"
            state["interview_finished"] = True
        else:
            state["next_action"] = "next_question"

    return state