from fastapi import FastAPI, APIRouter
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
    watchlist,
)

# Initialize app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Connect routers
api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router)
api_router.include_router(session.router)
api_router.include_router(users.router)
api_router.include_router(artists.router)
api_router.include_router(albums.router)
api_router.include_router(releases.router)
api_router.include_router(items.router)
api_router.include_router(listings.router)
api_router.include_router(transactions.router)
api_router.include_router(reviews.router)
api_router.include_router(watchlist.router)

app.include_router(api_router)
