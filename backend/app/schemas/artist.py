from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.album import AlbumRead


class ArtistBase(BaseModel):
    name: str
    # model_config = {"from_attributes": True}


class ArtistCreate(ArtistBase):
    pass
    # model_config = {"from_attributes": True}


class ArtistRead(ArtistBase):
    id: int

    # model_config = {"from_attributes": True}


class ArtistDetails(ArtistRead):
    albums: list["AlbumRead"] = []
    # model_config = {"from_attributes": True}
