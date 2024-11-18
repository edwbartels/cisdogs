from fastapi import APIRouter, Depends
from app.lib.auth import get_current_user
from app.models import User
from app.schemas.user import UserRead

router = APIRouter(prefix="/session", tags=["session"])


@router.get("/", response_model=UserRead)
def get_current_user(current_user: User = Depends(get_current_user)):
    return current_user
