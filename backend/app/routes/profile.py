from fastapi import APIRouter, Depends
from sqlalchemy import ColumnExpressionArgument, or_
from sqlalchemy.orm import Session
from sqlalchemy.orm.query import Query
from app.database import get_db
from app.models import Item, Listing, Album, Release, Order
from app.schemas.res import ItemFull, ListingFull, OrderFull
from app.lib.jwt import get_user_id
from app.lib.sort_filter import (
    PaginationParams,
    paginate,
    PaginationResult,
    create_pagination_params,
)
from functools import lru_cache

router = APIRouter(prefix="/profile", tags=["profile"])


# * Cache Functions
@lru_cache(maxsize=128)
def get_cached_items(
    pagination: PaginationParams,
    db_session: Session,
    user_id: int,
    filters: tuple[ColumnExpressionArgument, ...] = (),
):
    query: Query[Item] = (
        db_session.query(Item)
        .join(Item.release)
        .join(Release.album)
        .join(Album.artist)
        .filter(Item.owner_id == user_id)
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
    user_id: int,
    filters: tuple[ColumnExpressionArgument, ...] = (),
):
    query: Query[Listing] = (
        db_session.query(Listing)
        .join(Listing.item)
        .join(Item.release)
        .join(Release.album)
        .join(Album.artist)
        .filter(Listing.seller_id == user_id)
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
    user_id: int,
    filters: tuple[ColumnExpressionArgument, ...] = (),
):
    query: Query[Order] = (
        db_session.query(Order)
        .join(Order.release)
        .join(Release.album)
        .join(Album.artist)
        .filter(or_(Order.seller_id == user_id, Order.buyer_id == user_id))
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

    return orders


@lru_cache(maxsize=128)
def get_cached_sales(
    pagination: PaginationParams,
    db_session: Session,
    user_id: int,
    filters: tuple[ColumnExpressionArgument, ...] = (),
):
    query: Query[Order] = (
        db_session.query(Order)
        .join(Order.release)
        .join(Release.album)
        .join(Album.artist)
        .filter(Order.seller_id == user_id)
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

    return orders


@lru_cache(maxsize=128)
def get_cached_purchases(
    pagination: PaginationParams,
    db_session: Session,
    user_id: int,
    filters: tuple[ColumnExpressionArgument, ...] = (),
):
    query: Query[Order] = (
        db_session.query(Order)
        .join(Order.release)
        .join(Release.album)
        .join(Album.artist)
        .filter(Order.buyer_id == user_id)
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

    return orders


@router.post("/clear_cache/items", status_code=204)
def clear_items_cache():
    get_cached_items.cache_clear()
    return {"detail": "Items cache cleared"}


@router.post("/clear_cache/listings", status_code=204)
def clear_listings_cache():
    get_cached_listings.cache_clear()
    return {"detail": "Listings cache cleared"}


@router.post("/clear_cache/orders", status_code=204)
def clear_orders_cache():
    get_cached_orders.cache_clear()
    return {"detail": "Orders cache cleared"}


@router.post("/clear_cache/sales", status_code=204)
def clear_sales_cache():
    get_cached_sales.cache_clear()
    return {"detail": "Sales cache cleared"}


@router.post("/clear_cache/purchases", status_code=204)
def clear_purchases_cache():
    get_cached_purchases.cache_clear()
    return {"detail": "Purchases cache cleared"}


@router.get("/items/{user_id}", response_model=PaginationResult[ItemFull])
def get_all_profile_items(
    user_id: int,
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
    db: Session = Depends(get_db),
) -> PaginationResult[ItemFull]:
    print("hello")
    print("got past filter setting")
    items: PaginationResult[ItemFull] = get_cached_items(pagination, db, user_id)

    return items


@router.get("/listings/{user_id}", response_model=PaginationResult[ListingFull])
def get_all_profile_listings(
    user_id: int,
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
    db: Session = Depends(get_db),
) -> PaginationResult[ListingFull]:
    listings: PaginationResult[ListingFull] = get_cached_listings(
        pagination, db, user_id
    )

    return listings


@router.get("/orders/{user_id}", response_model=PaginationResult[OrderFull])
def get_all_profile_orders(
    user_id: int,
    pagination: PaginationParams = Depends(
        create_pagination_params(
            default_limit=50,
            default_sort=["orders.created", "orders.price"],
            default_order=["desc", "asc"],
        )
    ),
    db: Session = Depends(get_db),
) -> PaginationResult[OrderFull]:
    orders: PaginationResult[OrderFull] = get_cached_orders(pagination, db, user_id)
    for order in orders.entries.values():
        order.type = order.get_type(user_id)

    return orders


@router.get("/sales/{user_id}", response_model=PaginationResult[OrderFull])
def get_profile_sales(
    user_id: int,
    pagination: PaginationParams = Depends(
        create_pagination_params(
            default_limit=50,
            default_sort=["orders.created", "orders.price"],
            default_order=["desc", "asc"],
        )
    ),
    db: Session = Depends(get_db),
) -> PaginationResult[OrderFull]:
    orders: PaginationResult[OrderFull] = get_cached_sales(pagination, db, user_id)
    for order in orders.entries.values():
        order.type = order.get_type(user_id)

    return orders


@router.get("/purchases", response_model=PaginationResult[OrderFull])
def get_profile_purchases(
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
    orders: PaginationResult[OrderFull] = get_cached_purchases(pagination, db, user_id)
    for order in orders.entries.values():
        order.type = order.get_type(user_id)

    return orders
