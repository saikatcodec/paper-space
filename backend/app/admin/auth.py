from datetime import datetime, timedelta
from typing import Optional
import bcrypt

# Monkey patch bcrypt to fix compatibility issue
if not hasattr(bcrypt, "__about__"):
    bcrypt.__about__ = type("obj", (object,), {"__version__": bcrypt.__version__})

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select

from app.admin.models import AdminUser
from app.admin.schemas import TokenData
from app.db import get_session

# Configuration - should be in environment variables in production
SECRET_KEY = "YOUR_SECRET_KEY_HERE"  # Use a strong random key in production
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
ALGORITHM = "HS256"

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token extraction from request
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")


def verify_password(plain_password, hashed_password):
    """Verify password against hashed version"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Hash a password for storage"""
    return pwd_context.hash(password)


def create_token(
    data: dict, expires_delta: Optional[timedelta] = None, is_refresh: bool = False
):
    """Create JWT token with expiry"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update(
        {"exp": expire, "is_refresh": is_refresh, "iat": datetime.utcnow()}
    )

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def authenticate_admin(username: str, password: str, session: AsyncSession):
    """Authenticate username and password, return user if valid"""
    statement = select(AdminUser).where(AdminUser.username == username)
    result = await session.exec(statement)
    user = result.first()

    if not user or not verify_password(password, user.hashed_password):
        return None

    return user


async def get_current_admin(
    token: str = Depends(oauth2_scheme), session: AsyncSession = Depends(get_session)
):
    """Dependency to get current admin from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        is_refresh: bool = payload.get("is_refresh", False)

        if username is None:
            raise credentials_exception
        if is_refresh:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token used for authentication",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    statement = select(AdminUser).where(AdminUser.username == token_data.username)
    result = await session.exec(statement)
    user = result.first()

    if user is None or not user.is_active:
        raise credentials_exception

    return user
