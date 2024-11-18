from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database import Base
from app.models import Album


class Artist(Base):
    __tablename__ = "artists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String)
    albums: Mapped[list[Album]] = relationship("Album", back_populates="artists")
