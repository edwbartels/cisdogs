FROM python:3.11

ARG SCHEMA
ARG DATABASE_URL

WORKDIR /var/www/backend

COPY backend/requirements.txt .

RUN pip install -r requirements.txt
RUN pip install psycopg2

COPY backend/ .


RUN alembic downgrade base
RUN alembic upgrade head
RUN python app.scripts.seed_db

EXPOSE 8000

CMD ["uvicorn","main:app", "--host","0.0.0.0","--port","8000"]