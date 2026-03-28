from fastapi import APIRouter

router = APIRouter(prefix="/recommendation", tags=["Recommendation"])

@router.post("/search")
def search():
    return {"results": []}