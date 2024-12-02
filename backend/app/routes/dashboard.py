from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import ColumnExpressionArgument, or_
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.orm.query import Query
from app.database import get_db
from app.models import User, Item, Listing, Album, Release, Order, Review, Artist
from app.schemas.user import UserRead
from app.schemas.item import ItemDetail
from app.schemas.listing import ListingDetail
from app.schemas.res import (
    OrderRead,
    UserDashboardResponse,
    ItemFull,
    ListingFull,
    OrderSplit,
    ListingArtist,
    OrderFull,
    # ListingModalData,
)
from app.lib.jwt import get_current_user, get_user_id
from app.lib.sort_filter import (
    PaginationParams,
    paginate,
    PaginationResult,
    create_pagination_params,
)
from functools import lru_cache

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


# * Cache Functions
@lru_cache(maxsize=128)
def get_cached_items(
    pagination: PaginationParams,
    db_session: Session,
    filters: tuple[ColumnExpressionArgument, ...] = (),
):
    query: Query[Item] = (
        db_session.query(Item).join(Item.release).join(Release.album).join(Album.artist)
    )
    if filters:
        for filter in filters:
            query = query.filter(filter)

    items: PaginationResult = paginate(
        query,
        pagination.page,
        pagination.limit,
        pagination.sort,
        pagination.order,
    )

    return items


@lru_cache(maxsize=128)
def get_cached_listings(
    pagination: PaginationParams,
    db_session: Session,
    filters: tuple[ColumnExpressionArgument, ...] = (),
):
    query: Query[Listing] = (
        db_session.query(Listing)
        .join(Listing.item)
        .join(Item.release)
        .join(Release.album)
        .join(Album.artist)
    )
    if filters:
        for filter in filters:
            query = query.filter(filter)

    listings: PaginationResult = paginate(
        query,
        pagination.page,
        pagination.limit,
        pagination.sort,
        pagination.order,
    )

    return listings


@lru_cache(maxsize=128)
def get_cached_orders(
    pagination: PaginationParams,
    db_session: Session,
    filters: tuple[ColumnExpressionArgument, ...] = (),
):
    query: Query[Order] = (
        db_session.query(Order)
        .join(Order.release)
        .join(Release.album)
        .join(Album.artist)
        # .options(joinedload(Order.buyer).joinedload(Order.seller))
    )
    if filters:
        for filter in filters:
            query = query.filter(filter)

    orders: PaginationResult = paginate(
        query,
        pagination.page,
        pagination.limit,
        pagination.sort,
        pagination.order,
    )
    # for order in orders.entries.values():
    #     order.type = order.get_type(user_id)

    return orders


@router.post("/clear_cache/items", status_code=204)
def clear_items_cache():
    get_cached_items.cache_clear()
    return {"detail": "Items cache cleared"}


@router.post("/clear_cache/listings", status_code=204)
def clear_listings_cache():
    get_cached_items.cache_clear()
    return {"detail": "Items cache cleared"}


@router.post("/clear_cache/orders", status_code=204)
def clear_orders_cache():
    get_cached_items.cache_clear()
    return {"detail": "Items cache cleared"}


# * GET * #


@router.get("/items", response_model=PaginationResult[ItemFull])
def get_all_dashboard_items(
    pagination: PaginationParams = Depends(
        create_pagination_params(
            default_limit=50,
            default_sort=[
                "items.created",
                "artists.name",
                "albums.title",
                "releases.media_type",
                "releases.variant",
            ],
            default_order=["desc", "asc", "asc", "asc", "asc"],
        )
    ),
    user_id=Depends(get_user_id),
    db: Session = Depends(get_db),
) -> PaginationResult[ItemFull]:
    print("hello")
    filters: tuple[ColumnExpressionArgument] = (Item.owner_id == user_id,)
    print("got past filter setting")
    items: PaginationResult[ItemFull] = get_cached_items(pagination, db, filters)

    return items


@router.get("/listings", response_model=PaginationResult[ListingFull])
def get_all_dashboard_listings(
    pagination: PaginationParams = Depends(
        create_pagination_params(
            default_limit=50,
            default_sort=[
                "listings.created",
                "artists.name",
                "albums.title",
                "releases.media_type",
                "releases.variant",
                "listings.price",
            ],
            default_order=["desc", "asc", "asc", "asc", "asc", "asc"],
        )
    ),
    user_id=Depends(get_user_id),
    db: Session = Depends(get_db),
) -> PaginationResult[ListingFull]:
    filters: tuple[ColumnExpressionArgument] = (Listing.seller_id == user_id,)
    listings: PaginationResult[ListingFull] = get_cached_listings(
        pagination, db, filters
    )

    return listings


@router.get("/orders", response_model=PaginationResult[OrderFull])
def get_all_dashboard_orders(
    pagination: PaginationParams = Depends(
        create_pagination_params(
            default_limit=50,
            default_sort=["orders.created", "orders.price"],
            default_order=["desc", "asc"],
        )
    ),
    user_id=Depends(get_user_id),
    db: Session = Depends(get_db),
) -> PaginationResult[OrderFull]:
    filters: tuple[ColumnExpressionArgument] = (
        (or_(Order.seller_id == user_id, Order.buyer_id == user_id)),
    )
    orders: PaginationResult[OrderFull] = get_cached_orders(pagination, db, filters)
    for order in orders.entries.values():
        order.type = order.get_type(user_id)

    return orders
