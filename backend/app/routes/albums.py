from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.album import Album
from app.schemas.album import AlbumRead, AlbumCreate

router = APIRouter(prefix="/albums", tags=["albums"])


@router.get("/", response_model=list[AlbumRead])
def get_all_albums(db: Session = Depends(get_db)):
    albums = db.query(Album).all()
    if not albums:
        raise HTTPException(status_code=404, detail="No albums found")
    return albums


@router.get("/{album_id}", response_model=AlbumRead)
def get_album_by_id(album_id: int, db: Session = Depends(get_db)):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    return album


@router.post("/", response_model=AlbumRead)
def create_album(album: AlbumCreate, db: Session = Depends(get_db)):
    existing_album = db.query(Album).filter(Album.name == album.name).first()
    if existing_album:
        raise HTTPException(status_code=400, details="Album already exists")

    new_album = Album(name=album.name, artist_id=album.artist_id)

    db.add(new_album)
    db.commit()
    db.refresh(new_album)

    return new_album
