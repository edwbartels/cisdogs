from pydantic import BaseModel
from app.models import AlbumRead


class ArtistBase(BaseModel):
    name: str


class ArtistRead(ArtistBase):
    id: int

    class Config:
        orm_mode = True


class ArtistDetails(ArtistRead):
    albums: list[AlbumRead] = []
