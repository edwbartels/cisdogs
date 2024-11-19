from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.album import AlbumRead


class ArtistBase(BaseModel):
    name: str


class ArtistCreate(ArtistBase):
    pass


class ArtistRead(ArtistBase):
    id: int

    class Config:
        from_attributes = True


class ArtistDetails(ArtistRead):
    albums: list["AlbumRead"] = []
