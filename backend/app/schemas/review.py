from pydantic import BaseModel
from app.models import UserRead, TransactionRead


class ReviewBase(BaseModel):
    rating: int
    comment: str or None


class ReviewCreate(ReviewBase):
    user_id: int
    transaction_id: int


class ReviewRead(BaseModel):
    id: int
    user_id: int
    transaction_id: int


class ReviewDetails(ReviewRead):
    user: UserRead
    transaction: TransactionRead
