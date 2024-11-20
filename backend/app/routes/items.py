from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Item, User, Album, Release
from app.schemas.item import ItemRead, ItemCreate, ItemDetail
from app.schemas.res import ItemFull
from app.lib.jwt import get_current_user

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/", response_model=dict[int, ItemDetail])
def get_all_items(db: Session = Depends(get_db)):
    items = db.query(Item).all()
    if not items:
        raise HTTPException(status_code=404, detail="No items found")
    return {item.id: item for item in items}


@router.get("/full", response_model=dict[int, ItemFull])
def get_all_items_full(db: Session = Depends(get_db)):
    items = (
        db.query(Item)
        .options(
            joinedload(Item.release).joinedload(Release.album).joinedload(Album.artist)
        )
        .all()
    )
    for item in items:
        item.album = item.release.album
        item.artist = item.release.album.artist

    return {item.id: item for item in items}


@router.get("/{item_id}", response_model=ItemDetail)
def get_item_by_id(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


# @router.get("/dashboard", response_model=ItemDetail)
# def get_user_items(db:Session=Depends(get_db), current_user: User = Depends(get_current_user)):
#     if not current_user:
#         return RedirectResponse(url='/')


@router.post("/", response_model=ItemRead)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if item.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    new_item = Item(release_id=item.release_id, owner_id=item.owner_id)

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item
