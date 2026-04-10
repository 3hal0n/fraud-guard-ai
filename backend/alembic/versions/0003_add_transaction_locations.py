"""add transaction_locations table

Revision ID: 0003_add_transaction_locations
Revises: 0002_add_api_key
Create Date: 2026-04-09
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "0003_add_transaction_locations"
down_revision = "0002_add_api_key"
branch_labels = None
depends_on = None


def _is_sqlite() -> bool:
    bind = op.get_bind()
    return bind.dialect.name == "sqlite"


def upgrade():
    schema = None if _is_sqlite() else "fraudguard"
    tx_fk = "transactions.id" if _is_sqlite() else "fraudguard.transactions.id"
    tx_id_type = sa.String() if _is_sqlite() else postgresql.UUID(as_uuid=False)

    op.create_table(
        "transaction_locations",
        sa.Column("tx_id", tx_id_type, nullable=False),
        sa.Column("location", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.ForeignKeyConstraint(["tx_id"], [tx_fk], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("tx_id"),
        schema=schema,
    )
    op.create_index("ix_transaction_locations_tx_id", "transaction_locations", ["tx_id"], unique=False, schema=schema)


def downgrade():
    schema = None if _is_sqlite() else "fraudguard"
    op.drop_index("ix_transaction_locations_tx_id", table_name="transaction_locations", schema=schema)
    op.drop_table("transaction_locations", schema=schema)
