from pydantic import BaseModel


class Publications(BaseModel):
    title: str
    link: str
    types: list[str]
    pub_date: str


class Url(BaseModel):
    url: str


class Profile(BaseModel):
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
