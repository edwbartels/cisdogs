from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload, joinedload
from sqlalchemy.future import select
from app.database import get_db
from app.models import Watchlist, Release, Listing, Artist, Album, Item
from app.schemas.release import ReleaseDetails
from app.schemas.res import ListingFull
from app.lib.jwt import get_user_id

router = APIRouter(prefix="/watchlist", tags=["watchlist"])

# * GET Routes


@router.get("/releases", response_model=dict[int, ReleaseDetails])
def get_all_releases(
    db: Session = Depends(get_db), user_id: int = Depends(get_user_id)
) -> dict[int, ReleaseDetails]:
    # stmt = (
    #     select(Release)
    #     .join(Watchlist, Watchlist.release_id == Release.id)
    #     .where(Watchlist.user_id == user_id)
    #     .options(joinedload(Release.album).joinedload(Album.artist))
    # )
    # releases = db.execute(stmt).scalars().all()
    releases = (
        db.query(Release).join(Watchlist).filter(Watchlist.user_id == user_id).all()
    )

    return {release.id: release for release in releases}


@router.get("/listings", response_model=dict[int, ListingFull])
def get_all_listings(
    db: Session = Depends(get_db), user_id: int = Depends(get_user_id)
) -> dict[int, ListingFull]:
    listings = (
        db.query(Listing)
        .join(Item, Listing.item_id == Item.id)
        .join(Release, Item.release_id == Release.id)
        .join(Watchlist, Watchlist.release_id == Release.id)
        .filter(Watchlist.user_id == user_id)
        .all()
    )

    return {listing.id: listing for listing in listings}
