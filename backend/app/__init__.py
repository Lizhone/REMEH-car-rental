
from flask import Flask

from app.config import Config
from app.extensions import cors, db, migrate, jwt
from app.routes import register_blueprints
from app.routes.auth import init_oauth


def create_app(config_class: type[Config] = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    init_oauth(app)

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": app.config["CORS_ORIGINS"]
            }
        },
    )

    from app import models  # noqa: F401

    register_blueprints(app)

    return app
