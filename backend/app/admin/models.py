from sqlmodel import Field, SQLModel, Column
from sqlalchemy.dialects.postgresql import JSON
import uuid


class Publications(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    title: str
    link: str
    types: list[str] = Field(sa_column=Column(JSON, default=list, nullable=False))
    pub_date: str


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
    skills: list[str] = Field(sa_column=Column(JSON, default=list, nullable=False))
