from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.artist import ArtistRead
    from app.schemas.release import ReleaseRead


class TrackData:
    dict[str, list[str]]


class AlbumBase(BaseModel):
    title: str


class AlbumCreate(AlbumBase):
    artist_id: int
    track_data: dict[str, list[str]] | None


class AlbumRead(AlbumBase):
    id: int
    artist_id: int

    class Config:
        from_attributes = True


class AlbumDetails(AlbumRead):
    artist: "ArtistRead"
    releases: list["ReleaseRead"] = []
