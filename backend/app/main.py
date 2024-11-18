from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    albums,
    artists,
    auth,
    items,
    listings,
    releases,
    reviews,
    session,
    transactions,
    users,
)

# Initialize app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect routers
app.include_router(auth)
app.include_router(session)
app.include_router(users)
app.include_router(artists)
app.include_router(albums)
app.include_router(releases)
app.include_router(items)
app.include_router(listings)
app.include_router(transactions)
app.include_router(reviews)
