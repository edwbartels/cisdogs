from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload, joinedload
from sqlalchemy.future import select
from sqlalchemy.orm.query import Query
from app.database import get_db
from app.models import Album, Artist, Release, Item
from app.schemas.album import AlbumRead, AlbumCreate
from app.schemas.res import AlbumFull, AlbumDetails
from app.lib.sort_filter import (
    PaginationParams,
    paginate,
    PaginationResult,
    create_pagination_params,
)
from functools import lru_cache

router = APIRouter(prefix="/albums", tags=["albums"])


# * Cache Function
@lru_cache(maxsize=128)
def get_cached_albums(pagination: PaginationParams, db_session: Session):
    query: Query[Album] = db_session.query(Album).join(Album.artist)

    albums: PaginationResult = paginate(
        query, pagination.page, pagination.limit, pagination.sort, pagination.order
    )

    return albums


@router.post("/clear_cache", status_code=204)
def clear_listings_cache():
    get_cached_albums.cache_clear()
    return {"detail": "Listings cache cleared"}


# * GET Routes


@router.get("/", response_model=PaginationResult[AlbumDetails])
def get_all_albums(
    pagination: PaginationParams = Depends(
        create_pagination_params(
            default_limit=25,
            default_sort=["artists.name", "albums.title"],
            default_order=["asc", "asc"],
        )
    ),
    db: Session = Depends(get_db),
) -> PaginationResult[AlbumDetails]:
    albums: PaginationResult = get_cached_albums(pagination, db)
    if not albums:
        raise HTTPException(status_code=404, detail="No albums found")

    return albums


@router.get("/{album_id}", response_model=AlbumFull)
def get_album_by_id(album_id: int, db: Session = Depends(get_db)):
    # album = db.query(Album).filter(Album.id == album_id).first()
    stmt = (
        select(Album)
        .options(
            joinedload(Album.artist),
            selectinload(Album.releases)
            .selectinload(Release.items)
            .selectinload(Item.listing),
        )
        .where(Album.id == album_id)
    )
    album = db.execute(stmt).scalars().one_or_none()
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    album.listings = {
        listing.id: listing
        for release in album.releases
        for item in release.items
        if item.listing is not None
        for listing in [item.listing]
    }
    # print(jsonable_encoder(album.listings))

    album.items = {
        item.id: item.owner for release in album.releases for item in release.items
    }
    releases = {release.id: release for release in album.releases}

    return (album, {"releases": releases})


@router.get("/artist/{artist_id}", response_model=dict[int, AlbumDetails])
def get_albums_by_artist(artist_id: int, db: Session = Depends(get_db)):
    albums = db.query(Album).filter(Album.artist_id == artist_id).all()

    if not albums:
        raise HTTPException(status_code=404, detail="No albums found")

    return {album.id: album for album in albums}


# * POST Routes


@router.post("/", response_model=dict[int, AlbumRead])
def create_album(album: AlbumCreate, db: Session = Depends(get_db)):
    print(album)
    existing_album = (
        db.query(Album)
        .filter(func.lower(Album.title) == func.lower(album.title))
        .first()
    )
    if existing_album:
        return {existing_album.id: existing_album}

    new_album = Album(
        title=album.title,
        artist_id=album.artist_id,
        track_data=album.track_data,
        art=album.art,
    )

    db.add(new_album)
    db.commit()
    db.refresh(new_album)
    print(new_album)

    return {new_album.id: new_album}
