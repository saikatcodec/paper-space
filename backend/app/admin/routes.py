from fastapi import APIRouter, Depends, HTTPException
from app.admin.services import Services
from sqlmodel.ext.asyncio.session import AsyncSession
from starlette import status
from sqlmodel import select

from app.db import get_session
from app.admin.models import Publications, Profile
from app.admin.schemas import Url

admin_router = APIRouter()
services = Services()


@admin_router.post("/add_all_research")
async def list_down_all_publication(
    url: Url | None = None, session: AsyncSession = Depends(get_session)
):
    """
    Add all research publications from a given URL to the database.
    This endpoint fetches publication data from a provided URL (or uses a default if none provided),
    and adds new publications to the database if they don't already exist.

    Args:
        url (Url | None): Optional URL object containing the source URL for publications.
        session (AsyncSession): Database session dependency.

    Returns:
        dict: Dictionary containing:
            - size (int): Number of new publications added
            - data (list): List of newly added Publication objects
    """
    try:
        content = await services.list_down_all_publication(url.url if url else None)

        if not content:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="No content found"
            )

        publications = [Publications(**pub.dict()) for pub in content]
        new_publications = []
        for pub in publications:
            statement = select(Publications).where(Publications.link == pub.link)
            result = await session.exec(statement)
            result = result.first()

            if not result:
                new_publications.append(pub)

        session.add_all(new_publications)
        await session.commit()

        return {"size": len(new_publications), "data": new_publications}

    except Exception as e:
        print(f"Error listing publications: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.post("/add_profile_data")
async def get_profile(
    url: Url | None = None, session: AsyncSession = Depends(get_session)
):
    """
    Add profile data to the database based on the provided URL.
    This endpoint fetches profile data from a URL and stores it in the database.

    Parameters:
        url (Url | None): Optional URL object containing the profile data source.
                         If None, uses default source.
        session (AsyncSession): Database session dependency for database operations.

    Returns:
        dict: A dictionary containing the created profile data
    """
    try:
        content = await services.get_profile(url.url if url else None)

        if not content:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="No content found"
            )

        profile = Profile(**content.model_dump())
        session.add(profile)
        await session.commit()

        return {"data": profile}

    except Exception as e:
        print(f"Error getting profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )
