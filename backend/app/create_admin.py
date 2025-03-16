import asyncio
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select

from app.db import engine
from app.admin.models import AdminUser
from app.admin.auth import get_password_hash


async def create_initial_admin():
    """Create the initial admin user if none exists"""
    async with AsyncSession(engine) as session:
        # Check if any admin exists
        statement = select(AdminUser)
        result = await session.exec(statement)
        admin = result.first()

        if not admin:
            print("Creating initial admin user...")

            # You can customize these values
            username = "admin"
            email = "admin@example.com"
            password = "admin123"  # Change this to a strong password

            hashed_password = get_password_hash(password)
            admin = AdminUser(
                username=username, email=email, hashed_password=hashed_password
            )

            session.add(admin)
            await session.commit()

            print(f"Admin created with username: {username}")
            print("Please change the default password immediately after logging in.")
        else:
            print("Admin user already exists.")


if __name__ == "__main__":
    asyncio.run(create_initial_admin())
