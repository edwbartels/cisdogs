from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from app.models import User
from app.schemas import UserRead, UserCreate
from app.database import get_db
from app.lib.auth import authenticate_user

router = APIRouter(tags=["auth"])


@router.post("/login")
def login(credential: str, password: str, db: Session = Depends(get_db)):
    return authenticate_user(credential, password, db)


@router.post("/signup", response_model=UserRead)
def sign_up_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(User)
        .filter(or_(User.email == user.email, User.username == user.username))
        .first()
    )
    if existing_user.email == user.email:
        raise HTTPException(status_code=400, detail="Email already registered")
    if existing_user.username == user.username:
        raise HTTPException(status_code=400, detail="Username not available")

    hashed_password = bcrypt.hash(user.password)

    new_user = User(name=user.name, email=user.email, password=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    login(new_user.email, user.password)

    return authenticate_user(new_user.email, user.password, db)
