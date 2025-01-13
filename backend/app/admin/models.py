from sqlmodel import Field, SQLModel, Column
from pydantic import EmailStr
from sqlalchemy.dialects.postgresql import JSON
from datetime import date
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
