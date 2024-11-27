FROM python:3.11-slim

WORKDIR /var/www/backend

COPY backend/requirements.txt .

RUN pip install -r requirements.txt
RUN pip install psycopg2

COPY backend/ .


RUN flask db upgrade
RUN flask seed

EXPOSE 8000

CMD ["uvicorn","main:app", "--host","0.0.0.0","--port","8000"]