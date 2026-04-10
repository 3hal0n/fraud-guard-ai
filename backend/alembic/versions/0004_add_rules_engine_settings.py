"""add rules_engine_settings table

Revision ID: 0004_add_rules_engine_settings
Revises: 0003_add_transaction_locations
Create Date: 2026-04-09
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0004_add_rules_engine_settings"
down_revision = "0003_add_transaction_locations"
branch_labels = None
depends_on = None


def _is_sqlite() -> bool:
    bind = op.get_bind()
    return bind.dialect.name == "sqlite"


def upgrade():
    schema = None if _is_sqlite() else "fraudguard"
    user_fk = "users.id" if _is_sqlite() else "fraudguard.users.id"

    op.create_table(
        "rules_engine_settings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("profile", sa.String(), nullable=False, server_default="GENERAL"),
        sa.Column("review_threshold", sa.Integer(), nullable=False, server_default="30"),
        sa.Column("block_threshold", sa.Integer(), nullable=False, server_default="70"),
        sa.Column("block_on_location_mismatch", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("location_mismatch_min_score", sa.Integer(), nullable=False, server_default="85"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], [user_fk]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
        schema=schema,
    )
    op.create_index("ix_rules_engine_settings_id", "rules_engine_settings", ["id"], unique=False, schema=schema)
    op.create_index("ix_rules_engine_settings_user_id", "rules_engine_settings", ["user_id"], unique=True, schema=schema)


def downgrade():
    schema = None if _is_sqlite() else "fraudguard"
    op.drop_index("ix_rules_engine_settings_user_id", table_name="rules_engine_settings", schema=schema)
    op.drop_index("ix_rules_engine_settings_id", table_name="rules_engine_settings", schema=schema)
    op.drop_table("rules_engine_settings", schema=schema)
