import random
from app.schemas.review import ReviewCreate
from app.models import Review

ratings = range(1, 5)
user_ids = range(1, 31)
order_ids = range(1, 100)
comments = ["Nice!", "The worst!", None]

existing_reviews: set[tuple[int, int]] = set()
reviews: list[ReviewCreate] = []

while len(reviews) < 100:
    user_id: int = random.choice(user_ids)
    order_id: int = random.choice(order_ids)
    s_key: tuple[int, int] = (user_id, order_id)

    if s_key not in existing_reviews:
        rating = random.choice(ratings)
        comment = random.choice(comments)

        review: ReviewCreate = Review(
            user_id=user_id,
            order_id=order_id,
            rating=rating,
            comment=comment,
        )

        reviews.append(review)
        existing_reviews.add(s_key)
