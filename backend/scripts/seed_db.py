from app.database import SessionLocal

from app.seeders import (
    users,
    artists,
    albums,
    releases,
    items,
    seed_listings,
    seed_orders,
    entries,
    # reviews,
)

# from app.seeders import albums
# from app.seeders import artists
# from app.seeders import items
# from app.seeders import listings
# from app.seeders import releases
# from app.seeders import reviews
# from app.seeders import orders
# from app.seeders import users
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()


def seed_data() -> None:
    session: Session = SessionLocal()
    try:
        session.add_all(users)
        session.commit()
        print(f"Seeded {len(users)} users.")
        session.add_all(artists)
        session.commit()
        print(f"Seeded {len(artists)} artists.")
        session.add_all(albums)
        session.commit()
        print(f"Seeded {len(albums)} albums.")
        session.add_all(releases)
        session.commit()
        print(f"Seeded {len(releases)} releases.")
        session.add_all(items)
        session.commit()
        print(f"Seeded {len(items)} items.")
        seed_listings(session)
        # seed_orders(session)
        session.add_all(entries)
        session.commit()
        print(f"Seeded {len(entries)} watchlist entries.")
        print("Seed data added successfully.")
    except Exception as e:
        session.rollback()
        print(f"Failed to seed data: {e}")
    finally:
        session.close()


if __name__ == "__main__":
    seed_data()
