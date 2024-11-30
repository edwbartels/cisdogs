import random
from typing import List
from sqlalchemy.orm import Session
from app.schemas.order import OrderCreate
from app.models import Order, Listing

person_ids = range(1, 31)
listing_ids = range(1, 100)

orders: list[OrderCreate] = []


def seed_orders(db: Session, num_orders: int = 50):
    listings: List[Listing] = db.query(Listing).filter(Listing.active == 1).all()
    if not listings:
        raise ValueError("No listings found in the database. Seed listings first!")
    while len(orders) < num_orders:
        if not listings:
            print("No active listings available to create more orders.")
            break

        listing: Listing = random.choice(listings)
        seller_id: int = listing.seller_id
        buyer_id: int = random.choice([i for i in range(1, 31) if i != seller_id])
        order: OrderCreate = Order(
            price=listing.price,
            quality=listing.quality,
            description=listing.description,
            release_id=listing.item.release_id,
            seller_id=seller_id,
            buyer_id=buyer_id,
        )
        listings.remove(listing)
        db.delete(listing)

        orders.append(order)

    db.add_all(orders)
    db.commit()

    print(f"Seeded {len(orders)} orders.")
