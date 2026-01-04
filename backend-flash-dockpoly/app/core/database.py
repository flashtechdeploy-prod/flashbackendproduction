from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from urllib.parse import urlparse

_connect_args = {}
try:
    parsed = urlparse(settings.DATABASE_URL)
    if parsed.scheme.startswith("postgres"):
        hostname = parsed.hostname or ""
        _connect_args = {"connect_timeout": 10}
        if "pooler.supabase.com" in hostname or hostname.endswith(".supabase.co"):
            _connect_args["options"] = "-c statement_timeout=10000"
except Exception:
    _connect_args = {}

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args=_connect_args,
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()


def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
