recreate-db:
	alembic downgrade base
	alembic upgrade head

reset-db:
	alembic downgrade base
	alembic upgrade head
	python -m scripts.seed_db

corn-run:
	python -m scripts.run_server