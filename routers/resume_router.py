from pathlib import Path
import shutil

from fastapi import (
    APIRouter,
    File,
    UploadFile,
    HTTPException
)

from utils.parser import parse_resume


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...)
):
    """
    Upload and parse candidate resume.
    """

    extension = Path(file.filename).suffix.lower()

    if extension not in [".pdf", ".docx"]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )

    save_path = UPLOAD_DIR / file.filename

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    resume_text = parse_resume(
        str(save_path)
    )

    if not resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Unable to extract text from resume."
        )

    return {
        "message": "Resume uploaded successfully.",
        "filename": file.filename,
        "resume_path": save_path,
        "characters": len(resume_text),
        "resume_text": resume_text
    }