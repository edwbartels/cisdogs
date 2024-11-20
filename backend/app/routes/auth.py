from fastapi import APIRouter, Depends, HTTPException, Response
from typing import Optional
from sqlalchemy import or_
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from app.database import get_db
from app.models import User
from app.schemas.user import UserRead, UserCreate
from app.schemas.auth import LoginRequest, LoginResponse
from app.lib.jwt import create_access_token, get_current_user

router = APIRouter(tags=["auth"])


@router.get("/session", response_model=UserRead)
def get_session(current_user: Optional[User] = Depends(get_current_user)):
    if current_user is None:
        return None
    return current_user


@router.post("/login", response_model=LoginResponse)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(
            or_(User.email == request.credential, User.username == request.credential)
        )
        .first()
    )
    if not user or not bcrypt.verify(request.password, user.hashed_password):
        raise HTTPException(
            status_code=401, detail="Invalid username/email or password"
        )

    access_token = create_access_token(data={"sub": str(user.id)})

    return (user, {"access_token": access_token, "token_type": "bearer"})


@router.post("/logout")
def logout(response: Response, db: Session = Depends(get_db)):
    try:
        response.delete_cookie(
            key="access_token",
            path="/",
            httponly=True,
        )
        return {"message": "Successfully logged out"}
    except Exception:
        raise HTTPException(status_code=500, detail="An error occured during logout")


@router.post("/signup", response_model=LoginResponse)
def signup(req: UserCreate, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(or_(User.email == req.email, User.username == req.username))
        .first()
    )

    if not user:
        new_user = User(username=req.username, email=req.email, password=req.password)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        access_token = create_access_token(data={"sub": new_user.id})
        return (new_user, {"access_token": access_token, "token_type": "bearer"})
    if user.email == req.email:
        raise HTTPException(
            status_code=401, detail="Account with that email already exists"
        )
    if user.username == req.username:
        raise HTTPException(
            status_code=401, detail="Account with that username already exists"
        )
