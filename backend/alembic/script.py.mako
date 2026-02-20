<%!
from alembic import op
import sqlalchemy as sa
%>
"""${message}
"""

revision = ${repr(upgrade_id)}
down_revision = ${repr(down_revision)}
branch_labels = None
depends_on = None


def upgrade():
${upgrades if upgrades else '    pass'}


def downgrade():
${downgrades if downgrades else '    pass'}
