from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings

from routers.resume_router import router as resume_router
from routers.interview_router import router as interview_router


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    debug=settings.DEBUG
)


# ==========================
# CORS
# ==========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==========================
# Routers
# ==========================

app.include_router(
    resume_router,
    prefix=settings.API_V1_PREFIX
)

app.include_router(
    interview_router,
    prefix=settings.API_V1_PREFIX
)


# ==========================
# Health Check
# ==========================

@app.get("/")
async def root():
    return {
        "application": settings.APP_NAME,
        "status": "running",
        "environment": settings.ENVIRONMENT
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }