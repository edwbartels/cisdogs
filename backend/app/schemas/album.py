from pydantic import BaseModel
from app.models import ArtistRead, ReleaseRead


class AlbumBase(BaseModel):
    title: str


class AlbumCreate(AlbumBase):
    artist_id: int


class AlbumRead(AlbumBase):
    id: int
    artist_id: int

    class Config:
        orm_mode = True


class AlbumDetails(AlbumRead):
    artist: ArtistRead
    releases: list[ReleaseRead] = []
