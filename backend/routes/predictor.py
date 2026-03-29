from fastapi import APIRouter, HTTPException
from services.college.predictor_service import predict_colleges
from schemas.predictor_schema import PredictorResponse
from services.ai.summary_service import generate_summary
import traceback

router = APIRouter(prefix="/predictor", tags=["Predictor"])


@router.get("/", response_model=PredictorResponse)
def get_prediction(
    rank: int = None,
    percentile: float = None,
    category: str = "OPEN",
    course: str = "ALL"
):
    try:
        category = category.upper()
        course = course.upper()

        if rank is None and percentile is None:
            raise HTTPException(status_code=400, detail="Provide rank or percentile")

        input_type = "rank" if rank else "percentile"

        print("🔥 INPUT:", rank, percentile, category, course)

        results = predict_colleges(rank, percentile, category, course)

        # 🔥 SAFETY FIX (VERY IMPORTANT)
        if results is None:
            results = []

        print("✅ RESULTS COUNT:", len(results))

        grouped = {
            "safe": [],
            "moderate": [],
            "dream": []
        }

        for r in results:
            if not isinstance(r, dict):
                continue

            cat = r.get("category")

            if cat not in grouped:
                continue

            grouped[cat].append(r)

        for key in grouped:
            grouped[key] = grouped[key][:5]

        summary = generate_summary(grouped)

        return {
            "input_type": "rank" if rank else "percentile",
            "rank": rank,
            "percentile": percentile,
            "category": category,
            "selected_course": course,
            "total_results": len(results),
            "summary": summary,
            "results": grouped
        }

    except Exception as e:
        print("❌ FULL ERROR BELOW:")
        traceback.print_exc()   # 🔥 THIS WILL SHOW REAL ERROR
        raise HTTPException(status_code=500, detail=str(e))