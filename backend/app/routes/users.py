from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Item, Listing
from app.schemas.user import UserRead
from app.schemas.res import UserDashboardResponse
from app.schemas.item import ItemDetail
from app.schemas.listing import ListingDetail
from app.lib.jwt import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


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
