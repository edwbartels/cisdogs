from fastapi import APIRouter, Depends, Request
from sqlalchemy import select, insert, delete
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Item
from app.models.join_tables import watchlist
from app.schemas.req import WatchReq
from app.lib.jwt import get_user_id, HTTPException

router = APIRouter(tags=["session"])


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


def get_watchlist(db, user_id):
    stmt = (
        select(watchlist.c.release_id).where(watchlist.c.user_id == user_id).distinct()
    )
    return set(db.execute(stmt).scalars().all())


@router.get("/watch", response_model=set[int])
def get_user_watchlist(
    db: Session = Depends(get_db), user_id: int = Depends(get_user_id)
) -> set[int]:
    return get_watchlist(db, user_id)


@router.post("/watch", response_model=set[int])
def add_to_watchlist(
    request: WatchReq,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
) -> set[int]:
    if user_id != request.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    stmt = insert(watchlist).values(user_id=user_id, release_id=request.release_id)
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


@router.delete("/watch", response_model=set[int])
def remove_from_watchlist(
    request: WatchReq,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
) -> set[int]:
    if user_id != request.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    stmt = delete(watchlist).where(
        watchlist.c.user_id == user_id, watchlist.c.release_id == request.release_id
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
