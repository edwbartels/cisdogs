import random
from app.schemas.item import ItemCreate
from app.models import Item

user_ids = range(1, 31)
release_ids = range(1, 200)

existing_items: set[tuple[int, int]] = set()
items: list[ItemCreate] = []


while len(items) < 500:
    user_id: int = random.choice(user_ids)
    release_id: int = random.choice(release_ids)

    s_key: tuple[int, int] = (user_id, release_id)

    if s_key not in existing_items:
        item: ItemCreate = Item(owner_id=user_id, release_id=release_id)

        items.append(item)
        existing_items.add(s_key)
