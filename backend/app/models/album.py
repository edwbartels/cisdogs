from sqlalchemy import Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base


class Album(Base):
    __tablename__ = "albums"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    artist_id: Mapped[int] = mapped_column(Integer, ForeignKey("artists.id"))
    track_data: Mapped[JSON] = mapped_column(JSON, nullable=True)
    releases: Mapped[list["Release"]] = relationship("Release", back_populates="album")
    artist: Mapped["Artist"] = relationship("Artist", back_populates="albums")
