from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.release import ReleaseRead


class TrackData:
    dict[int, str]


class AlbumBase(BaseModel):
    title: str
    track_data: dict[int, str] | None
    # model_config = {"from_attributes": True}


class AlbumCreate(AlbumBase):
    artist_id: int
    model_config = {"from_attributes": True}


class AlbumRead(AlbumBase):
    id: int
    # model_config = {"from_attributes": True}


class AlbumReadTemp(BaseModel):
    id: int
    title: str
    track_data: dict[int, str]
    model_config = {"from_attributes": True}


# class AlbumDetailsBrief(BaseModel):
#     id: int
#     title: str
#     releases: list["ReleaseRead"]
#     model_config = {"from_attributes": True}


class AlbumDetails(AlbumRead):
    # artist: "ArtistRead"
    releases: list["ReleaseRead"] = []
    model_config = {"from_attributes": True}


class AlbumPlusReleases(AlbumRead):
    releases: dict[int, "ReleaseRead"] | None
    model_config = {"from_attributes": True}


# AlbumDetailsBrief.model_rebuild()
