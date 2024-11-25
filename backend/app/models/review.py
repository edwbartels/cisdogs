from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.models.mixins import TimestampMixin


class Review(Base, TimestampMixin):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str] = mapped_column(String, nullable=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id"))

    user: Mapped["User"] = relationship("User", back_populates="reviews")
    order: Mapped["Order"] = relationship("Order", back_populates="reviews")
