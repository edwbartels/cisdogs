from sqlalchemy import func
from sqlalchemy.orm import declarative_mixin, Mapped, mapped_column
from sqlalchemy.types import DateTime
from datetime import datetime


@declarative_mixin
class TimestampMixin:
    created: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
