from pydantic import BaseModel, Field, field_validator
from typing import TYPE_CHECKING, Literal, Optional

if TYPE_CHECKING:
    from app.schemas.album import AlbumRead


class ReleaseBase(BaseModel):
    media_type: Literal["vinyl", "cassette", "cd"]
    variant: Optional[str] = Field(None, description="Specific variant of the media")

    @field_validator("variant", mode="before")
    def validate_variant(cls, variant: Optional[str], info: "ValidationInfo"):
        media_type = info.data.get("media_type")
        if media_type == "vinyl" and variant is None:
            raise ValueError("variant cannot be None when media_type is 'vinyl'")
        if media_type != "vinyl":
            return None
        return variant


class ReleaseCreate(ReleaseBase):
    album_id: int
    model_config = {"from_attributes": True}


class ReleaseRead(ReleaseBase):
    id: int
    album_id: int
    model_config = {"from_attributes": True}


class ReleaseDetails(ReleaseRead):
    album: "AlbumRead"
    model_config = {"from_attributes": True}
