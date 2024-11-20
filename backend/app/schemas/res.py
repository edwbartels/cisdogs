from pydantic import BaseModel, RootModel
from app.schemas.item import ItemDetail, ItemRead
from app.schemas.listing import ListingDetail, ListingRead
from app.schemas.user import UserReadBrief, UserBase
from app.schemas.release import ReleaseRead, ReleaseBase
from app.schemas.artist import ArtistRead, ArtistBase
from app.schemas.album import AlbumRead, AlbumBase


class UserDashboardResponse(BaseModel):
    items: dict[int, ItemDetail]
    listings: dict[int, ListingDetail]
    model_config = {"from_attributes": True}


class ItemsAllResponse(RootModel[dict[int, ItemDetail]]):
    model_config = {"from_attributes": True}


class ItemFull(ItemRead):
    owner: UserReadBrief
    listing: ListingRead | None
    release: ReleaseRead
    album: AlbumRead
    artist: ArtistRead
    model_config = {"from_attributes": True}


class ListingFull(ListingRead):
    seller: UserReadBrief
    item: ItemRead
    release: ReleaseRead
    album: AlbumRead
    artist: ArtistRead
    model_config = {"from_attributes": True}
