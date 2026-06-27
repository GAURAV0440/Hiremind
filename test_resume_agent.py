from utils.parser import parse_resume
from agents.resume_agent import resume_agent


state = {
    "resume_text": parse_resume(
        "uploads/GauravChawla_Resume_AI.pdf"
    ),

    "job_description": "",

    "candidate_level": "",

    "extracted_skills": [],
    "candidate_projects": [],
    "candidate_experience": [],
    "candidate_education": [],

    "current_question": "",
    "previous_answer": "",
    "asked_questions": [],

    "question_number": 0,
    "followup_count": 0,

    "score": 0.0,

    "strengths": [],
    "weaknesses": [],

    "next_action": "",

    "interview_finished": False,

    "report": ""
}


updated_state = resume_agent(state)


print("\n===== SKILLS =====")
print(updated_state["extracted_skills"])

print("\n===== PROJECTS =====")
print(updated_state["candidate_projects"])

print("\n===== EXPERIENCE =====")
print(updated_state["candidate_experience"])

print("\n===== EDUCATION =====")
print(updated_state["candidate_education"])