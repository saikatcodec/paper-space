import uuid
from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db import get_session
from app.admin.models import News, Publications, Profile, Paper

user_router = APIRouter()


@user_router.get("/get_profile")
async def get_profile_by_id(session: AsyncSession = Depends(get_session)):
    try:
        result = await session.exec(select(Profile))
        profile = result.first()

        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
            )
        return profile
    except Exception as e:
        print(f"Error getting profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@user_router.get("/get_all_research")
async def get_all_research(session: AsyncSession = Depends(get_session)):
    """
    Retrieve all research publications from the database.

    Args:
        session (AsyncSession): Database session dependency.

    Returns:
        list: List of all Publication objects from the database.
    """
    try:
        statement = select(Publications).order_by(Publications.pub_date.desc())
        result = await session.exec(statement)
        publications = result.all()

        if not publications:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="No publications found"
            )

        return publications
    except Exception as e:
        print(f"Error fetching publications: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@user_router.get("/paper/{paper_id}")
async def get_paper_by_id(
    paper_id: uuid.UUID, session: AsyncSession = Depends(get_session)
):
    """
    Retrieve a research publication by its ID.

    Args:
        paper_id (int): Publication ID.
        session (AsyncSession): Database session dependency.

    Returns:
        Publication: Publication object.
    """
    try:
        statement = select(Paper).where(Paper.id == paper_id)
        result = await session.exec(statement)
        paper = result.first()

        statement = select(Publications).where(Publications.id == paper.id)
        result = await session.exec(statement)
        publication = result.first()

        if not paper or not publication:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Paper not found"
            )

        combined = {**paper.__dict__, **publication.__dict__}
        return combined

    except Exception as e:
        print(f"Error fetching publication: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@user_router.get("/news", response_model=list[News])
async def get_all_news(session: AsyncSession = Depends(get_session)):
    """
    Get all news items, ordered by publish date descending.
    """
    try:
        statement = select(News).order_by(News.publish_date.desc())
        result = await session.exec(statement)
        news = result.all()
        return news
    except Exception as e:
        print(f"Error fetching news: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@user_router.get("/news/{news_id}", response_model=News)
async def get_news_by_id(news_id: str, session: AsyncSession = Depends(get_session)):
    """
    Get a specific news item by ID.
    """
    try:
        news = await session.get(News, news_id)
        if not news:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="News not found"
            )
        return news
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching news: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )
