from app.database import SessionLocal

# from app.models import Album, Artist, Item, Listing, Release, Review, Transaction, User
from app.seeders import (
    albums,
    artists,
    items,
    listings,
    releases,
    reviews,
    transactions,
    users,
)

# from app.seeders import albums
# from app.seeders import artists
# from app.seeders import items
# from app.seeders import listings
# from app.seeders import releases
# from app.seeders import reviews
# from app.seeders import transactions
# from app.seeders import users
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()


def seed_data() -> None:
    session: Session = SessionLocal()
    try:
        # Example data

        session.add_all(
            [
                *users,
                *artists,
                *albums,
                *releases,
                *items,
                *listings,
                *transactions,
                *reviews,
            ]
        )
        session.commit()
        print("Seed data added successfully.")
    except Exception as e:
        session.rollback()
        print(f"Failed to seed data: {e}")
    finally:
        session.close()


if __name__ == "__main__":
    seed_data()
