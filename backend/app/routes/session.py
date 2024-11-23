from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Item
from app.lib.jwt import get_user_id

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
