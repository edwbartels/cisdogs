from pydantic import BaseModel
from app.models import ItemRead, ListingRead, TransactionRead, ReviewRead


class UserBase(BaseModel):
    name: str
    email: str
    username: str


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int

    class Config:
        orm_mode = True


class UserDetail(UserRead):
    items: list[ItemRead] = []
    listings: list[ListingRead] = []
    transactions: list[TransactionRead] = []
    reviews: list[ReviewRead] = []
