from fastapi import APIRouter

router = APIRouter(prefix="/career", tags=["Career"])

@router.post("/recommend")
def recommend_career():
    return {"message": "Career recommendation working"}

@router.get("/{career_id}")
def get_career(career_id: int):
    return {"career_id": career_id}

@router.post("/skill-gap")
def skill_gap():
    return {"message": "Skill gap analysis"}

@router.post("/simulate")
def simulate():
    return {"message": "Career simulation"}