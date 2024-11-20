from pydantic import BaseModel, RootModel
from typing import TYPE_CHECKING

from app.schemas.user import UserReadBrief
from app.schemas.release import ReleaseRead


class ItemBase(BaseModel):
    release_id: int
    model_config = {"from_attributes": True}


class ItemCreate(ItemBase):
    owner_id: int


class ItemRead(BaseModel):
    id: int

    model_config = {"from_attributes": True}


class ItemDetail(ItemRead):
    owner: "UserReadBrief"
    release: "ReleaseRead"
    model_config = {"from_attributes": True}


# class ItemsAllResponse(RootModel[dict[int, "ItemDetail"]]):
#     model_config = {"from_attributes": True}
