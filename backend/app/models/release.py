from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base


class Release(Base):
    __tablename__ = "releases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    album_id: Mapped[int] = mapped_column(Integer, ForeignKey("albums.id"))
    media_type: Mapped[str] = mapped_column(String)
    variant: Mapped[str] = mapped_column(String, nullable=True)

    album: Mapped["Album"] = relationship("Album", back_populates="releases")
    items: Mapped["Item"] = relationship("Item", back_populates="release")
