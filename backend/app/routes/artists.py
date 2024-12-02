from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload, joinedload
from sqlalchemy.future import select
from sqlalchemy.orm.query import Query
from app.database import get_db
from app.models import Artist, Item, Album, Release, Listing
from app.schemas.artist import ArtistRead, ArtistBase
from app.schemas.res import ArtistFull
from app.lib.sort_filter import (
    PaginationParams,
    paginate,
    PaginationResult,
    create_pagination_params,
)
from functools import lru_cache

router = APIRouter(prefix="/artists", tags=["artists"])


# * Cache Function
@lru_cache(maxsize=128)
def get_cached_artists(pagination: PaginationParams, db_session: Session):
    query: Query[Artist] = db_session.query(Artist)

    artists: PaginationResult = paginate(
        query, pagination.page, pagination.limit, pagination.sort, pagination.order
    )

    return artists


@router.post("/clear_cache", status_code=204)
def clear_listings_cache():
    get_cached_artists.cache_clear()
    return {"detail": "Listings cache cleared"}


# * GET Routes


@router.get("/", response_model=PaginationResult[ArtistRead])
def get_all_artists(
    pagination: PaginationParams = Depends(
        create_pagination_params(
            default_limit=25, default_sort=["name"], default_order=["asc"]
        )
    ),
    db: Session = Depends(get_db),
) -> PaginationResult[ArtistRead]:
    artists: PaginationResult = get_cached_artists(pagination, db)
    if not artists:
        raise HTTPException(status_code=404, detail="No artists found")

    return artists


@router.get("/{artist_id}", response_model=ArtistFull)
def get_artist_by_id(artist_id: int, db: Session = Depends(get_db)):
    stmt = (
        select(Artist)
        .options(
            selectinload(Artist.albums)
            .selectinload(Album.releases)
            .selectinload(Release.items)
            .selectinload(Item.listing)
        )
        .where(Artist.id == artist_id)
    )

    artist = db.execute(stmt).scalars().one_or_none()

    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")

    artist.listings = {
        listing.id: listing
        for album in artist.albums
        for release in album.releases
        for item in release.items
        if item.listing is not None
        for listing in [item.listing]
    }
    artist.items = {
        item.id: item.owner
        for album in artist.albums
        for release in album.releases
        for item in release.items
    }
    artist.releases = {
        release.id: release for album in artist.albums for release in album.releases
    }
    albums = {album.id: album for album in artist.albums}
    return (artist, {"albums": albums})


@router.post("/", response_model=dict[int, ArtistRead])
def create_artist(artist: ArtistBase, db: Session = Depends(get_db)):
    existing_artist: Artist | None = (
        db.query(Artist)
        .filter(func.lower(Artist.name) == func.lower(artist.name))
        .first()
    )
    if existing_artist:
        return {existing_artist.id: existing_artist}

    new_artist = Artist(name=str.title(artist.name))

    db.add(new_artist)
    db.commit()
    db.refresh(new_artist)

    return {new_artist.id: new_artist}
