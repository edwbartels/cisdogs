from fastapi import FastAPI
from app.routes import auth, session, users

# Initialize app
app = FastAPI()

# Connect routers
app.include_router(auth)
app.include_router(session)
app.include_router(users)
