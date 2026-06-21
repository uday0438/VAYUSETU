import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "VAYUSETU API Gateway"
    API_V1_STR: str = "/api/v1"
    # WARNING: Change this in production by setting the JWT_SECRET environment variable
    SECRET_KEY: str = os.getenv("JWT_SECRET", "super_secret_jwt_key_to_be_replaced_in_prod")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/vayusetu")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CLIMATE_TWIN_MODE: str = os.getenv("CLIMATE_TWIN_MODE", "demo") # "demo" or "research"

settings = Settings()

