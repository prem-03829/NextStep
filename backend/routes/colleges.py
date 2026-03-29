from fastapi import APIRouter, HTTPException, Query

from services.college.predictor_service import predict_colleges
from schemas.predictor_schema import PredictorRequest, PredictorResponse, CollegePrediction
from typing import Dict, List
from utils.data_loader import load_all_college_data

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
def get_all_colleges(
    city: str | None = Query(default=None),
    degree: str | None = Query(default=None),
    facility: str | None = Query(default=None),
    minority_only: bool = Query(default=False),
):
    colleges = load_all_college_data()

    filtered = []
    normalized_city = city.lower().strip() if city else None
    normalized_degree = degree.lower().strip() if degree else None
    normalized_facility = facility.lower().strip() if facility else None

    for college in colleges:
        college_city = str(college.get("city", "")).lower().strip()
        facilities = [str(item).lower().strip() for item in college.get("facilities", [])]
        courses = college.get("courses", [])
        degrees = [str(course.get("degree", "")).lower().strip() for course in courses]
        minority_status = bool(college.get("linguistic_minority", False))

        if normalized_city and college_city != normalized_city:
            continue

        if normalized_degree and normalized_degree not in degrees:
            continue

        if normalized_facility and normalized_facility not in facilities:
            continue

        if minority_only and not minority_status:
            continue

        filtered.append(college)

    return {"total": len(filtered), "colleges": filtered}


@router.post("/filter")
def filter_colleges(request: dict):
    return get_all_colleges(
        city=request.get("city"),
        degree=request.get("degree"),
        facility=request.get("facility"),
        minority_only=bool(request.get("minority_only", False)),
    )

@router.get("/{college_id}")
def get_college(college_id: int):
    return {"college_id": college_id}
