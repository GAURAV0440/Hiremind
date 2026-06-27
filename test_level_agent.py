from agents.level_agent import level_agent


state = {
    "resume_text": "",
    "job_description": "",
    "candidate_level": "",
    "extracted_skills": [
        "Python",
        "FastAPI",
        "SQL",
        "Machine Learning",
        "LangGraph",
        "Deep Learning"
    ],
    "current_question": "",
    "previous_answer": "",
    "asked_questions": [],
    "score": 0.0,
    "strengths": [],
    "weaknesses": [],
    "next_action": "",
    "report": ""
}


updated_state = level_agent(state)

print("\n===== LEVEL =====")
print(updated_state["candidate_level"])
print("=================\n")