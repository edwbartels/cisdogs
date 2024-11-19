from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.item import ItemRead
    from app.schemas.listing import ListingRead
    from app.schemas.transaction import TransactionRead
    from app.schemas.review import ReviewRead


class LoginRequest(BaseModel):
    credential: str
    password: str


class UserBase(BaseModel):
    email: str
    username: str


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True


class UserDetail(UserRead):
    items: list["ItemRead"] = []
    listings: list["ListingRead"] = []
    transactions: list["TransactionRead"] = []
    reviews: list["ReviewRead"] = []
