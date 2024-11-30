import random
from app.schemas.release import ReleaseCreate
from app.models import Release
from typing import Optional, Literal

album_ids = range(1, 31)
media_types: list[Literal["vinyl", "cassette", "cd"]] = ["vinyl", "cassette", "cd"]
variants = ["standard", "limited edition", "deluxe", "first pressing"]

existing_releases = set()
releases: list[ReleaseCreate] = []

while len(releases) < 100:
    album_id = random.choice(album_ids)
    media_type = random.choice(media_types)
    if media_type == "vinyl":
        variant = random.choice(variants)
    else:
        variant = media_type

    s_key = (album_id, media_type, variant)

    if s_key not in existing_releases:
        release: ReleaseCreate = Release(
            album_id=album_id, media_type=media_type, variant=variant
        )
        releases.append(release)
        existing_releases.add(s_key)
