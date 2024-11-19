## Uvicorn
### Start Server (dev)
```uvicorn app.main:app --reload --port 8000```
## Alembic
### Generate Migration
```alembic revision --autogenerate -m "Initial migration"```
### Run Pending Migrations / Generate New DB if missing
```alembic upgrade head```
## Miscellaneous
### Generate/Update Requirements.txt
```pip freeze > requirements.txt```
