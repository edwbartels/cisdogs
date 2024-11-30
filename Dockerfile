FROM python:3.11

ARG SCHEMA
ARG DATABASE_URL

WORKDIR /var/www/backend

COPY backend/requirements.txt .

RUN pip install -r requirements.txt
RUN pip install psycopg2

COPY backend/ .


# RUN alembic downgrade base
# RUN alembic upgrade head
# RUN python -m scripts.seed_db

EXPOSE 8000

CMD alembic downgrade base && alembic upgrade head && python -m scripts.seed_db && uvicorn app:main