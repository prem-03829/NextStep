from fastapi import APIRouter

router = APIRouter(prefix="/colleges", tags=["Colleges"])

@router.get("/")
def get_colleges():
    return {"colleges": []}

@router.post("/filter")
def filter_colleges():
    return {"filtered": []}

@router.get("/{college_id}")
def get_college(college_id: int):
    return {"college_id": college_id}