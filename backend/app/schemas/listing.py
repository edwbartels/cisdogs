from pydantic import BaseModel
from typing import TYPE_CHECKING, Literal


from app.schemas.user import UserRead, UserReadBrief
from app.schemas.item import ItemRead


class ListingBase(BaseModel):
    price: float
    quality: Literal["m", "vg", "g", "f", "ng"]
    description: str | None
    status: Literal["available", "closed"]
    model_config = {"from_attributes": True}


class ListingCreate(ListingBase):
    seller_id: int
    item_id: int
    model_config = {"from_attributes": True}


class ListingRead(ListingBase):
    id: int
    active: bool
    model_config = {"from_attributes": True}


class ListingWithSeller(ListingRead):
    seller: "UserReadBrief"


class ListingDetail(ListingRead):
    seller_id: int
    item_id: int
    seller: "UserRead"
    item: "ItemRead"
    model_config = {"from_attributes": True}
