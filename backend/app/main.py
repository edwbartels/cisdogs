from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from app.routes import (
    albums,
    artists,
    auth,
    dashboard,
    items,
    listings,
    releases,
    reviews,
    session,
    orders,
    users,
    watchlist,
)
import os
import logging

logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger: logging.Logger = logging.getLogger("main")

logger.info("Starting application...")

# Initialize app
app = FastAPI()
app.mount("/static", StaticFiles(directory="app/static"), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173, https://wax-exchange.onrender.com/",
    ],
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
api_router.include_router(orders.router)
api_router.include_router(dashboard.router)
api_router.include_router(reviews.router)
api_router.include_router(watchlist.router)

app.include_router(api_router)


@app.get("/")
async def read_root():
    return FileResponse("app/static/index.html")


@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # Serve index.html only for non-API routes
    # if full_path.startswith("api/"):
    #     return {
    #         "detail": "Not Found"
    #     }  # Optional: FastAPI will handle 404s automatically if omitted
    static_file = f"app/static/{full_path}"
    if os.path.exists(static_file):
        return FileResponse(static_file)
    return FileResponse("app/static/index.html")


logger.info("Application is ready and routes are configured.")
