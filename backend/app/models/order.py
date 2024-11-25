from sqlalchemy import Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.ext.hybrid import hybrid_property
from app.database import Base
from app.models.mixins import TimestampMixin


class Order(Base, TimestampMixin):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    buyer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    seller_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    listing_id: Mapped[int] = mapped_column(Integer, ForeignKey("listings.id"))

    buyer: Mapped["User"] = relationship(
        "User", foreign_keys=[buyer_id], back_populates="orders"
    )
    seller: Mapped["User"] = relationship(
        "User", foreign_keys=[seller_id], back_populates="orders"
    )
    listing: Mapped["Listing"] = relationship("Listing", back_populates="orders")
    reviews: Mapped[list["Review"]] = relationship("Review", back_populates="order")

    @hybrid_property
    def item(self):
        return self.listing.item

    @hybrid_property
    def release(self):
        return self.listing.item.release

    @hybrid_property
    def album(self):
        return self.listing.item.release.album

    @hybrid_property
    def artist(self):
        return self.listing.item.release.album.artist
