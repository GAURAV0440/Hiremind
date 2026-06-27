from agents.report_agent import report_agent


state = {
    "resume_text": "",
    "job_description": "",
    "candidate_level": "Advanced",
    "extracted_skills": [],
    "current_question": "",
    "previous_answer": "",
    "asked_questions": [],
    "score": 6,
    "strengths": [
        "Python",
        "FastAPI"
    ],
    "weaknesses": [
        "LangGraph state management",
        "Error handling"
    ],
    "next_action": "ask_followup",
    "report": ""
}


updated_state = report_agent(state)

print("\n===== REPORT =====\n")
print(updated_state["report"])