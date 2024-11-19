from app.database import SessionLocal
from app.models import User
from app.schemas.user import UserCreate

db = SessionLocal()

seed_users: list[UserCreate] = [
    {"username": "admin", "email": "admin@example.com", "password": "password"}
]

for user_data in seed_users:
    user = User(
        username=user_data["username"],
        email=user_data["email"],
        password=user_data["password"],
    )
    db.add(user)

db.commit()
print("User data seeded successfully")
