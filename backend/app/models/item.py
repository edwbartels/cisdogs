from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.models import User, Release


class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    release_id: Mapped[int] = mapped_column(Integer, ForeignKey("releases.id"))

    owner: Mapped[User] = relationship("User", back_populates="items")
    release: Mapped[Release] = relationship("Releases", back_populates="items")
