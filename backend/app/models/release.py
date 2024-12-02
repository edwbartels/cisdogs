from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.models.mixins import TimestampMixin


class Release(Base, TimestampMixin):
    __tablename__ = "releases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    album_id: Mapped[int] = mapped_column(Integer, ForeignKey("albums.id"))
    media_type: Mapped[str] = mapped_column(String(20))
    variant: Mapped[str] = mapped_column(String(100), default="standard")

    album: Mapped["Album"] = relationship("Album", back_populates="releases")
    items: Mapped[list["Item"]] = relationship("Item", back_populates="release")
    orders: Mapped[list["Order"]] = relationship("Order", back_populates="release")
