from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.models import User, Transaction


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str] = mapped_column(String)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    transaction_id: Mapped[int] = mapped_column(Integer, ForeignKey("transactions.id"))

    user: Mapped[User] = relationship("User", back_populates="reviews")
    transaction: Mapped[Transaction] = relationship(
        "Transaction", back_populates="reviews"
    )
