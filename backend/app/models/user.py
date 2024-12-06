from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.lib.auth import hash_password, verify_password
from app.models.mixins import TimestampMixin
import re


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))

    items: Mapped[list["Item"]] = relationship("Item", back_populates="owner")
    listings: Mapped[list["Listing"]] = relationship("Listing", back_populates="seller")
    orders: Mapped[list["Order"]] = relationship(
        "Order", foreign_keys="Order.buyer_id", back_populates="buyer"
    )
    orders: Mapped[list["Order"]] = relationship(
        "Order", foreign_keys="Order.seller_id", back_populates="seller"
    )
    reviews: Mapped[list["Review"]] = relationship("Review", back_populates="user")

    MIN_USERNAME_LENGTH = 4
    MAX_USERNAME_LENGTH = 30
    MIN_PASSWORD_LENGTH = 8
    MAX_PASSWORD_LENGTH = 128
    EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

    @property
    def collection_count(self):
        return len(self.items)

    @property
    def member_since(self):
        day: int = int(self.created.strftime("%d"))
        suffix: str = (
            "th" if 11 <= day <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
        )
        return self.created.strftime(f"%B {day}{suffix}, %Y")

    @property
    def password(self):
        return AttributeError("Password is not readable")

    @password.setter
    def password(self, plaintext_password: str) -> None:
        if not (
            self.MIN_PASSWORD_LENGTH
            <= len(plaintext_password)
            <= self.MAX_PASSWORD_LENGTH
        ):
            raise ValueError(
                f"Password must be between {self.MIN_PASSWORD_LENGTH} and {self.MAX_PASSWORD_LENGTH} characters"
            )
        self.hashed_password = hash_password(plaintext_password)

    def check_password(self, plaintext_password: str) -> bool:
        return verify_password(plaintext_password, self.hashed_password)

    def validate_username(self):
        if not (
            self.MIN_USERNAME_LENGTH <= len(self.username) <= self.MAX_USERNAME_LENGTH
        ):
            raise ValueError(
                f"Username must be between {self.MIN_USERNAME_LENGTH} and {self.MAX_USERNAME_LENGTH} characters"
            )

    def validate_email(self) -> None:
        if not self.EMAIL_REGEX.match(self.email):
            raise ValueError("Invalid email format")
