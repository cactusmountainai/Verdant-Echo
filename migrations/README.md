# Database Migrations

This directory will contain database migration scripts.

To create a new migration:
1. Use Alembic (recommended)
2. Run: `alembic revision --autogenerate -m "description"`
3. Review and edit the generated file in this directory
4. Apply with: `alembic upgrade head`

Initial schema has been created via models/base.py and other model files.
