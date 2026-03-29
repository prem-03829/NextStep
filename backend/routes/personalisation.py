from fastapi import APIRouter
from services.ai.personalisation_services import generate_personalized_report
from services.ai.groq_service import generate_ai_report 
from utils.data_loader import load_college_data

router = APIRouter(prefix="/personalization", tags=["Personalization"])


@router.post("/generate")
def generate_personalized(user_input: dict):

    try:
        # 🧠 STEP 1: Load real college data
        colleges = load_college_data()

        # 🎯 STEP 2: Simple filtering based on rank (basic logic)
        user_rank = user_input.get("rank", 999999)

        safe, moderate, dream = [], [], []

        for col in colleges:
            cutoff = col.get("cutoff", 999999)

            if user_rank <= cutoff:
                safe.append(col)
            elif abs(user_rank - cutoff) < 5000:
                moderate.append(col)
            else:
                dream.append(col)

        college_output = {
            "safe": safe[:3],
            "moderate": moderate[:3],
            "dream": dream[:3]
        }

        # 🧠 STEP 3: Career (temporary simple logic)
        career_output = {
            "recommended_careers": [
                {
                    "career": "Software Engineer",
                    "personalized_path": [
                        "Learn Python",
                        "Master DSA",
                        "Build Projects",
                        "Do Internships"
                    ]
                }
            ]
        }

        # 🧠 STEP 4: Rule-based personalization
        report = generate_personalized_report(
            user_input,
            career_output,
            college_output
        )

        # 🤖 STEP 5: AI Mentor (Grok)
        try:
            ai_advice = generate_ai_report(
                user_input,
                "Software Engineer",
                college_output
            )
        except Exception as ai_error:
            ai_advice = f"AI unavailable: {str(ai_error)}"

        # 🚀 FINAL RESPONSE
        return {
            "personalized_report": report,
            "ai_mentor_advice": ai_advice,
            "college_considered": college_output
        }

    except Exception as e:
        return {"error": str(e)}