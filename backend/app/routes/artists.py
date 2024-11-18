from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import ArtistRead, ArtistCreate
from app.models.database import get_db
from app.models import Artist

router = APIRouter(prefix="/artists", tags=["artists"])


@router.get("/", response_model=list[ArtistRead])
def get_all_artists(db: Session = Depends(get_db)):
    artists = db.query(Artist).all()
    if not artists:
        raise HTTPException(status_code=404, detail="No artists found")
    return artists


@router.get("/{artist_id}", response_model=ArtistRead)
def get_artist_by_id(artist_id: int, db: Session = Depends(get_db)):
    artist = db.query(Artist).filter(Artist.id == artist_id).first()
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist


@router.post("/", response_model=ArtistRead)
def create_artist(artist: ArtistCreate, db: Session = Depends(get_db)):
    existing_artist = db.query(Artist).filter(Artist.name == artist.name).first()
    if existing_artist:
        raise HTTPException(status_code=400, detail="Artist already exists")

    new_artist = Artist(name=artist.name)

    db.add(new_artist)
    db.commit()
    db.refresh(new_artist)

    return new_artist
