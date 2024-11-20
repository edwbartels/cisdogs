from pydantic import BaseModel, RootModel
from app.schemas.item import ItemDetail
from app.schemas.listing import ListingDetail
from app.schemas.user import UserReadBrief


class UserDashboardResponse(BaseModel):
    items: dict[int, ItemDetail]
    listings: dict[int, ListingDetail]
    model_config = {"from_attributes": True}


class ItemsAllResponse(RootModel[dict[int, ItemDetail]]):
    model_config = {"from_attributes": True}
