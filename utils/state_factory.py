from state.interview_state import InterviewState


def create_initial_state(
    session_id: str,
    resume_path: str,
    resume_text: str,
    job_description: str
) -> InterviewState:

    return {

        # ==========================
        # Session
        # ==========================

        "session_id": session_id,

        # ==========================
        # Input
        # ==========================

        "resume_path": resume_path,
        "resume_text": resume_text,
        "job_description": job_description,

        # ==========================
        # Candidate Analysis
        # ==========================

        "candidate_category": "",
        "candidate_level": "",
        "interview_difficulty": "",
        "extracted_skills": [],
        "candidate_projects": [],
        "candidate_experience": [],
        "candidate_education": [],

        # ==========================
        # JD Analysis
        # ==========================

        "jd_required_skills": [],
        "jd_preferred_skills": [],
        "jd_responsibilities": [],
        "jd_tools": [],
        "jd_experience": "",

        # ==========================
        # Resume ↔ JD Matching
        # ==========================

        "matched_skills": [],
        "missing_skills": [],
        "extra_skills": [],
        "resume_match_score": 0.0,

        # ==========================
        # Interview Planning
        # ==========================

        "interview_plan": [],
        "current_topic": "",
        "covered_topics": [],
        "remaining_topics": [],

        # ==========================
        # Interview Flow
        # ==========================

        "current_question": "",
        "previous_answer": "",
        "asked_questions": [],
        "interview_history": [],

        # ==========================
        # Counters
        # ==========================

        "question_number": 0,
        "followup_count": 0,
        "consecutive_low_scores": 0,

        # ==========================
        # Evaluation
        # ==========================

        "score": 0.0,
        "topic_score": 0.0,
        "total_score": 0.0,

        "strengths": [],
        "weaknesses": [],

        # ==========================
        # Confidence
        # ==========================

        "interview_confidence": 0.0,

        # ==========================
        # Strategy
        # ==========================

        "next_action": "",

        # ==========================
        # Status
        # ==========================

        "interview_finished": False,

        # ==========================
        # Report
        # ==========================

        "report": ""
    }