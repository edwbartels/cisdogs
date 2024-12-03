FROM python:3.11

ARG SCHEMA
ARG DATABASE_URL

WORKDIR /var/www/backend

COPY backend/requirements.txt .

RUN pip install -r requirements.txt
RUN pip install psycopg2

COPY backend/ .

EXPOSE 8000

CMD uvicorn app.main:app --host 0.0.0.0 --port 8000

# alembic downgrade base && alembic upgrade head && python -m scripts.seed_db && 