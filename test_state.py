from state.interview_state import InterviewState


state: InterviewState = {
    "resume_text": "",
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

print(state)
