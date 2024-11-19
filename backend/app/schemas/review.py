from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.user import UserRead
    from app.schemas.transaction import TransactionRead


class ReviewBase(BaseModel):
    rating: int
    comment: str or None


class ReviewCreate(ReviewBase):
    user_id: int
    transaction_id: int


class ReviewRead(ReviewBase):
    id: int
    user_id: int
    transaction_id: int

    class Config:
        from_attributes = True


class ReviewDetails(ReviewRead):
    user: "UserRead"
    transaction: "TransactionRead"
