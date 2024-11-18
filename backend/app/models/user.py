from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.models import Item, Listing, Transaction, Review


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String)
    hashed_password: Mapped[str] = mapped_column(String)

    items: Mapped[list[Item]] = relationship("Item", back_populates="owner")
    listings: Mapped[list[Listing]] = relationship("Listing", back_populates="seller")
    transactions: Mapped[list[Transaction]] = relationship("Transaction")
    reviews: Mapped[list[Review]] = relationship("Review", back_populates="user")

    @property
    def password(self):
        return self.hashed_password
