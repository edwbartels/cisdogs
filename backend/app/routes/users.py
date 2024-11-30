from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy import or_, not_
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.future import select
from app.database import get_db
from app.models import User, Item, Listing, Album, Release, Order, Review, Artist
from app.schemas.user import UserRead
import json

# from app.schemas.release import ReleaseRead
# from app.schemas.album import AlbumDetailsBrief
from app.schemas.item import ItemDetail
from app.schemas.listing import ListingDetail
from app.schemas.order import OrderDetails
from app.schemas.res import (
    UserDashboardResponse,
    ItemFull,
    ListingFull,
    OrderSplit,
    ListingArtist,
    # ListingModalData,
)
from app.lib.jwt import get_current_user, get_user_id

router = APIRouter(prefix="/users", tags=["users"])


# * GET Routes


@router.get("/", response_model=list[UserRead])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users


@router.get("/{user_id: int}", response_model=UserRead)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get(
    "/dashboard",
    response_model=UserDashboardResponse,
)
def get_dashboard_info(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    print("Hey sup")
    if not current_user:
        RedirectResponse(url="/")
        raise HTTPException(
            status_code=401, detail="Not authenticated (not active user)"
        )
    items = db.query(Item).filter(Item.owner_id == current_user.id).all()
    listings = db.query(Listing).filter(Listing.seller_id == current_user.id).all()

    item_dict: dict[int, ItemDetail] = {item.id: item for item in items}
    listing_dict: dict[int, ListingDetail] = {
        listing.id: listing for listing in listings
    }

    return {
        "items": item_dict,
        "listings": listing_dict,
    }


@router.get("/items", response_model=dict[int, ItemFull])
def get_user_items(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if not current_user:
        RedirectResponse(url="/")
        raise HTTPException(
            status_code=401, detail="Not authenticated (no active user)"
        )
    items = (
        db.query(Item)
        .filter(Item.owner_id == current_user.id)
        .options(
            joinedload(Item.release).joinedload(Release.album).joinedload(Album.artist)
        )
        .all()
    )
    for item in items:
        item.album = item.release.album
        item.artist = item.release.album.artist

    return {item.id: item for item in items}


@router.get("/items/unlisted", response_model=dict[str, list[ListingArtist]])
def get_listing_modal_data(
    user_id: int = Depends(get_user_id), db: Session = Depends(get_db)
):
    stmt = (
        select(Item)
        .where(Item.owner_id == user_id)
        .where(
            not_(
                select(Listing)
                .where(Listing.item_id == Item.id)
                .where(Listing.active)
                .exists()
            )
        )
        .options(
            joinedload(Item.listing),
            joinedload(Item.release).joinedload(Release.album).joinedload(Album.artist),
        )
    )

    items = db.execute(stmt).scalars().all()

    artist_map = {}

    for item in items:
        release = item.release
        album = release.album
        artist = album.artist

        # Get or create the artist entry
        if artist.id not in artist_map:
            artist_entry = Artist(id=artist.id, name=artist.name, albums=[])
            artist_map[artist.id] = artist_entry

        artist_entry = artist_map[artist.id]

        # Get or create the album entry
        album_map = {album.id: album for album in artist_entry.albums}
        if album.id not in album_map:
            album_entry = Album(id=album.id, title=album.title, releases=[])
            artist_entry.albums.append(album_entry)
        else:
            album_entry = album_map[album.id]

        # Add the release entry
        album_entry.releases.append(
            Release(
                id=release.id,
                media_type=release.media_type,
                variant=release.variant,
                items=[item],
            )
        )
    print(artist_map.values())

    # Convert the artist map into the ListingModalData response
    return {"artists": artist_map.values()}


@router.get("/listings", response_model=dict[int, ListingFull])
def get_user_listings(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if not current_user:
        RedirectResponse(url="/")
        raise HTTPException(status_code=401, detail="Not authenticated(no active user)")
    listings = (
        db.query(Listing)
        .filter(Listing.seller_id == current_user.id)
        .options(
            joinedload(Listing.item)
            .joinedload(Item.release)
            .joinedload(Release.album)
            .joinedload(Album.artist)
        )
        .all()
    )
    for listing in listings:
        listing.release = listing.item.release
        listing.album = listing.item.release.album
        listing.artist = listing.item.release.album.artist
    return {listing.id: listing for listing in listings}


@router.get("/orders", response_model=OrderSplit)
def get_user_orders(
    db: Session = Depends(get_db), user_id: int = Depends(get_user_id)
) -> dict[str, dict[int, Order]]:
    if not user_id:
        raise HTTPException(
            status_code=401, detail="Not authenticated (no active user)"
        )
    sales = (
        db.query(Order)
        .filter(Order.seller_id == user_id)
        .options(
            joinedload(Order.release)
            .joinedload(Release.album)
            .joinedload(Album.artist),
            joinedload(Order.buyer),
            joinedload(Order.seller),
        )
        .all()
    )
    purchases = (
        db.query(Order)
        .filter(Order.buyer_id == user_id)
        .options(
            joinedload(Order.release)
            .joinedload(Release.album)
            .joinedload(Album.artist),
            joinedload(Order.buyer),
            joinedload(Order.seller),
        )
        .all()
    )
    for sale in sales:
        sale.album = sale.release.album
        sale.artist = sale.release.album.artist
    for purchase in purchases:
        purchase.album = purchase.release.album
        purchase.artist = purchase.release.album.artist

    response = {
        "sales": {order.id: order for order in sales},
        "purchases": {order.id: order for order in purchases},
    }
    # print(json.dumps(jsonable_encoder(response)))
    return response
