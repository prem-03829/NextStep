from pydantic import BaseModel
from typing import List, Optional, Union, Dict


# 🔥 REQUEST (optional usage)
class PredictorRequest(BaseModel):
    rank: Optional[int] = None
    percentile: Optional[float] = None
    category: str
    selected_course: Optional[str] = "ALL"


# 🔥 COLLEGE OUTPUT
class CollegePrediction(BaseModel):
    college: str
    city: Optional[str]

    degree: str
    branch: str

    category: str
    confidence: float
    reason: str

    cutoff: float

    # ✅ FIXED (supports both rank + percentile)
    your_input: Union[int, float]

    avg_package: Optional[int]
    fees: Optional[int]
    roi: float
    risk: str

    placement_percentage: Optional[float]
    top_companies: Optional[List[str]]

    # ✅ ALWAYS STRING (avoid null issues)
    explanation: Optional[str] = None


# 🔥 FINAL RESPONSE
class PredictorResponse(BaseModel):
    # ✅ NEW (important for clarity)
    input_type: str  # "rank" or "percentile"

    rank: Optional[int] = None
    percentile: Optional[float] = None

    category: str
    selected_course: str
    total_results: int

    summary: str

    # ✅ grouped results
    results: Dict[str, List[CollegePrediction]]