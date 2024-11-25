from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.user import UserRead
    from backend.app.schemas.order import OrderRead


class ReviewBase(BaseModel):
    rating: int
    comment: str | None
    model_config = {"from_attributes": True}


class ReviewCreate(ReviewBase):
    user_id: int
    order_id: int
    model_config = {"from_attributes": True}


class ReviewRead(ReviewBase):
    id: int
    user_id: int
    model_config = {"from_attributes": True}


class ReviewDetails(ReviewRead):
    user: "UserRead"
    order: "OrderRead"
    model_config = {"from_attributes": True}
