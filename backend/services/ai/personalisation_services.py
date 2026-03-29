# services/ai/personalisation_services.py

from utils.data_loader import load_all_college_data


def generate_personalized_report(user_input, career_output, college_output):


    colleges = load_all_college_data()   

    rank = user_input.get("rank")
    income = user_input.get("family_income", 0)
    goal = user_input.get("goal", "normal")
    travel = user_input.get("travel_preference", "medium")

    top_career = career_output["recommended_careers"][0]
    career_name = top_career["career"]
    roadmap = top_career.get("personalized_path", [])

    safe = college_output.get("safe", [])
    moderate = college_output.get("moderate", [])
    dream = college_output.get("dream", [])

    # 🎯 COLLEGE DECISION LOGIC
    if safe:
        college_name = safe[0].get("college") or safe[0].get("name")
        decision = f"{college_name} is a safe option for your rank {rank}."
    elif moderate:
        college_name = moderate[0].get("college") or moderate[0].get("name")
        decision = f"{college_name} is slightly risky but possible with your rank."
    else:
        decision = "You should focus on improving skills or consider alternative colleges."

    # 💸 ROI THINKING
    if income < 400000:
        roi_advice = "Since your financial condition is tight, ROI should be your top priority. Avoid high-fee private colleges."
    else:
        roi_advice = "You can balance ROI with brand value while choosing college."

    # 📍 TRAVEL + LOCATION
    if travel == "low":
        travel_advice = "Prefer colleges near your city to reduce living costs."
    else:
        travel_advice = "You can explore colleges outside your city for better exposure."

    # 🎯 GOAL BASED
    if goal == "high salary":
        goal_advice = "Focus on colleges with strong placement stats and coding culture."
    else:
        goal_advice = "Focus on skill development and consistent growth."

    # 🧠 FINAL MENTOR RESPONSE
    final_advice = (
        f"Based on your rank ({rank}) and financial condition, you should prioritize ROI-driven colleges. "
        f"{decision} If you stay consistent with your roadmap, becoming a {career_name} is very achievable. "
        f"Do not chase brand blindly—focus on skills + placements."
    )

    return {
        "career_target": career_name,
        "roadmap": roadmap,
        "college_decision": decision,
        "roi_strategy": roi_advice,
        "travel_strategy": travel_advice,
        "goal_strategy": goal_advice,
        "final_advice": final_advice
    }