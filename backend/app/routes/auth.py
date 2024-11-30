from fastapi import APIRouter, Depends, HTTPException, Response, Request
from typing import Optional
from sqlalchemy import or_
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from app.database import get_db
from app.models import User
from app.schemas.user import UserRead, UserCreate
from app.schemas.auth import LoginRequest, LoginResponse
from app.lib.jwt import (
    create_access_token,
    get_current_user,
    create_refresh_token,
    verify_refresh_token,
)
from jose import ExpiredSignatureError, JWTError
import requests
import os


router = APIRouter(tags=["auth"])
LM_KEY = os.getenv("LM_KEY")


@router.post("/refresh-token")
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    try:
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(status_code=401, detail="Missing refresh token")

        user = verify_refresh_token(refresh_token, db)

        new_access_token = create_access_token({"sub": str(user.id)})
        new_refresh_token = create_refresh_token({"sub": str(user.id)})
        response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            httponly=True,
            secure=True,
            max_age=7 * 24 * 60 * 60,
        )

        return {"accessToken": new_access_token}
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.get("/session", response_model=UserRead)
def get_session(current_user: Optional[User] = Depends(get_current_user)):
    if current_user is None:
        return None
    return current_user


@router.post("/login", response_model=LoginResponse)
def login(
    response: Response,
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
    refresh_token = create_refresh_token({"sub": str(user.id)})

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=7 * 24 * 60 * 60,
    )

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
def signup(response: Response, req: UserCreate, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(or_(User.email == req.email, User.username == req.username))
        .first()
    )

    if not user:
        new_user = User(username=req.username, email=req.email, password=req.password)
        try:
            new_user.validate_username()
            new_user.validate_email()
        except ValueError as e:
            print(f"Validation error: {e}")

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        access_token = create_access_token(data={"sub": str(new_user.id)})
        refresh_token = create_refresh_token({"sub": str(new_user.id)})

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="strict",
            max_age=7 * 24 * 60 * 60,
        )

        return (new_user, {"access_token": access_token, "token_type": "bearer"})
    if user.email == req.email:
        raise HTTPException(
            status_code=401, detail="Account with that email already exists"
        )
    if user.username == req.username:
        raise HTTPException(
            status_code=401, detail="Account with that username already exists"
        )


@router.get("/track_data/{artist:str}/{album:str}")
async def get_track_list(artist: str, album: str):
    res = requests.get(
        f"https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key={LM_KEY}&artist={artist}&album={album}&format=json"
    )
    if res.status_code == 200:
        details = res.json()
        track_data = {
            track["@attr"]["rank"]: track["name"]
            for track in details["album"]["tracks"]["track"]
        }

        def get_art():
            for image in details["album"]["image"]:
                if image["size"] == "extralarge":
                    return image["#text"]

        art = get_art()

        extras = {"track_data": track_data, "art": art}

        return extras
