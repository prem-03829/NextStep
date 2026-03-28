from fastapi import APIRouter

router = APIRouter(prefix="/predictor", tags=["Predictor"])

@router.post("/predict")
def predict_colleges():
    return {
        "safe": [],
        "moderate": [],
        "dream": []
    }

@router.get("/cutoffs")
def get_cutoffs():
    return {"message": "Cutoff data"}