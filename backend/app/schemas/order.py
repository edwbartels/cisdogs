from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.user import UserRead
    from app.schemas.release import ReleaseRead


class OrderBase(BaseModel):
    pass
    model_config = {"from_attributes": True}


class OrderCreate(OrderBase):
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


class OrderDetails(OrderRead):
    seller: "UserRead"
    buyer: "UserRead"
    release: "ReleaseRead"
    model_config = {"from_attributes": True}
