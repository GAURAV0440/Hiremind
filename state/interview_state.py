from typing import TypedDict


class InterviewState(TypedDict):
    # ==========================
    # Session
    # ==========================
    session_id: str

    # ==========================
    # Input
    # ==========================
    resume_path: str
    resume_text: str
    job_description: str

    # ==========================
    # Candidate Analysis
    # ==========================
    candidate_category: str
    candidate_level: str
    interview_difficulty: str

    extracted_skills: list[str]
    candidate_projects: list[dict]
    candidate_experience: list[dict]
    candidate_education: list[dict]

    # ==========================
    # Job Description Analysis
    # ==========================
    jd_required_skills: list[str]
    jd_preferred_skills: list[str]
    jd_responsibilities: list[str]
    jd_tools: list[str]
    jd_experience: str

    # ==========================
    # Resume ↔ JD Matching
    # ==========================
    matched_skills: list[str]
    missing_skills: list[str]
    extra_skills: list[str]
    resume_match_score: float

    # ==========================
    # Interview Planning
    # ==========================
    interview_plan: list[str]
    current_topic: str
    covered_topics: list[str]
    remaining_topics: list[str]

    # ==========================
    # Interview Flow
    # ==========================
    current_question: str
    previous_answer: str

    asked_questions: list[str]

    interview_history: list[dict]

    # ==========================
    # Counters
    # ==========================
    question_number: int
    followup_count: int

    # ==========================
    # Evaluation
    # ==========================
    score: float
    total_score: float

    strengths: list[str]
    weaknesses: list[str]

    topic_score: float

    # ==========================
    # Confidence
    # ==========================
    interview_confidence: float

    # ==========================
    # Strategy
    # ==========================
    next_action: str

    # ==========================
    # Interview Status
    # ==========================
    interview_finished: bool

    # ==========================
    # Final Report
    # ==========================
    report: str