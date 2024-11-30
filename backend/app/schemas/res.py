from pydantic import BaseModel, RootModel
from typing import Optional
from app.schemas.item import ItemDetail, ItemRead
from app.schemas.listing import ListingDetail, ListingRead, ListingWithSeller
from app.schemas.user import UserReadBrief
from app.schemas.release import ReleaseRead, ReleaseBase
from app.schemas.artist import ArtistRead
from app.schemas.album import AlbumRead
from app.schemas.order import OrderBase, OrderRead
from app.schemas.review import ReviewRead


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


class ReleaseFull(ReleaseRead):
    album: AlbumRead
    artist: ArtistRead
    items: dict[int, UserReadBrief] | None = None
    model_config = {"from_attributes": True}


class AlbumFull(AlbumRead):
    artist: ArtistRead
    releases: dict[int, ReleaseBase] | None = None
    items: dict[int, UserReadBrief] | None = None
    listings: dict[int, ListingWithSeller] | None = None
    model_config = {"from_attributes": True}


class ArtistFull(ArtistRead):
    albums: dict[int, AlbumRead] | None
    releases: dict[int, ReleaseBase] | None
    items: dict[int, UserReadBrief] | None
    listings: dict[int, ListingWithSeller] | None
    model_config = {"from_attributes": True}


class OrderFull(OrderBase):
    id: int
    seller: UserReadBrief
    buyer: UserReadBrief
    reviews: list[ReviewRead] | None
    release: ReleaseRead
    album: AlbumRead
    artist: ArtistRead
    model_config = {"from_attributes": True}


class OrderSplit(BaseModel):
    sales: dict[int, OrderFull]
    purchases: dict[int, OrderFull]
    model_config = {"from_attributes": True}


class ListingItem(BaseModel):
    id: int


class ListingRelease(BaseModel):
    id: int
    media_type: str
    variant: Optional[str] = None
    items: list[ListingItem]


class ListingAlbum(BaseModel):
    id: int
    title: str
    releases: list[ListingRelease]


class ListingArtist(BaseModel):
    id: int
    name: str
    albums: list[ListingAlbum]
    model_config = {"from_attributes": True}


class AlbumDetails(AlbumRead):
    artist: "ArtistRead"
    releases: list["ReleaseRead"] = []
    model_config = {"from_attributes": True}
