from pydantic import BaseModel
from app.models import UserRead, ReleaseRead


class ItemBase(BaseModel):
    title: str
    description: str | None = None


class ItemCreate(ItemBase):
    owner_id: int


class ItemRead(ItemBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class ItemDetail(ItemRead):
    owner = UserRead
    release: ReleaseRead
