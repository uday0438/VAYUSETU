import uvicorn
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# Setup structured logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

# Import API routers
from app.api import climate, prediction, simulation

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise API Gateway for AI-Powered Climate Digital Twin of India",
    version="1.0.0",
)

# Set CORS middleware with proper access rules
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception on {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": "An unexpected server error occurred."}
    )

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "VAYUSETU Climate API Gateway", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Enable operational API routers
app.include_router(climate.router, prefix="/api/v1/climate", tags=["Climate Data Layer"])
app.include_router(prediction.router, prefix="/api/v1/prediction", tags=["AI Prediction Layer"])
app.include_router(simulation.router, prefix="/api/v1/simulation", tags=["Climate Simulation Layer"])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True, reload_dirs=["backend"])
