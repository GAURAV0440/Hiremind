from pathlib import Path

import pdfplumber
from docx import Document


SUPPORTED_FORMATS = {
    ".pdf",
    ".docx"
}


def parse_resume(file_path: str) -> str:
    """
    Parse a resume file and return cleaned text.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(file_path)

    extension = path.suffix.lower()

    if extension not in SUPPORTED_FORMATS:
        raise ValueError(
            "Only PDF and DOCX files are supported."
        )

    if extension == ".pdf":
        text = parse_pdf(file_path)
    else:
        text = parse_docx(file_path)

    return clean_text(text)


def parse_pdf(file_path: str) -> str:
    """
    Extract text from PDF.
    """

    pages = []

    with pdfplumber.open(file_path) as pdf:

        for page in pdf.pages:

            page_text = page.extract_text()

            if page_text:
                pages.append(page_text)

    return "\n".join(pages)


def parse_docx(file_path: str) -> str:
    """
    Extract text from DOCX.
    """

    document = Document(file_path)

    paragraphs = [
        p.text
        for p in document.paragraphs
        if p.text.strip()
    ]

    return "\n".join(paragraphs)


def clean_text(text: str) -> str:
    """
    Clean extracted text.
    """

    replacements = [
        "(cid:131)",
        "(cid:239)",
        "(cid:240)",
        "(cid:8226)",
        "\x00",
        "\uf0b7",
        "\ufeff"
    ]

    for item in replacements:
        text = text.replace(item, " ")

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    return "\n".join(lines)