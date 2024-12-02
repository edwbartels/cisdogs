from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import and_, func
from sqlalchemy.orm import Session, selectinload, joinedload, aliased
from sqlalchemy.future import select
from app.database import get_db
from app.models import Release, Artist, Album, User, Item, Listing
from app.schemas.item import ItemRead
from app.schemas.release import ReleaseRead, ReleaseCreateFull, ReleaseDetails
from app.schemas.listing import ListingWithSeller
from app.schemas.res import ReleaseFull
from app.lib.jwt import get_current_user

router = APIRouter(prefix="/releases", tags=["releases"])

# * GET Routes


@router.get("/", response_model=dict[int, ReleaseDetails])
def get_all_releases(db: Session = Depends(get_db)):
    stmt = select(Release).options(
        joinedload(Release.album).joinedload(Album.artist),
    )
    releases = db.execute(stmt).scalars().unique().all()
    print(jsonable_encoder(releases[0]))
    if not releases:
        raise HTTPException(status_code=404, detail="No releases found")

    for release in releases:
        release.artist = release.album.artist

    return {release.id: release for release in releases}


@router.get("/{release_id}", response_model=ReleaseFull)
def get_release_by_id(release_id: int, db: Session = Depends(get_db)):
    release = db.query(Release).filter(Release.id == release_id).first()

    # TODO Learn how to write this correctly please god
    # release = db.execute(
    #     select(
    #         (Release)
    #         .options(selectinload(Release.album).selectinload(Album.artist))
    #         .where(Release.id == release_id)
    #         .first()
    #     )
    # )
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    stmt = (
        select(Item)
        .options(
            joinedload(Item.listing),
            selectinload(Item.release)
            .selectinload(Release.album)
            .selectinload(Album.artist),
        )
        .where(Item.release_id == release_id)
    )
    items = db.execute(stmt).scalars().all()

    release_extras = {
        "artist": release.album.artist,
        "listings": {item.listing.id: item.listing for item in items if item.listing},
        "items": {item.id: item.owner for item in items},
    }

    return (release, release_extras)


@router.get("/album/{album_id}", response_model=dict[int, ReleaseDetails])
def get_releases_by_album(album_id: int, db: Session = Depends(get_db)):
    releases = db.query(Release).filter(Release.album_id == album_id).all()

    if not releases:
        raise HTTPException(status_code=404, detail="No Releases found")
    for release in releases:
        release.artist = release.album.artist

    return {release.id: release for release in releases}


@router.get("/artist/{artist_id}", response_model=dict[int, ReleaseDetails])
def get_releases_by_artist(artist_id: int, db: Session = Depends(get_db)):
    releases = (
        db.query(Release)
        .options(joinedload(Release.album).joinedload(Album.artist))
        .filter(Release.album, Album.artist_id == artist_id)
    ).all()

    if not releases:
        raise HTTPException(status_code=404, detail="No Releases found")

    for release in releases:
        release.artist = release.album.artist

    return {release.id: release for release in releases}


# * POST ROUTES


@router.post("/", response_model=ReleaseFull)
def create_release(release: ReleaseCreateFull, db: Session = Depends(get_db)):
    print("im in")
    existing_artist: Artist | None = (
        db.query(Artist).filter(Artist.id == release.artist_id).first()
    )
    if not existing_artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    print("RIGHT BEFORE ALBUM QUERY ----> ARTIST.ID ----> ", existing_artist.id)

    existing_album: Album | None = (
        db.query(Album).filter(Album.id == release.album_id).first()
    )
    if not existing_album:
        raise HTTPException(status_code=404, detail="Album not found")
    print("got past album")
    existing_release: Release | None = (
        db.query(Release)
        .filter(
            and_(
                Release.album_id == existing_album.id,
                Release.media_type == release.media_type,
                Release.variant == release.variant,
            )
        )
        .first()
    )

    if existing_release:
        raise HTTPException(status_code=400, detail="Release already exists")

    new_release = Release(
        album_id=existing_album.id,
        media_type=release.media_type,
        variant=release.variant,
    )
    print("made the release!")
    db.add(new_release)
    db.commit()
    print("commit to db")
    db.refresh(new_release)
    new_release.artist = existing_artist
    items = new_release.items
    release_extras = {
        "items": {item.id: item.owner for item in items},
    }

    return (new_release, release_extras)
