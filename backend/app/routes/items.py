from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Item, User
from app.schemas.item import ItemRead, ItemCreate
from app.lib.jwt import get_current_user

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/", response_model=list[ItemRead])
def get_all_items(db: Session = Depends(get_db)):
    items = db.query(Item).all()
    if not items:
        raise HTTPException(status_code=404, detail="No items found")
    return items


@router.get("/{item_id}", response_model=ItemRead)
def get_item_by_id(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/", response_model=ItemRead)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if item.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    new_item = Item(
        title=item.title, description=item.description, owner_id=item.owner_id
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item
