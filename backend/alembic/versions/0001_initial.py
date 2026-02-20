"""initial migration

Revision ID: 0001_initial
Revises: 
Create Date: 2026-02-20
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('plan', sa.String(), nullable=True, server_default='FREE'),
        sa.Column('daily_usage', sa.Integer(), nullable=True, server_default='0'),
    )
    op.create_table(
        'transactions',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('user_id', sa.String(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('risk_score', sa.Integer(), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
    )


def downgrade():
    op.drop_table('transactions')
    op.drop_table('users')
