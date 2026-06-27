from datetime import datetime

from sqlalchemy import Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    candidate_id: Mapped[int] = mapped_column(
        ForeignKey(
            "candidates.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    verdict: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    score: Mapped[float] = mapped_column(
        nullable=False
    )

    strengths: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    weaknesses: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    report: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )