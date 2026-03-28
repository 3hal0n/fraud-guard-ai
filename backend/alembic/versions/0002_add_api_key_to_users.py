"""add api_key to users

Revision ID: 0002_add_api_key
Revises: 0001_initial
Create Date: 2026-03-22
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0002_add_api_key"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def _is_sqlite() -> bool:
	bind = op.get_bind()
	return bind.dialect.name == "sqlite"


def upgrade():
	schema = None if _is_sqlite() else "fraudguard"
	op.add_column("users", sa.Column("api_key", sa.String(), nullable=True), schema=schema)
	op.create_index("ix_users_api_key", "users", ["api_key"], unique=True, schema=schema)


def downgrade():
	schema = None if _is_sqlite() else "fraudguard"
	op.drop_index("ix_users_api_key", table_name="users", schema=schema)
	op.drop_column("users", "api_key", schema=schema)
