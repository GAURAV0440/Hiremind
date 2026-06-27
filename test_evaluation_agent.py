from agents.evaluation_agent import evaluation_agent


state = {
    "resume_text": "",
    "job_description": "",
    "candidate_level": "Advanced",
    "extracted_skills": [],
    "current_question":
        "When deploying a LangGraph-based AI agent via FastAPI, what are your key considerations for ensuring production reliability, scalability, and effective state management across graph iterations?",

    "previous_answer":
        """
I would use FastAPI with async endpoints and LangGraph for orchestration.
State can be stored in Redis or PostgreSQL.
For scalability I would containerize using Docker and deploy behind a load balancer.
I would also use monitoring and logging.
""",

    "asked_questions": [],
    "score": 0.0,
    "strengths": [],
    "weaknesses": [],
    "next_action": "",
    "report": ""
}


updated_state = evaluation_agent(state)

print("\n===== SCORE =====")
print(updated_state["score"])

print("\n===== STRENGTHS =====")
print(updated_state["strengths"])

print("\n===== WEAKNESSES =====")
print(updated_state["weaknesses"])

print("\n===== NEXT ACTION =====")
print(updated_state["next_action"])