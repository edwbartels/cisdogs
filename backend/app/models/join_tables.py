from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

watchlist = Table(
    "watchlist",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("release_id", Integer, ForeignKey("releases.id"), primary_key=True),
)
