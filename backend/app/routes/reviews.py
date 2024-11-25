from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Review, User
from app.schemas.review import ReviewRead, ReviewCreate
from app.lib.jwt import get_current_user

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/", response_model=list[ReviewRead])
def get_all_reviews(db: Session = Depends(get_db)):
    reviews = db.query(Review).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews found")
    return reviews


@router.get("/{review_id}", response_model=ReviewRead)
def get_review_by_id(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.post("/", response_model=ReviewRead)
def create_review(
    review: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing_review = db.query(Review).filter(
        and_(
            Review.user_id == review.user_id,
            Review.order_id == review.order_id,
        ).first()
    )
    if existing_review:
        raise HTTPException(status_code=400, details="Review already submit")

    new_review = Review(
        rating=review.rating,
        comment=review.comment,
        user_id=review.user_id,
        order_id=review.order_id,
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return new_review
