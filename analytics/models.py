from pydantic import BaseModel
from datetime import date, datetime


class DAUMAUResponse(BaseModel):
    dau: int
    wau: int
    mau: int
    dau_mau_ratio: float
    date: date


class RetentionCohort(BaseModel):
    cohort_week: str
    users_joined: int
    week_1: float
    week_2: float
    week_3: float
    week_4: float


class ChallengeCompletionRate(BaseModel):
    period: str
    total_tasks: int
    completed_tasks: int
    completion_rate: float
    avg_compute_time_ms: float


class EngagementSummary(BaseModel):
    dau_mau: DAUMAUResponse
    retention: list[RetentionCohort]
    challenge_rates: list[ChallengeCompletionRate]
    top_earners: list[dict]
    generated_at: datetime
