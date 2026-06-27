from agents.strategy_agent import strategy_agent


state = {
    "resume_text": "",
    "job_description": "",

    "candidate_level": "",
    "extracted_skills": [],

    "current_question": "",
    "previous_answer": "",
    "asked_questions": [],

    "question_number": 3,
    "followup_count": 0,

    "score": 6,

    "strengths": [],
    "weaknesses": [],

    "next_action": "",

    "interview_finished": False,

    "report": ""
}


updated_state = strategy_agent(state)

print(updated_state["next_action"])
print(updated_state["followup_count"])
print(updated_state["interview_finished"])