import random
from sqlalchemy.orm import Session
from app.schemas.listing import ListingCreate
from app.models import Listing, Item
from typing import Literal


qualities: list[Literal["m", "vg", "g", "f", "ng"]] = ["m", "vg", "g", "f", "ng"]
statuses: list[Literal["available", "closed"]] = ["available", "closed"]
descriptions = ["Nice!", "Terrible!", None]


def seed_listings(db: Session, num_listings: int = 250):
    items = db.query(Item).all()

    if not items:
        raise ValueError("No items found in the database. Seed items first!")
    existing_listings: set[tuple[int, int]] = set()
    listings: list[ListingCreate] = []

    while len(listings) < num_listings:
        item = random.choice(items)
        seller_id = item.owner_id
        item_id = item.id

        quality = random.choice(qualities)
        price = float("{:.2f}".format(random.uniform(10, 100)))
        description = random.choice(descriptions)

        s_key = (seller_id, item_id)

        if s_key not in existing_listings:
            listing: ListingCreate = Listing(
                seller_id=seller_id,
                item_id=item_id,
                quality=quality,
                price=price,
                description=description,
            )

            listings.append(listing)
            existing_listings.add(s_key)
    db.add_all(listings)
    db.commit()

    print(f"Seeded {len(listings)} listings.")
