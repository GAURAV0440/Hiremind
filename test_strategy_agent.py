from agents.strategy_agent import strategy_agent


state = {
    "resume_text": "",
    "job_description": "",
    "candidate_level": "Advanced",
    "extracted_skills": [],
    "current_question": "",
    "previous_answer": "",
    "asked_questions": [],
    "score": 6,
    "strengths": [],
    "weaknesses": [
        "State management",
        "Error handling"
    ],
    "next_action": "",
    "report": ""
}


updated_state = strategy_agent(state)

print("\n===== NEXT ACTION =====")
print(updated_state["next_action"])
print("=======================\n")