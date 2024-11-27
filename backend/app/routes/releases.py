from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import and_
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


# * POST ROUTES


@router.post("/", response_model=ReleaseFull)
def create_release(release: ReleaseCreateFull, db: Session = Depends(get_db)):
    existing_artist = db.query(Artist).filter(Artist.name == release.artist).first()
    if not existing_artist:
        new_artist = Artist(name=release.artist)
        db.add(new_artist)
        db.commit()
        db.refresh(new_artist)
        print("Refreshed artist id---->", new_artist.id)
    else:
        new_artist = existing_artist
    print("RIGHT BEFORE ALBUM QUERY ----> ARTIST.ID ----> ", new_artist.id)
    existing_album = db.query(Album).filter(Album.title == release.album).first()
    if not existing_album:
        new_album = Album(
            title=release.album, artist_id=new_artist.id, track_data=release.track_data
        )
        db.add(new_album)
        db.commit()
        db.refresh(new_album)
    else:
        new_album = existing_album

    existing_release = (
        db.query(Release)
        .filter(
            and_(
                Release.album_id == new_album.id,
                Release.media_type == release.media_type,
                Release.variant == release.variant,
            )
        )
        .first()
    )

    if existing_release:
        raise HTTPException(status_code=400, detail="Release already exists")

    new_release = Release(
        album_id=new_album.id,
        media_type=release.media_type,
        variant=release.variant,
    )

    db.add(new_release)
    db.commit()
    db.refresh(new_release)
    new_release.artist = new_artist

    return new_release
