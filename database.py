from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker
)
from sqlalchemy.orm import DeclarativeBase

from config import settings


# Base class for all models
class Base(DeclarativeBase):
    pass


# Async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG
)


# Session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)


# Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session