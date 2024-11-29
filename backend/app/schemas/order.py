from pydantic import BaseModel
from typing import TYPE_CHECKING, Optional
from datetime import datetime

if TYPE_CHECKING:
    from app.schemas.user import UserRead
    from app.schemas.release import ReleaseRead


class OrderBase(BaseModel):
    price: float
    quality: str
    description: Optional[str]
    created: datetime
    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    seller_id: int
    buyer_id: int
    listing_id: int
    release_id: int
    model_config = {"from_attributes": True}


class OrderRead(OrderBase):
    id: int
    seller_id: int
    buyer_id: int
    release_id: int
    model_config = {"from_attributes": True}


class OrderDetails(OrderBase):
    id: int
    seller: "UserRead"
    buyer: "UserRead"
    release: "ReleaseRead"
    model_config = {"from_attributes": True}
