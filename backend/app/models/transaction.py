from sqlalchemy import Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.models import User, Listing, Review


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    price: Mapped[float] = mapped_column(Float)
    seller_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    buyer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    listing_id: Mapped[int] = mapped_column(Integer, ForeignKey("listings.id"))
    completed: Mapped[bool] = mapped_column(Boolean, default=False)

    seller: Mapped[User] = relationship("User", back_populates="transactions")
    buyer: Mapped[User] = relationship("User", back_populates="transactions")
    listing: Mapped[Listing] = relationship("Listing", back_populates="transactions")
    review: Mapped[Review] = relationship("Review", back_populates="transactions")
