from typing import List, Tuple
from fastapi import APIRouter, Depends, Request
from sqlalchemy import select, insert, delete
from sqlalchemy.engine.row import Row
from sqlalchemy.orm import Session
from sqlalchemy.orm.query import Query
from app.database import get_db
from app.models import Item, Listing, Order
from app.models.watchlist import Watchlist
from app.schemas.order import OrderRead, OrderCreate
from app.schemas.req import WatchReq
from app.lib.jwt import get_user_id, HTTPException
import logging

logger = logging.getLogger("main")

router = APIRouter(tags=["session"])


# * Helpers
def get_watchlist(db, user_id):
    items: List[Row[Tuple[int]]] = (
        db.query(Watchlist.release_id).filter(Watchlist.user_id == user_id).all()
    )
    return [item.release_id for item in items]


# * GET Routes
@router.get("/collection", response_model=list[int])
def get_user_collection(
    db: Session = Depends(get_db), user_id: int = Depends(get_user_id)
) -> list[int] | None:
    collection: List[Row[Tuple[int]]] = (
        db.query(Item.release_id).filter(Item.owner_id == user_id).all()
    )
    logger.info("Collection: post-query ---> ", collection)

    if user_id:
        return [item.release_id for item in collection]
    return []


@router.get("/watchlist", response_model=list[int])
def get_user_watchlist(
    db: Session = Depends(get_db), user_id: int = Depends(get_user_id)
) -> list[int] | None:
    watchlist: List[Row[Tuple[int]]] = (
        db.query(Watchlist.release_id).filter(Watchlist.user_id == user_id).all()
    )
    return [item.release_id for item in watchlist]


# * POST Routes


@router.post("/watchlist", response_model=list[int])
def add_to_watchlist(
    request: WatchReq,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
) -> list[int]:
    if user_id != request.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    add = Watchlist(user_id=user_id, release_id=request.release_id)
    try:
        db.add(add)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Failed to add item to watchlist: {str(e)}"
        )
    watchlist: List[Row[Tuple[int]]] = (
        db.query(Watchlist.release_id).filter(Watchlist.user_id == user_id).all()
    )
    return [item.release_id for item in watchlist]


@router.post("/checkout", response_model=list[OrderRead])
def checkout(
    cart: list[OrderCreate],
    user_id: int = Depends(get_user_id),
    db: Session = Depends(get_db),
) -> list[OrderRead]:
    try:
        orders: list[Order | OrderCreate | OrderRead] = []
        for order in cart:
            if user_id != order.buyer_id:
                raise HTTPException(status_code=403, detail="Not authenticated")
            if user_id == order.seller_id:
                raise HTTPException(
                    status_code=403, detail="Cannot purchase an item you own"
                )

            listing: Listing | None = (
                db.execute(select(Listing).where(Listing.id == order.listing_id))
                .scalars()
                .first()
            )
            if not listing:
                raise HTTPException(
                    status_code=404,
                    detail=f"Listing (id: {order.listing_id}) not found",
                )

            # existing_order = (
            #     db.execute(select(Order).where(Order.listing_id == order.listing_id))
            #     .scalars()
            #     .first()
            # )
            # if existing_order:
            #     raise HTTPException(
            #         status_code=400,
            #         detail=f"Order for listing (id: {order.listing_id}) already exists",
            #     )
            # print("Listing --> ", listing)
            # print("Listing Price --> ", listing.price)

            new_order = Order(
                price=listing.price,
                quality=listing.quality,
                description=listing.description,
                seller_id=listing.seller_id,
                buyer_id=order.buyer_id,
                release_id=order.release_id,
            )

            db.add(new_order)
            orders.append(new_order)

            item = (
                db.execute(select(Item).where(Item.id == listing.item_id))
                .scalars()
                .first()
            )

            if not item:
                raise HTTPException(
                    status_code=404, detail=f"Item (id: {listing.item_id}) not found"
                )
            db.delete(listing)
            item.owner_id = user_id

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


@router.delete("/watchlist", response_model=list[int])
def remove_from_watchlist(
    request: WatchReq,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
) -> list[int]:
    if user_id != request.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    d: Query[Watchlist] = (
        db.query(Watchlist)
        .filter(
            Watchlist.user_id == user_id, Watchlist.release_id == request.release_id
        )
        .first()
    )
    if not d:
        raise HTTPException(status_code=404, detail="Watchlist item not found")
    try:
        db.delete(d)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Failed to remove item form watchlist, {str(e)}"
        )

    return get_watchlist(db, user_id)
