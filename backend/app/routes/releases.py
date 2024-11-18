from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session
from app.schemas import ReleaseRead, ReleaseCreate
from app.models.database import get_db
from app.models import Release

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


@router.post("/", response_model=ReleaseRead)
def create_release(release: ReleaseCreate, db: Session = Depends(get_db)):
    existing_release = (
        db.query(Release)
        .filter(
            and_(
                Release.album_id == release.album_id,
                Release.media_type == release.media_type,
                Release.variant == release.variant,
            )
        )
        .first()
    )

    if existing_release:
        raise HTTPException(status_code=400, detail="Release already exists")

    new_release = Release(
        album_id=release.album_id,
        media_type=release.media_type,
        variant=release.variant,
    )

    db.add(new_release)
    db.commit()
    db.refresh(new_release)

    return new_release
