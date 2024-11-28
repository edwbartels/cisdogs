from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import update, and_
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.future import select
from app.database import get_db
from app.models import Listing, Item, Release, Album, User
from app.schemas.listing import ListingRead, ListingCreate, ListingDetail
from app.schemas.res import ListingFull
from app.lib.jwt import get_current_user, get_user_id

router = APIRouter(prefix="/listings", tags=["listings"])

# * GET Routes


@router.get("/", response_model=dict[int, ListingDetail])
def get_all_listings(db: Session = Depends(get_db)):
    listings = db.query(Listing).filter(Listing.active == 1).all()
    if not listings:
        raise HTTPException(status_code=404, detail="No listings found")
    return {listing.id: listing for listing in listings}


@router.get("/full", response_model=dict[int, ListingFull])
def get_all_listings_full(db: Session = Depends(get_db)):
    listings = (
        db.query(Listing)
        .filter(Listing.active == 1)
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


@router.get("/{listing_id}", response_model=ListingFull)
def get_listing_by_id(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    listing.release = listing.item.release
    listing.album = listing.item.release.album
    listing.artist = listing.item.release.album.artist
    return listing


@router.get("/album/{album_id}", response_model=dict[int, ListingFull])
def get_listings_by_album(album_id: int, db: Session = Depends(get_db)):
    listings = (
        db.query(Listing)
        .filter(Listing.active == 1)
        .options(
            joinedload(Listing.item)
            .joinedload(Item.release)
            .joinedload(Release.album)
            .joinedload(Album.artist)
        )
        .filter(Listing.item, Item.release, Release.album_id == album_id)
        .all()
    )
    if not listings:
        raise HTTPException(status_code=404, detail="No listings found.")

    for listing in listings:
        listing.release = listing.item.release
        listing.album = listing.item.release.album
        listing.artist = listing.item.release.album.artist

    return {listing.id: listing for listing in listings}


@router.get("/artist/{artist_id}", response_model=dict[int, ListingFull])
def get_listings_by_artist(artist_id: int, db: Session = Depends(get_db)):
    listings = (
        db.query(Listing)
        .filter(Listing.active == 1)
        .options(
            joinedload(Listing.item)
            .joinedload(Item.release)
            .joinedload(Release.album)
            .joinedload(Album.artist)
        )
        .filter(Listing.item, Item.release, Release.album, Album.artist_id == artist_id)
    ).all()

    if not listings:
        raise HTTPException(status_code=404, detail="No listings found.")

    for listing in listings:
        listing.release = listing.item.release
        listing.album = listing.item.release.album
        listing.artist = listing.item.release.album.artist

    return {listing.id: listing for listing in listings}


# * POST Routes


@router.post("/", response_model=ListingRead)
def create_listing(
    listing: ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    print(listing)
    item = db.query(Item).filter(Item.id == listing.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    existing_listing = (
        db.query(Listing).filter(Listing.item_id == listing.item_id).first()
    )
    if existing_listing:
        return HTTPException(status_code=400, detail="Item already listed")

    new_listing = Listing(
        price=listing.price,
        quality=listing.quality,
        description=listing.description,
        seller_id=listing.seller_id,
        item_id=listing.item_id,
    )

    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    return new_listing


@router.put("/{listing_id:int}", response_model=ListingRead)
def edit_listing(
    listing_id,
    listing: ListingFull,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
) -> ListingRead:
    existing_listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not existing_listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if existing_listing.seller_id != user_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to edit this listing"
        )
    stmt = (
        update(Listing)
        .where(Listing.id == listing_id)
        .values(
            price=listing.price,
            quality=listing.quality,
            description=listing.description,
        )
    )

    db.execute(stmt)
    db.commit()

    updated_listing = db.query(Listing).filter(Listing.id == listing_id).first()
    return updated_listing


@router.delete("/{listing_id:int}")
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not Authorized")

    db.delete(listing)
    db.commit()
    return {"message": "Listing deleted successfully"}
