from app.database import Base, engine
from app.models import (
    Album,
    Artist,
    Item,
    Listing,
    Release,
    Review,
    Transaction,
    User,
)

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created")
