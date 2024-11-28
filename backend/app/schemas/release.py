from pydantic import BaseModel, Field, field_validator
from typing import TYPE_CHECKING, Literal, Optional

# if TYPE_CHECKING:
from app.schemas.album import AlbumRead
from app.schemas.artist import ArtistRead


class ReleaseBase(BaseModel):
    media_type: Literal["vinyl", "cassette", "cd"]
    variant: Optional[str] = Field(None, description="Specific variant of the media")

    @field_validator("variant", mode="before")
    def validate_variant(cls, variant: Optional[str], info: "ValidationInfo"):
        media_type = info.data.get("media_type")
        if media_type == "vinyl" and variant is None:
            raise ValueError("variant cannot be None when media_type is 'vinyl'")
        if media_type != "vinyl":
            return media_type
        return variant


class ReleaseCreate(ReleaseBase):
    artist: str
    album: str
    model_config = {"from_attributes": True}


class ReleaseCreateFull(ReleaseCreate):
    track_data: dict[int, str]


class ReleaseRead(ReleaseBase):
    id: int
    model_config = {"from_attributes": True}


class ReleaseDetails(ReleaseRead):
    album: "AlbumRead"
    artist: "ArtistRead"
    model_config = {"from_attributes": True}
