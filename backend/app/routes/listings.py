from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Listing, Item, Release, Album
from app.schemas.listing import ListingRead, ListingCreate, ListingDetail
from app.schemas.res import ListingFull

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("/", response_model=dict[int, ListingDetail])
def get_all_listings(db: Session = Depends(get_db)):
    listings = db.query(Listing).filter(Listing.active == True).all()
    if not listings:
        raise HTTPException(status_code=404, detail="No listings found")
    return {listing.id: listing for listing in listings}


@router.get("/full", response_model=dict[int, ListingFull])
def get_all_listings_full(db: Session = Depends(get_db)):
    listings = (
        db.query(Listing)
        .filter(Listing.active == True)
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
