from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.admin.routes import admin_router
from app.db import init_db
from app.user.routes import user_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing Database.....")
    await init_db()
    yield
    print("Closing application.....")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


app.include_router(admin_router, prefix="/admin")
app.include_router(user_router, prefix="/user")
