from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.orm.query import Query
from app.database import get_db
from app.models import Item, User, Album, Release
from app.schemas.item import ItemRead, ItemCreate, ItemDetail, ItemNew
from app.schemas.res import ItemFull
from app.lib.jwt import get_current_user, get_user_id
from app.lib.sort_filter import (
    PaginationParams,
    paginate,
    PaginationResult,
    create_pagination_params,
)
from functools import lru_cache

router = APIRouter(prefix="/items", tags=["items"])


# * Cache Function
@lru_cache(maxsize=128)
def get_cached_items(pagination: PaginationParams, db_session: Session):
    query: Query[Item] = (
        db_session.query(Item)
        # .join(Item.listing)
        .join(Item.release)
        .join(Release.album)
        .join(Album.artist)
    )

    items: PaginationResult = paginate(
        query,
        pagination.page,
        pagination.limit,
        pagination.sort,
        pagination.order,
    )

    return items


@router.post("/clear_cache", status_code=204)
def clear_items_cache():
    get_cached_items.cache_clear()
    return {"detail": "Items cache cleared"}


@router.get("/", response_model=dict[int, ItemDetail])
def get_all_items(db: Session = Depends(get_db)):
    items = db.query(Item).all()
    if not items:
        raise HTTPException(status_code=404, detail="No items found")
    return {item.id: item for item in items}


@router.get("/full", response_model=PaginationResult[ItemFull])
def get_all_items_full(
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
    items: PaginationResult[ItemFull] = get_cached_items(pagination, db)

    return items


@router.get("/{item_id}", response_model=ItemFull)
def get_item_by_id(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.album = item.release.album
    item.artist = item.release.album.artist
    return item


# @router.get("/dashboard", response_model=ItemDetail)
# def get_user_items(db:Session=Depends(get_db), current_user: User = Depends(get_current_user)):
#     if not current_user:
#         return RedirectResponse(url='/')


@router.post("/", response_model=ItemNew)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    user_id: User = Depends(get_user_id),
):
    if item.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    new_item = Item(release_id=item.release_id, owner_id=item.owner_id)

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


@router.delete("/{item_id:int}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not Authorized")

    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}
