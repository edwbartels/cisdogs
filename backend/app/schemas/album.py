from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.artist import ArtistRead
    from app.schemas.release import ReleaseRead


class TrackData:
    dict[int, str]


class AlbumBase(BaseModel):
    title: str
    track_data: dict[int, str] | None


class AlbumCreate(AlbumBase):
    artist_id: int


class AlbumRead(AlbumBase):
    id: int

    class Config:
        from_attributes = True


class AlbumReadTemp(BaseModel):
    id: int
    title: str
    track_data: dict[int, str]


class AlbumDetails(AlbumRead):
    artist: "ArtistRead"
    releases: list["ReleaseRead"] = []
