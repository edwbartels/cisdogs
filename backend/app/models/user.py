from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.lib.auth import hash_password, verify_password


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)

    items: Mapped[list["Item"]] = relationship("Item", back_populates="owner")
    listings: Mapped[list["Listing"]] = relationship("Listing", back_populates="seller")
    purchases: Mapped[list["Transaction"]] = relationship(
        "Transaction", foreign_keys="Transaction.buyer_id", back_populates="buyer"
    )
    sales: Mapped[list["Transaction"]] = relationship(
        "Transaction", foreign_keys="Transaction.seller_id", back_populates="seller"
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
