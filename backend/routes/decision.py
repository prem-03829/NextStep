from fastapi import APIRouter, HTTPException
from services.career.career_service import career_recommendation_engine
from services.college.predictor_service import predict_colleges
from schemas.decision_schema import DecisionRequest, DecisionResponse
from schemas.predictor_schema import PredictorResponse, CollegePrediction
from schemas.career_schema import CareerResponse
from typing import Dict, List

router = APIRouter(prefix="/decision", tags=["Decision"])

@router.post("/analyze", response_model=DecisionResponse)
def analyze_decision(request: DecisionRequest):
    try:
        # Get career recommendations
        career_result = career_recommendation_engine({
            "interests": request.interests,
            "preferred_course": request.preferred_course
        })
        career_response = CareerResponse(**career_result)
        
        # Get college predictions
        college_results = predict_colleges(
            rank=request.rank,
            percentile=request.percentile,
            category=request.category,
            selected_course=request.selected_course
        )
        
        # Group college results
        grouped_results: Dict[str, List[CollegePrediction]] = {
            "safe": [],
            "moderate": [],
            "dream": []
        }
        
        for result in college_results:
            category = result.get("category", "moderate")
            grouped_results[category].append(CollegePrediction(**result))
        
        input_type = "rank" if request.rank is not None else "percentile"
        total_results = len(college_results)
        summary = f"Found {total_results} college predictions based on your {input_type}."
        
        college_response = PredictorResponse(
            input_type=input_type,
            rank=request.rank,
            percentile=request.percentile,
            category=request.category,
            selected_course=request.selected_course,
            total_results=total_results,
            summary=summary,
            results=grouped_results
        )
        
        return DecisionResponse(
            career_recommendations=career_response,
            college_predictions=college_response
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))