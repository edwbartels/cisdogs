from pydantic import BaseModel
from app.schemas.user import UserRead


class LoginRequest(BaseModel):
    credential: str
    password: str


class LoginResponse(UserRead):
    access_token: str
    token_type: str
