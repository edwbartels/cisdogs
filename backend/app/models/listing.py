from sqlalchemy import Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.models.mixins import TimestampMixin


class Listing(Base, TimestampMixin):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    price: Mapped[float] = mapped_column(Float)
    quality: Mapped[str] = mapped_column(String(10))
    description: Mapped[str] = mapped_column(String(100), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    seller_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    item_id: Mapped[int] = mapped_column(Integer, ForeignKey("items.id"), index=True)

    seller: Mapped["User"] = relationship("User", back_populates="listings")
    item: Mapped["Item"] = relationship("Item", back_populates="listing")
