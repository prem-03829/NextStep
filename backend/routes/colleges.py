from fastapi import APIRouter, HTTPException
from services.college.predictor_service import predict_colleges
from schemas.predictor_schema import PredictorRequest, PredictorResponse, CollegePrediction
from typing import Dict, List

router = APIRouter(prefix="/colleges", tags=["Colleges"])

@router.post("/predict", response_model=PredictorResponse)
def predict_colleges_route(request: PredictorRequest):
    try:
        # Call the service
        results = predict_colleges(
            rank=request.rank,
            percentile=request.percentile,
            category=request.category,
            selected_course=getattr(request, 'selected_course', 'ALL')
        )
        
        # Group results by category
        grouped_results: Dict[str, List[CollegePrediction]] = {
            "safe": [],
            "moderate": [],
            "dream": []
        }
        
        for result in results:
            category = result.get("category", "moderate")
            grouped_results[category].append(CollegePrediction(**result))
        
        # Determine input type
        input_type = "rank" if request.rank is not None else "percentile"
        
        # Create summary
        total_results = len(results)
        summary = f"Found {total_results} college predictions based on your {input_type}."
        
        return PredictorResponse(
            input_type=input_type,
            rank=request.rank,
            percentile=request.percentile,
            category=request.category,
            selected_course=getattr(request, 'selected_course', 'ALL'),
            total_results=total_results,
            summary=summary,
            results=grouped_results
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def get_colleges():
    return {"colleges": []}

@router.post("/filter")
def filter_colleges():
    return {"filtered": []}

@router.get("/{college_id}")
def get_college(college_id: int):
    return {"college_id": college_id}

@router.get("/")
def get_all_colleges():
    return load_all_college_data()