from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import date


class Publications(BaseModel):
    title: str
    link: str
    types: list[str]
    pub_date: date
    pub_date_str: str


class Url(BaseModel):
    url: str


class ProfileCreate(BaseModel):
    name: str
    profile_pic: str
    total_pub: str
    reads: str
    total_citations: str
    institution: str
    department: str
    address: str
    position: str
    skills: list[str]


class ProfileUpdate(BaseModel):
    name: str | None = None
    profile_pic: str | None = None
    total_pub: str | None = None
    reads: str | None = None
    total_citations: str | None = None
    institution: str | None = None
    department: str | None = None
    address: str | None = None
    position: str | None = None
    skills: list[str] | None = None
    phone: str | None = None
    email: EmailStr | None = None


class Reference(BaseModel):
    title: str
    link: str
    authors: list[str]


class PaperCreate(BaseModel):
    title: str
    abstract: str | None = None
    citation_count: str | None = None
    read_count: str | None = None
    pub_date: str
    link: str
    authors: list[str]
    references: list[Reference] | None = None
    types: list[str] | None = None


class PaperUpdate(BaseModel):
    title: str | None = None
    abstract: str | None = None
    citation_count: str | None = None
    read_count: str | None = None
    pub_date: str | None = None
    link: str | None = None
    authors: list[str] | None = None
    types: list[str] | None = None


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class AdminUserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class AdminUserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
