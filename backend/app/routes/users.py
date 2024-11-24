from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.future import select
from app.database import get_db
from app.models import User, Item, Listing, Album, Release, Order, Review
from app.schemas.user import UserRead
from app.schemas.res import UserDashboardResponse, ItemFull, ListingFull
from app.schemas.item import ItemDetail
from app.schemas.listing import ListingDetail
from app.schemas.res import OrderFull, OrderSplit
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
) -> OrderSplit:
    if not user_id:
        raise HTTPException(
            status_code=401, detail="Not authenticated (no active user)"
        )
    stmt = select(Order).where(
        or_(Order.buyer_id == user_id, Order.seller_id == user_id)
    )
    sales_stmt = select(Order).where(Order.seller_id == user_id)
    purchases_stmt = select(Order).where(Order.buyer_id == user_id)

    sales = db.execute(sales_stmt).scalars().all()
    purchases = db.execute(purchases_stmt).scalars().all()
    # orders = db.execute(stmt).scalars().all()
    # sales = {order.id: order for order in sales}
    # purchases = {order.id: order for order in purchases}
    # orders = {"sales": sales, "purchases": purchases}
    # orders = {"sales": {}, "purchases": {}}
    # orders["sales"] = {order.id: order for order in sales}
    # orders["purchases"] = {order.id: order for order in purchases}
    # print(jsonable_encoder(orders["sales"]))
    response = OrderSplit(
        sales={order.id: order for order in sales},
        purchases={order.id: order for order in purchases},
    )

    # order.reviews = {review.id: review for order in orders for review in order.reviews}
    return response
    # review_stmt = select(Review).where()
