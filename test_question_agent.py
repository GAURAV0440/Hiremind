from agents.question_agent import question_agent


state = {
    "resume_text": "",
    "job_description": """
Looking for an AI Engineer with experience in Python,
FastAPI, SQL, Machine Learning and LangGraph.
""",

    "candidate_level": "Advanced",

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


updated_state = question_agent(state)

print("\n===== QUESTION =====")
print(updated_state["current_question"])
print("====================\n")