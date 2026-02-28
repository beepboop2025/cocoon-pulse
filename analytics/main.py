"""CocoonPulse Analytics Sidecar — FastAPI service for engagement metrics."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from services.engagement import (
    compute_dau_mau,
    compute_retention_cohorts,
    compute_challenge_completion_rates,
    get_top_earners,
    get_full_engagement_summary,
)
from models import DAUMAUResponse, EngagementSummary


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[Analytics] Starting CocoonPulse analytics sidecar")
    yield
    print("[Analytics] Shutting down")


app = FastAPI(
    title="CocoonPulse Analytics",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "analytics"}


@app.get("/metrics/dau-mau", response_model=DAUMAUResponse)
def dau_mau():
    """Get Daily/Weekly/Monthly Active Users."""
    try:
        return compute_dau_mau()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics/retention")
def retention(weeks: int = 4):
    """Get weekly retention cohorts."""
    try:
        return compute_retention_cohorts(min(weeks, 12))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics/challenge-rates")
def challenge_rates():
    """Get task/challenge completion rates by type."""
    try:
        return compute_challenge_completion_rates()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics/top-earners")
def top_earners(limit: int = 10):
    """Get top earning operators."""
    try:
        return get_top_earners(min(limit, 50))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics/summary", response_model=EngagementSummary)
def summary():
    """Get full engagement summary (all metrics combined)."""
    try:
        return get_full_engagement_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
