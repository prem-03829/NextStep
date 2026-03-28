from fastapi import APIRouter

router = APIRouter(prefix="/decision", tags=["Decision"])

@router.post("/analyze")
def analyze():
    return {"best_choice": "Coming soon"}