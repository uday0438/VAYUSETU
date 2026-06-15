import os
from typing import List

class Settings:
    PROJECT_NAME: str = "VAYUSETU API Gateway"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "super_secret_jwt_key_to_be_replaced_in_prod")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

settings = Settings()
