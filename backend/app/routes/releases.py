from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Release, Artist, Album, User, Item
from app.schemas.release import ReleaseRead, ReleaseCreateFull
from app.schemas.res import ReleaseFull
from app.lib.jwt import get_current_user

router = APIRouter(prefix="/releases", tags=["releases"])


@router.get("/", response_model=list[ReleaseRead])
def get_all_releases(db: Session = Depends(get_db)):
    releases = db.query(Release).all()
    if not releases:
        raise HTTPException(status_code=404, detail="No releases found")
    return releases


@router.get("/{release_id}", response_model=ReleaseRead)
def get_release_by_id(release_id: int, db: Session = Depends(get_db)):
    release = db.query(Release).filter(Release.id == release_id).first()
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    return release


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
