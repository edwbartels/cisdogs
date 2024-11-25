from pydantic import BaseModel, RootModel
from app.schemas.item import ItemDetail, ItemRead, ItemCreate
from app.schemas.listing import ListingDetail, ListingRead, ListingWithSeller
from app.schemas.user import UserReadBrief, UserBase
from app.schemas.release import ReleaseRead, ReleaseBase
from app.schemas.artist import ArtistRead, ArtistBase
from app.schemas.album import AlbumRead, AlbumBase, AlbumReadTemp
from app.schemas.order import OrderRead, OrderBase
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
    items: dict[int, UserReadBrief] | None
    listings: dict[int, ListingWithSeller] | None
    model_config = {"from_attributes": True}


class AlbumFull(AlbumRead):
    artist: ArtistRead
    releases: dict[int, ReleaseBase] | None
    items: dict[int, UserReadBrief] | None
    listings: dict[int, ListingWithSeller] | None
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
    listing: ListingRead
    item: ItemRead
    reviews: list[ReviewRead] | None
    release: ReleaseRead
    album: AlbumRead
    artist: ArtistRead
    model_config = {"from_attributes": True}


class OrderSplit(BaseModel):
    sales: dict[int, OrderFull]
    purchases: dict[int, OrderFull]

    # {
    #     id: int,
    #     media_type: str,
    #     variant: str,
    #     album: {
    #         id: int,
    #         title: str,
    #         track_data: {
    #             int: str,
    #             ...
    #         }
    #     }
    #     artist: {
    #         id: int,
    #         name: str
    #     }
    # }
