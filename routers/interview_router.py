import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from utils.parser import parse_resume

from agents.resume_agent import resume_agent
from agents.jd_agent import jd_agent
from agents.match_agent import match_agent
from agents.level_agent import level_agent
from agents.interview_planner import interview_planner
from agents.question_agent import question_agent
from agents.evaluation_agent import evaluation_agent
from agents.strategy_agent import strategy_agent
from agents.report_agent import report_agent

from interview_memory import (
    create_session,
    get_session,
    update_session
)
from utils.state_factory import create_initial_state


router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)


class StartInterviewRequest(BaseModel):
    resume_path: str
    job_description: str = ""


class AnswerRequest(BaseModel):
    session_id: str
    answer: str


@router.post("/start")
async def start_interview(payload: StartInterviewRequest):
    """
    Start a new interview.
    """

    resume_text = parse_resume(
        payload.resume_path
    )

    if not resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Unable to parse resume."
        )

    session_id = str(uuid.uuid4())
    state = create_initial_state(
        session_id=session_id,
        resume_path=payload.resume_path,
        resume_text=resume_text,
        job_description=payload.job_description
    )
    # ==========================
    # Pipeline
    # ==========================

    state = resume_agent(state)

    state = jd_agent(state)

    state = match_agent(state)

    state = level_agent(state)

    state = interview_planner(state)

    state = question_agent(state)

    create_session(
        session_id,
        state
    )

    return {
        "session_id": session_id,
        "candidate_category": state["candidate_category"],
        "resume_match_score": state["resume_match_score"],
        "current_topic": state["current_topic"],
        "question": state["current_question"]
    }


@router.post("/answer")
async def submit_answer(payload: AnswerRequest):
    """
    Submit candidate answer.
    """

    state = get_session(
        payload.session_id
    )

    if state is None:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found."
        )

    state["previous_answer"] = payload.answer

    state = evaluation_agent(state)

    state["interview_history"].append(
        {
            "topic": state["current_topic"],
            "question": state["current_question"],
            "answer": state["previous_answer"],
            "score": state["score"],
            "strengths": state["strengths"],
            "weaknesses": state["weaknesses"]
        }
    )

    state = strategy_agent(state)

    if state["next_action"] == "end_interview":

        state = report_agent(state)

        state["interview_finished"] = True

        update_session(
            payload.session_id,
            state
        )

        return {
            "interview_finished": True,
            "average_score": round(
                state["total_score"] /
                max(state["question_number"], 1),
                2
            ),
            "resume_match_score": state["resume_match_score"],
            "interview_confidence": state["interview_confidence"],
            "report": state["report"]
        }

    state = question_agent(state)

    update_session(
        payload.session_id,
        state
    )

    return {
        "interview_finished": False,
        "current_topic": state["current_topic"],
        "score": state["score"],
        "confidence": state["interview_confidence"],
        "strengths": state["strengths"],
        "weaknesses": state["weaknesses"],
        "next_action": state["next_action"],
        "next_question": state["current_question"]
    }