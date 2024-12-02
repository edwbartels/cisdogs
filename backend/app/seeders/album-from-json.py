import requests
import os


class Album:
    def __init__(self, title, artist_id, track_data, art):
        self.title = title
        self.artist_id = artist_id
        self.track_data = track_data
        self.art = art

    def __repr__(self):
        return (
            f"Album(\n"
            f"    title={self.title!r},\n"
            f"    artist_id={self.artist_id!r},\n"
            f"    track_data={self.track_data},\n"
            f"    art={self.art!r},\n"
            f")"
        )


def transform_json_to_album(data, id):
    album_data = data.get("album", {})

    # Extract album title
    title = album_data.get("name", "Unknown Album")

    # Set artist_id to None
    artist_id = id

    # Extract tracks and format track data
    tracks = album_data.get("tracks", {}).get("track", [])
    track_data = {str(track["@attr"]["rank"]): track["name"] for track in tracks}

    # Extract the artwork URL (large size)
    images = album_data.get("image", [])
    art = next((img["#text"] for img in images if img["size"] == "large"), None)

    # Create and return the Album instance
    return Album(title=title, artist_id=artist_id, track_data=track_data, art=art)


LM_KEY = os.getenv("LM_KEY")
artist = "saosin"
album = "along+the+shadow"
json_data = requests.get(
    f"https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=e8709f42a2a3a289c131d1c8cb034227&artist={artist}&album={album}&format=json"
).json()


album = transform_json_to_album(json_data, 51)
print(album)
