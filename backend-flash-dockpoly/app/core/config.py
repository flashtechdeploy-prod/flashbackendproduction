import os
from typing import List
from urllib.parse import urlparse, urlunparse, unquote, parse_qsl, urlencode
from pydantic_settings import BaseSettings, SettingsConfigDict

# Get the project root directory (flash-full folder)
_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=(
            "backend/backend.env",
            "backend.env",
            "backend/.env",
            ".env",
        ),
        case_sensitive=True,
    )
    
    # Application
    APP_NAME: str = "Flash ERP"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database - Local PostgreSQL
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/flash"

    # Uploads
    UPLOADS_DIR: str = os.path.join(_PROJECT_ROOT, "uploads")
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://localhost:3001"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Convert comma-separated string to list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
settings = Settings()


def _redact_database_url(database_url: str) -> str:
    try:
        parsed = urlparse(database_url)
        if parsed.scheme.startswith("sqlite"):
            return database_url

        if parsed.username:
            host = parsed.hostname or ""
            port = f":{parsed.port}" if parsed.port else ""
            netloc = f"{parsed.username}:***@{host}{port}"
            return urlunparse(parsed._replace(netloc=netloc))

        return database_url
    except Exception:
        return "<redacted>"


def _normalize_database_url(database_url: str) -> str:
    if database_url.startswith("postgres://"):
        database_url = "postgresql+psycopg://" + database_url[len("postgres://"):]
    elif database_url.startswith("postgresql://"):
        database_url = "postgresql+psycopg://" + database_url[len("postgresql://"):]
    elif database_url.startswith("mysql://"):
        database_url = "mysql+pymysql://" + database_url[len("mysql://"):]
    elif database_url.startswith("sqlite:"):
        # Some .env values may URL-encode spaces (e.g., %20). SQLite expects a real filesystem path.
        # Example: sqlite:///C:/Users/me/Desktop/backend%20clone/flash_erp.db
        return unquote(database_url)

    try:
        parsed = urlparse(database_url)
        hostname = parsed.hostname or ""
        if hostname.endswith(".supabase.co"):
            query = dict(parse_qsl(parsed.query, keep_blank_values=True))
            if "sslmode" not in query:
                query["sslmode"] = "require"
                return urlunparse(parsed._replace(query=urlencode(query)))
    except Exception:
        pass

    return database_url

# Log the database being used
settings.DATABASE_URL = _normalize_database_url(settings.DATABASE_URL)
print(f"[Config] Using database: {_redact_database_url(settings.DATABASE_URL)}")
