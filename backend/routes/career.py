from fastapi import APIRouter, HTTPException
from services.career.career_service import career_recommendation_engine
from schemas.career_schema import CareerRequest, CareerResponse

router = APIRouter(prefix="/career", tags=["Career"])

@router.post("/recommend", response_model=CareerResponse)
def recommend_career(request: CareerRequest):
    try:
        result = career_recommendation_engine(request.dict())
        return CareerResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{career_id}")
def get_career(career_id: int):
    return {"career_id": career_id}

@router.post("/skill-gap")
def skill_gap():
    return {"message": "Skill gap analysis"}

@router.post("/simulate")
def simulate():
    return {"message": "Career simulation"}