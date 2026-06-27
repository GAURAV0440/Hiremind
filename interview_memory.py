from state.interview_state import InterviewState


# In-memory interview sessions
INTERVIEW_SESSIONS: dict[str, InterviewState] = {}


def create_session(
    session_id: str,
    state: InterviewState
) -> None:
    """
    Create a new interview session.
    """

    INTERVIEW_SESSIONS[session_id] = state


def get_session(
    session_id: str
) -> InterviewState | None:
    """
    Get interview session.
    """

    return INTERVIEW_SESSIONS.get(session_id)


def update_session(
    session_id: str,
    state: InterviewState
) -> None:
    """
    Update interview session.
    """

    INTERVIEW_SESSIONS[session_id] = state


def delete_session(
    session_id: str
) -> None:
    """
    Remove interview session.
    """

    INTERVIEW_SESSIONS.pop(session_id, None)