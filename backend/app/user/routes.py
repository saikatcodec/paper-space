from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db import get_session
from app.admin.models import Publications, Profile

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
