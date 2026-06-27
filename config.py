from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # ==========================
    # Application
    # ==========================
    APP_NAME: str
    DEBUG: bool
    ENVIRONMENT: str

    # ==========================
    # API
    # ==========================
    API_V1_PREFIX: str

    # ==========================
    # Database
    # ==========================
    DATABASE_URL: str

    # ==========================
    # Uploads
    # ==========================
    UPLOAD_DIR: str
    MAX_FILE_SIZE: int
    SUPPORTED_FILE_TYPES: str

    # ==========================
    # Reports
    # ==========================
    REPORT_DIR: str
    GENERATE_PDF_REPORT: bool

    # ==========================
    # Logging
    # ==========================
    LOG_LEVEL: str
    LOG_FILE: str

    # ==========================
    # Interview
    # ==========================
    MAX_INTERVIEW_QUESTIONS: int
    MAX_FOLLOWUP_QUESTIONS: int

    QUESTION_TIMEOUT_SECONDS: int
    INTERVIEW_TIMEOUT_MINUTES: int

    MIN_PASS_SCORE: float

    SESSION_TIMEOUT_MINUTES: int

    # ==========================
    # LLM
    # ==========================

    LLM_PROVIDER: str

    MODEL_NAME: str

    TEMPERATURE: float

    # ---------- Groq ----------
    GROQ_API_KEY: str = ""

    # ---------- Gemini ----------
    GOOGLE_API_KEY: str = ""

    # ---------- OpenAI ----------
    OPENAI_API_KEY: str = ""

    # ==========================
    # Voice
    # ==========================

    MAX_AUDIO_DURATION_SECONDS: int

    # ==========================
    # Websocket
    # ==========================

    WEBSOCKET_PING_INTERVAL: int

    # ==========================
    # Rate Limit
    # ==========================

    RATE_LIMIT: str

    # ==========================
    # Frontend
    # ==========================

    FRONTEND_URL: str

    # ==========================
    # Timezone
    # ==========================

    TIMEZONE: str

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()