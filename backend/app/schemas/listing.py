from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.user import UserRead
    from app.schemas.item import ItemRead


class ListingBase(BaseModel):
    price: float
    quality: str
    description: str or None
    status: str


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
