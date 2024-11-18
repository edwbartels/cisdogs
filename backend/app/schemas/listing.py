from pydantic import BaseModel
from app.models import UserRead, ItemRead


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


class ListingDetails(ListingRead):
    seller: UserRead
    item: ItemRead
