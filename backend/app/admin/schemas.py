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
