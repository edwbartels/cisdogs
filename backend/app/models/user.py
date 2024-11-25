from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.lib.auth import hash_password, verify_password
from app.models.mixins import TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)

    items: Mapped[list["Item"]] = relationship("Item", back_populates="owner")
    listings: Mapped[list["Listing"]] = relationship("Listing", back_populates="seller")
    orders: Mapped[list["Order"]] = relationship(
        "Order", foreign_keys="Order.buyer_id", back_populates="buyer"
    )
    orders: Mapped[list["Order"]] = relationship(
        "Order", foreign_keys="Order.seller_id", back_populates="seller"
    )
    reviews: Mapped[list["Review"]] = relationship("Review", back_populates="user")

    @property
    def password(self):
        return AttributeError("Password is not readable")

    @password.setter
    def password(self, plaintext_password: str) -> None:
        self.hashed_password = hash_password(plaintext_password)

    def check_password(self, plaintext_password: str) -> bool:
        return verify_password(plaintext_password, self.hashed_password)
