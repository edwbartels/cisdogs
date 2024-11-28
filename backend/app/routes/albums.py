from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, selectinload, joinedload
from sqlalchemy.future import select
from app.database import get_db
from app.models import Album, Artist, Release, Item
from app.schemas.album import AlbumRead, AlbumCreate
from app.schemas.res import AlbumFull, AlbumDetails

router = APIRouter(prefix="/albums", tags=["albums"])

# * GET Routes


@router.get("/", response_model=list[AlbumDetails])
def get_all_albums(db: Session = Depends(get_db)):
    stmt = select(Album).options(joinedload(Album.artist), joinedload(Album.releases))
    albums = db.execute(stmt).scalars().unique().all()
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


@router.post("/", response_model=AlbumRead)
def create_album(album: AlbumCreate, db: Session = Depends(get_db)):
    existing_album = db.query(Album).filter(Album.title == album.title).first()
    if existing_album:
        raise HTTPException(status_code=400, detail="Album already exists")

    new_album = Album(name=album.title, artist_id=album.artist_id)

    db.add(new_album)
    db.commit()
    db.refresh(new_album)

    return new_album
