from pydantic import BaseModel
from typing import TYPE_CHECKING, Literal

if TYPE_CHECKING:
    from app.schemas.user import UserRead
    from app.schemas.item import ItemRead


class ListingBase(BaseModel):
    price: float
    quality: Literal["m", "vg", "g", "f", "ng"]
    description: str | None
    status: Literal["available", "closed"]


class ListingCreate(ListingBase):
    seller_id: int
    item_id: int


class ListingRead(ListingBase):
    id: int

    class Config:
        from_attributes = True


class ListingDetails(ListingRead):
    seller: "UserRead"
    item: "ItemRead"
