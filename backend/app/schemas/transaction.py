from pydantic import BaseModel
from app.models import UserRead, ListingRead


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


class TransactionDetails(TransactionRead):
    seller: UserRead
    buyer: UserRead
    listing: ListingRead
