from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.album import AlbumRead


class ReleaseBase(BaseModel):
    media_type: str
    variant: str


class ReleaseCreate(ReleaseBase):
    album_id: int


class ReleaseRead(ReleaseBase):
    id: int
    album_id: int

    class Config:
        from_attributes = True


class ReleaseDetails(ReleaseRead):
    album: "AlbumRead"
