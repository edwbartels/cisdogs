from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.user import UserRead
    from app.schemas.listing import ListingRead


class TransactionBase(BaseModel):
    price: float


class TransactionCreate(TransactionBase):
    seller_id: int
    buyer_id: int
    listing_id: int


class TransactionRead(TransactionBase):
    id: int
    seller_id: int
    buyer_id: int
    listing_id: int
    completed: bool

    class Config:
        from_attributes = True


class TransactionDetails(TransactionRead):
    seller: "UserRead"
    buyer: "UserRead"
    listing: "ListingRead"
