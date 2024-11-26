from pydantic import BaseModel
from typing import TYPE_CHECKING


class LoginRequest(BaseModel):
    credential: str
    password: str
    model_config = {"from_attributes": True}


class UserBase(BaseModel):
    email: str
    username: str
    model_config = {"from_attributes": True}


class UserReadBrief(BaseModel):
    username: str
    id: int
    model_config = {"from_attributes": True}


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    # model_config = {"from_attributes": True}


# class UserDetail(UserRead):
#     items: list["ItemRead"] = []
#     listings: list["ListingRead"] = []
#     orders: list["OrderRead"] = []
#     reviews: list["ReviewRead"] = []
#     model_config = {"from_attributes": True}
