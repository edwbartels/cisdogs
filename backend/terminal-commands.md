## Uvicorn
### Start Server (dev)
```uvicorn app.main:app --reload --port 8000```
## Alembic
### Generate Migration
```alembic revision --autogenerate -m "Initial migration"```
### Run Pending Migrations / Generate New DB if missing
```alembic upgrade head```
### Roll Back Schema / Option 'base' to drop all schema changes
```alembic downgrade base```
### Set Current DB state as revision without applying migrations
```alembic stamp head```
## Miscellaneous
### Generate/Update Requirements.txt
```pip freeze > requirements.txt```
