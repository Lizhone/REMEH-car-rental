
"""Add one-time OAuth login codes

Revision ID: 0802585fb370
Revises: 137c862838c5
Create Date: 2026-10-23 17:26:46.712914
"""

from alembic import op
import sqlalchemy as sa


# Revision identifiers used by Alembic.
revision = "0802585fb370"
down_revision = "137c862838c5"
branch_labels = None
depends_on = None


def upgrade():
    # Create the table for temporary, one-time OAuth login codes.
    op.create_table(
        "oauth_login_codes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("code_hash", sa.String(length=64), nullable=False),
        sa.Column("customer_id", sa.Integer(), nullable=False),
        sa.Column(
            "expires_at",
            sa.DateTime(timezone=True),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["customer_id"],
            ["customers.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Ensure each hashed login code is unique.
    with op.batch_alter_table(
        "oauth_login_codes",
        schema=None,
    ) as batch_op:
        batch_op.create_index(
            batch_op.f("ix_oauth_login_codes_code_hash"),
            ["code_hash"],
            unique=True,
        )


def downgrade():
    # Remove the index and table if this migration is rolled back.
    with op.batch_alter_table(
        "oauth_login_codes",
        schema=None,
    ) as batch_op:
        batch_op.drop_index(
            batch_op.f("ix_oauth_login_codes_code_hash")
        )

    op.drop_table("oauth_login_codes")
