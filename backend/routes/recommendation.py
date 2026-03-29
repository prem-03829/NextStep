from fastapi import APIRouter
from services.career.career_service import career_recommendation_engine
from services.college.predictor_service import predict_colleges
from services.ai.summary_service import generate_summary
from services.ai.personalisation_services import generate_personalized_report

router = APIRouter(prefix="/recommendation", tags=["Recommendation"])


# 🔹 Dummy college data (replace later with DB)
COLLEGE_DATA = [
    {
        "name": "IIT Bombay",
        "cutoff": 500,
        "avg_package": 20,
        "fees": 2
    },
    {
        "name": "VJTI Mumbai",
        "cutoff": 3000,
        "avg_package": 10,
        "fees": 1
    },
    {
        "name": "Private College X",
        "cutoff": 15000,
        "avg_package": 6,
        "fees": 4
    }
]


@router.post("/search")
def full_recommendation(user_input: dict):
    
    # 🧠 STEP 1: Career Engine
    career_output = career_recommendation_engine(user_input)

    if not career_output["recommended_careers"]:
        return {"error": "No career match found"}

    # 🎯 Pick top career
    top_career = career_output["recommended_careers"][0]["career"]

    # 🎯 STEP 2: College Predictor
    user_rank = user_input.get("rank", 999999)
    college_results = predict_colleges(user_rank, COLLEGE_DATA)

    # 📊 STEP 3: Group into safe/moderate/dream
    grouped = {
        "safe": [],
        "moderate": [],
        "dream": []
    }

    for col in college_results:
        grouped[col["category"]].append(col)

    # 🤖 STEP 4: Summary
    summary = generate_summary(career_output["recommended_careers"])

    # 🧠 STEP 5: PERSONALIZED REPORT (YOUR USP 🔥)
    personalized_report = generate_personalized_report(
        user_input,
        career_output,
        grouped
    )

    # 🚀 FINAL RESPONSE
    return {
        "career_recommendation": career_output,
        "selected_career": top_career,
        "college_results": grouped,
        "summary": summary,
        "personalized_report": personalized_report
    }