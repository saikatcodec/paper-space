from typing import Optional
from sqlmodel import Field, SQLModel, Column
from pydantic import EmailStr
from sqlalchemy.dialects.postgresql import JSON
from datetime import date, datetime
from sqlalchemy import Date
import uuid


class Publications(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    title: str
    link: str
    types: list[str] = Field(sa_column=Column(JSON, default=list, nullable=False))
    pub_date: date = Field(sa_type=Date)
    pub_date_str: str


class Profile(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    name: str
    profile_pic: str
    total_pub: str
    reads: str
    total_citations: str
    institution: str
    department: str
    address: str
    position: str
    phone: str | None = None
    email: EmailStr | None = None
    skills: list[str] = Field(sa_column=Column(JSON, default=list, nullable=False))


class Paper(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    title: str
    abstract: str | None = None
    link: str
    citation_count: str | None = None
    read_count: str | None = None
    pub_date: str
    authors: list[str] = Field(sa_column=Column(JSON, default=list, nullable=False))
    references: list[dict] = Field(sa_column=Column(JSON, default=list, nullable=True))


class AdminUser(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = Field(default=True)


class News(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    title: str
    content: str
    image_url: str | None = None
    publish_date: date = Field(sa_column=Column(Date))
    publish_date_str: str
    news_type: str  # e.g., "upcoming_paper", "project", "event", "announcement"
    is_featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
