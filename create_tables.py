import asyncio

from database import engine, Base

from models.candidate_model import Candidate
from models.interview_model import Interview
from models.report_model import Report


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


asyncio.run(init_db())