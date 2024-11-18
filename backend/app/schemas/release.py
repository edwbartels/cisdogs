from pydantic import BaseModel
from app.models import AlbumRead


class ReleaseBase(BaseModel):
    media_type: str
    variant: str


class ReleaseCreate(ReleaseBase):
    album_id: int


class ReleaseRead(ReleaseBase):
    id: int
    album_id: int


class ReleaseDetails(ReleaseRead):
    album: AlbumRead
