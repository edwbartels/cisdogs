import random
from sqlalchemy import insert
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.watchlist import Watchlist
from app.schemas.req import WatchReq


user_ids = range(1, 31)
release_ids = range(1, 30)

existing = set()
entries: list[WatchReq] = []

while len(entries) < 300:
    user_id = random.choice(user_ids)
    release_id = random.choice(release_ids)

    s_key = (user_id, release_id)

    if s_key not in existing:
        entry: WatchReq = Watchlist(user_id=user_id, release_id=release_id)
        entries.append(entry)
        existing.add(s_key)
