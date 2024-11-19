from sqlalchemy import Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    price: Mapped[float] = mapped_column(Float)
    buyer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    seller_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    listing_id: Mapped[int] = mapped_column(Integer, ForeignKey("listings.id"))
    completed: Mapped[bool] = mapped_column(Boolean, default=False)

    buyer: Mapped["User"] = relationship(
        "User", foreign_keys=[buyer_id], back_populates="purchases"
    )
    seller: Mapped["User"] = relationship(
        "User", foreign_keys=[seller_id], back_populates="sales"
    )
    listing: Mapped["Listing"] = relationship("Listing", back_populates="transactions")
    reviews: Mapped["Review"] = relationship("Review", back_populates="transaction")
