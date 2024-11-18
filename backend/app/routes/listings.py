from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import ListingRead, ListingCreate
from app.models.database import get_db
from app.models import Listing

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("/", response_model=list[ListingRead])
def get_all_listings(db: Session = Depends(get_db)):
    listings = db.query(Listing).all()
    if not listings:
        raise HTTPException(status_code=404, detail="No listings found")
    return listings


@router.get("/{listing_id}", response_model=ListingRead)
def get_listing_by_id(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing


@router.post("/", response_model=ListingRead)
def create_listing(listing: ListingCreate, db: Session = Depends(get_db)):
    existing_listing = (
        db.query(Listing).filter(Listing.item_id == listing.item_id).first()
    )
    if existing_listing:
        return HTTPException(status_code=400, detail="Item already listed")

    new_listing = Listing(
        price=listing.price,
        quality=listing.quality,
        description=listing.description,
        status=listing.status,
        seller_id=listing.seller_id,
        item_id=listing.item_id,
    )

    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    return new_listing
