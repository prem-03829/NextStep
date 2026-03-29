from pydantic import BaseModel
from typing import List, Optional
from schemas.predictor_schema import PredictorResponse
from schemas.career_schema import CareerResponse

class DecisionRequest(BaseModel):
    # For career
    interests: List[str]
    preferred_course: str
    
    # For college
    rank: Optional[int] = None
    percentile: Optional[float] = None
    category: str = "OPEN"
    selected_course: Optional[str] = "ALL"

class DecisionResponse(BaseModel):
    career_recommendations: CareerResponse
    college_predictions: PredictorResponse