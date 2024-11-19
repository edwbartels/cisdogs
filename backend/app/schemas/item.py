from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.user import UserRead
    from app.schemas.release import ReleaseRead


class ItemBase(BaseModel):
    title: str
    description: str | None = None


class ItemCreate(ItemBase):
    owner_id: int


class ItemRead(ItemBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True


class ItemDetail(ItemRead):
    owner: "UserRead"
    release: "ReleaseRead"
