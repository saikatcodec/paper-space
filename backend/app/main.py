from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.admin.routes import admin_router
from app.db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing Database.....")
    await init_db()
    yield
    print("Closing application.....")


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Hello World"}


app.include_router(admin_router, prefix="/admin")
