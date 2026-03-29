from pydantic import BaseModel
from typing import List, Optional

class CareerRequest(BaseModel):
    interests: List[str]
    preferred_course: str

class CareerRecommendation(BaseModel):
    career: str
    score: int
    confidence: str  # Changed from float to str to match service output
    skill_gap: List[str]
    regret_risk: str
    future_simulation: dict
    personalized_path: List[str]

class CareerResponse(BaseModel):
    recommended_careers: List[CareerRecommendation]