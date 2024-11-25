from fastapi import APIRouter, Depends, Request
from sqlalchemy import select, insert, delete
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Item, Listing, Order
from app.models.watchlist import Watchlist
from app.schemas.order import OrderRead, OrderCreate
from app.schemas.req import WatchReq
from app.lib.jwt import get_user_id, HTTPException

router = APIRouter(tags=["session"])


# * Helpers
def get_watchlist(db, user_id):
    stmt = select(Watchlist.release_id).where(Watchlist.user_id == user_id).distinct()
    return set(db.execute(stmt).scalars().all())


# * GET Routes
@router.get("/collection", response_model=set[int])
def get_user_collection(
    db: Session = Depends(get_db), user_id: int = Depends(get_user_id)
) -> set[int]:
    collection = (
        db.execute(select(Item.release_id).where(Item.owner_id == user_id).distinct())
        .scalars()
        .all()
    )
    return set(collection)


@router.get("/watchlist", response_model=set[int])
def get_user_watchlist(
    db: Session = Depends(get_db), user_id: int = Depends(get_user_id)
) -> set[int]:
    return get_watchlist(db, user_id)


# * POST Routes


@router.post("/watchlist", response_model=set[int])
def add_to_watchlist(
    request: WatchReq,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
) -> set[int]:
    if user_id != request.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    stmt = insert(Watchlist).values(user_id=user_id, release_id=request.release_id)
    try:
        db.execute(stmt)
        db.commit()
        print(f"Release {request.release_id} add to user {user_id}'s watchlist")
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Failed to add item to watchlist: {str(e)}"
        )
    return get_watchlist(db, user_id)


@router.post("/checkout", response_model=list[OrderRead])
def checkout(
    cart: list[OrderCreate],
    user_id: int = Depends(get_user_id),
    db: Session = Depends(get_db),
) -> list[OrderRead]:
    try:
        orders = []
        for order in cart:
            if user_id != order.buyer_id:
                raise HTTPException(status_code=403, detail="Not authenticated")
            if user_id == order.seller_id:
                raise HTTPException(
                    status_code=403, detail="Cannot purchase an item you own"
                )

            listing = (
                db.execute(select(Listing).where(Listing.id == order.listing_id))
                .scalars()
                .first()
            )
            if not listing:
                raise HTTPException(
                    status_code=404,
                    detail=f"Listing (id: {order.listing_id}) not found",
                )

            existing_order = (
                db.execute(select(Order).where(Order.listing_id == order.listing_id))
                .scalars()
                .first()
            )
            if existing_order:
                raise HTTPException(
                    status_code=400,
                    detail=f"Order for listing (id: {order.listing_id}) already exists",
                )
            # print("Listing --> ", listing)
            # print("Listing Price --> ", listing.price)

            new_order = Order(
                seller_id=listing.seller_id,
                buyer_id=order.buyer_id,
                listing_id=order.listing_id,
            )
            # print(new_order)

            db.add(new_order)
            orders.append(new_order)

            listing.active = False
            listing.status = "sold"

            item = (
                db.execute(select(Item).where(Item.id == listing.item_id))
                .scalars()
                .first()
            )
            print("Item --> ", item)

            if not item:
                raise HTTPException(
                    status_code=404, detail=f"Item (id: {listing.item_id}) not found"
                )
            item.owner_id = user_id
            print("Item w/ new ID (should read 1) --> ", item.owner_id)

        db.commit()

        for order in orders:
            db.refresh(order)
        return orders

    except HTTPException as e:
        db.rollback()
        print("ERROR-----> ", e)
        raise e
    except Exception as e:
        db.rollback()
        print("ERROR-----> ", e)
        raise HTTPException(
            status_code=500, detail=f"An error occured during checkout: {e}"
        )


# * DELETE ROUTES


@router.delete("/watchlist", response_model=set[int])
def remove_from_watchlist(
    request: WatchReq,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
) -> set[int]:
    if user_id != request.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    stmt = delete(Watchlist).where(
        Watchlist.user_id == user_id, Watchlist.release_id == request.release_id
    )

    try:
        db.execute(stmt)
        db.commit()
        print(f"Removed release {request.release_id} from user's {user_id} watchlist")
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Failed to remove item form watchlist, {str(e)}"
        )

    return get_watchlist(db, user_id)
