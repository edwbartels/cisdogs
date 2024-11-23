from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Watchlist(Base):
    __tablename__ = "watchlist"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    release_id: Mapped[int] = mapped_column(ForeignKey("releases.id"), primary_key=True)
