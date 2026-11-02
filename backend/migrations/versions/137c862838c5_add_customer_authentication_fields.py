
"""Add customer authentication fields

Revision ID: 137c862838c5
Revises:
Create Date: 2026-10-23 16:22:59.700246
"""

from alembic import op
import sqlalchemy as sa


# Revision identifiers used by Alembic.
revision = "137c862838c5"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """Add authentication fields to the existing customers table."""
    with op.batch_alter_table("customers", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                "password_hash",
                sa.String(length=255),
                nullable=True,
            )
        )

        batch_op.add_column(
            sa.Column(
                "auth_provider",
                sa.String(length=20),
                nullable=False,
                server_default="email",
            )
        )

        batch_op.add_column(
            sa.Column(
                "google_sub",
                sa.String(length=255),
                nullable=True,
            )
        )


def downgrade():
    """Remove authentication fields if this migration is rolled back."""
    with op.batch_alter_table("customers", schema=None) as batch_op:
        batch_op.drop_column("google_sub")
        batch_op.drop_column("auth_provider")
        batch_op.drop_column("password_hash")
