from sqlalchemy import Integer, ForeignKey
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.models.mixins import TimestampMixin


class Item(Base, TimestampMixin):
    __tablename__: str = "items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    release_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("releases.id"), index=True
    )

    owner: Mapped["User"] = relationship("User", back_populates="items")
    release: Mapped["Release"] = relationship("Release", back_populates="items")
    listing: Mapped["Listing"] = relationship("Listing", back_populates="item")

    @property
    def listed(self) -> bool:
        if self.listing:
            return True
        return False

    @hybrid_property
    def album(self):
        return self.release.album

    @hybrid_property
    def artist(self):
        return self.release.album.artist
