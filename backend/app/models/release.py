from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.models.mixins import TimestampMixin


class Release(Base, TimestampMixin):
    __tablename__ = "releases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    album_id: Mapped[int] = mapped_column(Integer, ForeignKey("albums.id"))
    media_type: Mapped[str] = mapped_column(String(20), index=True)
    variant: Mapped[str] = mapped_column(String(100), default="standard")

    album: Mapped["Album"] = relationship("Album", back_populates="releases")
    items: Mapped[list["Item"]] = relationship("Item", back_populates="release")
    orders: Mapped[list["Order"]] = relationship("Order", back_populates="release")

    @hybrid_property
    def listings(self):
        return {item.listing.id: item.listing for item in self.items}

    @hybrid_property
    def artist(self):
        return self.album.artist
