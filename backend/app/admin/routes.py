import asyncio
from fastapi import APIRouter, Depends, HTTPException
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt

from app.admin.services import Services

from sqlmodel.ext.asyncio.session import AsyncSession
from starlette import status
from sqlmodel import select

from app.db import get_session, engine  # Import engine from db.py
from app.admin.models import Publications, Profile, Paper, AdminUser, News
from app.admin.schemas import (
    Url,
    ProfileUpdate,
    Token,
    AdminUserCreate,
    AdminUserResponse,
    Publications as PublicationCreate,
    ProfileCreate,
    PaperCreate,
    PaperUpdate,
    NewsCreate,
    NewsUpdate,
)
from app.admin.auth import (
    SECRET_KEY,
    authenticate_admin,
    get_current_admin,
    create_token,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
    ALGORITHM,
)
from app.admin.utils import parse_date

admin_router = APIRouter()
services = Services()


@admin_router.post("/add_all_research")
async def list_down_all_publication(
    url: Url | None = None,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(
        get_current_admin
    ),  # Add this line to each route
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
    url: Url | None = None,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(
        get_current_admin
    ),  # Add this line to each route
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

        return {"msg": "Profile Added Successfully", "data": profile}

    except Exception as e:
        print(f"Error getting profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.patch("/update_profile/{profile_id}")
async def update_profile(
    profile_id: str | None = None,
    profile_update: ProfileUpdate | None = None,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(
        get_current_admin
    ),  # Add this line to each route
):
    """
    Asynchronously updates a user profile in the database.
    Args:
        profile_id (str): The unique identifier of the profile to update.
        profile_update (ProfileUpdate): The Pydantic model containing the profile update data.
        session (AsyncSession, optional): The database session. Defaults to Depends(get_session).
    Returns:
        dict: A dictionary containing the updated profile data under the 'data' key.
    """
    try:
        if profile_id:
            profile_db = await session.get(Profile, profile_id)
        
        if not profile_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
            )

        if profile_update is None or not profile_id:
            profile_update = await services.get_profile()

        profile_data = profile_update.model_dump(exclude_unset=True)
        profile_db.sqlmodel_update(profile_data)
        session.add(profile_db)
        await session.commit()
        await session.refresh(profile_db)

        return {"msg": "Profile Update Successfully", "data": profile_db}
    except Exception as e:
        print(f"Error updating profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.post("/pub_details")
async def get_publication_details(
    url: Url | None = None,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(
        get_current_admin
    ),  # Add this line to each route
):
    """
    Fetches publication details from a given URL.
    Args:
        url (Url | None): Optional URL object containing the source URL for publications.
        session (AsyncSession): Database session dependency.
    Returns:
        dict: Dictionary containing:
            - size (int): Number of new publications added
            - data (list): List of newly added Publication objects
    """
    try:
        default_url = "https://www.researchgate.net/publication/384768946_Numerical_Analysis_Utilizing_a_MIM_Plasmonic_Sensor_for_the_Detection_of_Various_Bacteria"
        content = await services.get_publication_details(
            url=url.url if url else default_url
        )

        if not content:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="No content found"
            )

        papers = Paper(**content.model_dump())
        statement = select(Paper).where(Paper.link == papers.link)
        result = await session.exec(statement)
        result = result.first()

        statement = select(Publications).where(Publications.link == papers.link)
        result1 = await session.exec(statement)  # Check if publication exists
        result1 = result1.first()
        if result1:
            papers.id = result1.id

        if not result:
            session.add(papers)
            await session.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Paper already exists"
            )

        return {"message": "Paper added successfully", "data": papers}
    except Exception as e:
        print(f"Error fetching publication details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session),
):
    """
    Authenticate admin and issue access and refresh tokens
    """
    try:
        user = await authenticate_admin(form_data.username, form_data.password, session)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        # Create refresh token
        refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        refresh_token = create_token(
            data={"sub": user.username},
            expires_delta=refresh_token_expires,
            is_refresh=True,
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }
    except Exception as e:
        print(f"Error logging in: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str, session: AsyncSession = Depends(get_session)
):
    """
    Issue a new access token using a valid refresh token
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        is_refresh: bool = payload.get("is_refresh", False)

        if username is None or not is_refresh:
            raise credentials_exception

        statement = select(AdminUser).where(AdminUser.username == username)
        result = await session.exec(statement)
        user = result.first()

        if user is None or not user.is_active:
            raise credentials_exception

        # Create new access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        # Create new refresh token
        refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        new_refresh_token = create_token(
            data={"sub": user.username},
            expires_delta=refresh_token_expires,
            is_refresh=True,
        )

        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
        }

    except JWTError:
        raise credentials_exception


@admin_router.post("/register", response_model=AdminUserResponse)
async def register_admin(
    admin: AdminUserCreate,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(
        get_current_admin
    ),  # Only existing admins can create new admins
):
    """
    Register a new admin user (requires admin privileges)
    """
    # Check if username exists
    statement = select(AdminUser).where(AdminUser.username == admin.username)
    result = await session.exec(statement)
    if result.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    # Check if email exists
    statement = select(AdminUser).where(AdminUser.email == admin.email)
    result = await session.exec(statement)
    if result.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create new admin user
    hashed_password = get_password_hash(admin.password)
    db_admin = AdminUser(
        username=admin.username, email=admin.email, hashed_password=hashed_password
    )

    session.add(db_admin)
    await session.commit()
    await session.refresh(db_admin)

    return db_admin


@admin_router.post("/direct/add_publications")
async def add_publications_direct(
    publications: list[PublicationCreate],
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Add publication data directly from JSON payload.
    """
    try:
        db_publications = [Publications(**pub.model_dump()) for pub in publications]
        new_publications = []

        for pub in db_publications:
            statement = select(Publications).where(Publications.link == pub.link)
            result = await session.exec(statement)
            result = result.first()

            if not result:
                new_publications.append(pub)

        session.add_all(new_publications)
        await session.commit()

        return {"size": len(new_publications), "data": new_publications}

    except Exception as e:
        print(f"Error adding publications: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.post("/direct/add_profile")
async def add_profile_direct(
    profile_data: ProfileCreate,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Add profile data directly from JSON payload.
    """
    try:
        profile = Profile(**profile_data.model_dump())
        session.add(profile)
        await session.commit()
        await session.refresh(profile)

        return {"msg": "Profile Added Successfully", "data": profile}

    except Exception as e:
        print(f"Error adding profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.patch("/direct/update_profile/{profile_id}")
async def update_profile_direct(
    profile_id: str,
    profile_update: ProfileUpdate,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Update profile with provided data directly.
    """
    try:
        profile_db = await session.get(Profile, profile_id)
        if not profile_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
            )

        profile_data = profile_update.model_dump(exclude_unset=True)
        profile_db.sqlmodel_update(profile_data)
        session.add(profile_db)
        await session.commit()
        await session.refresh(profile_db)

        return {"msg": "Profile Updated Successfully", "data": profile_db}
    except Exception as e:
        print(f"Error updating profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.post("/direct/add_paper")
async def add_paper_direct(
    paper_data: PaperCreate,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Add paper details directly from JSON payload.
    """
    try:
        paper = Paper(**paper_data.model_dump())

        statement = select(Paper).where(Paper.link == paper.link)
        result = await session.exec(statement)
        result = result.first()

        if result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Paper already exists"
            )

        session.add(paper)
        await session.commit()
        await session.refresh(paper)

        publications = Publications(
            id=paper.id,
            title=paper.title,
            link=paper.link,
            types=["paper"],
            pub_date=parse_date(paper.pub_date),
            pub_date_str=paper.pub_date,
        )
        session.add(publications)
        await session.commit()

        return {"message": "Paper added successfully", "data": paper}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error adding paper details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.patch("/update/paper/{paper_id}")
async def update_paper(
    paper_id: str,
    paper_data: PaperUpdate,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Update paper details directly from JSON payload.
    """
    try:
        paper_db = await session.get(Paper, paper_id)
        pub_db = await session.get(Publications, paper_id)
        if not paper_db or not pub_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Paper not found"
            )

        pub_data = paper_data.model_dump(exclude_unset=True)
        if paper_data.pub_date:
            pub_data["pub_date"] = parse_date(paper_data.pub_date)
            pub_data["pub_date_str"] = paper_data.pub_date
        pub_db.sqlmodel_update(pub_data)
        session.add(pub_db)
        await session.commit()
        await session.refresh(pub_db)

        paper_data = paper_data.model_dump(exclude_unset=True)
        paper_db.sqlmodel_update(paper_data)
        session.add(paper_db)
        await session.commit()
        await session.refresh(paper_db)

        return {"msg": "Paper Updated Successfully", "data": paper_db}
    except Exception as e:
        print(f"Error updating paper: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.delete("/delete/paper/{paper_id}")
async def delete_paper(
    paper_id: str,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Delete paper details directly from JSON payload.
    """
    try:
        paper_db = await session.get(Paper, paper_id)
        pub_db = await session.get(Publications, paper_id)
        if not paper_db or not pub_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Paper not found"
            )

        await session.delete(paper_db)
        await session.delete(pub_db)
        await session.commit()

        return {"msg": "Paper Deleted Successfully", "data": paper_db}
    except Exception as e:
        print(f"Error deleting paper: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.get("/news", response_model=list[News])
async def get_all_news(
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Get all news items (admin only).
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


@admin_router.post("/news", response_model=News)
async def create_news(
    news_data: NewsCreate,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Create a new news item (admin only).
    """
    try:
        news_dict = news_data.model_dump()
        news_dict["publish_date"] = parse_date(news_data.publish_date)
        news_dict["publish_date_str"] = news_data.publish_date

        news = News(**news_dict)
        session.add(news)
        await session.commit()
        await session.refresh(news)

        return news
    except Exception as e:
        print(f"Error creating news: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.get("/news/{news_id}", response_model=News)
async def get_news(
    news_id: str,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Get a specific news item by ID (admin only).
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


@admin_router.patch("/news/{news_id}", response_model=News)
async def update_news(
    news_id: str,
    news_update: NewsUpdate,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Update a news item (admin only).
    """
    try:
        news = await session.get(News, news_id)
        if not news:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="News not found"
            )

        update_data = news_update.model_dump(exclude_unset=True)

        if "publish_date" in update_data:
            update_data["publish_date"] = parse_date(update_data["publish_date"])
            update_data["publish_date_str"] = news_update.publish_date

        news.sqlmodel_update(update_data)
        session.add(news)
        await session.commit()
        await session.refresh(news)

        return news
    except Exception as e:
        print(f"Error updating news: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@admin_router.delete("/news/{news_id}")
async def delete_news(
    news_id: str,
    session: AsyncSession = Depends(get_session),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Delete a news item (admin only).
    """
    try:
        news = await session.get(News, news_id)
        if not news:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="News not found"
            )

        await session.delete(news)
        await session.commit()

        return {"msg": "News deleted successfully"}
    except Exception as e:
        print(f"Error deleting news: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )
