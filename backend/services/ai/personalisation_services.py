# services/ai/personalisation_services.py

def generate_personalized_report(user_input, career_output, college_output):

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

    # 🎯 COLLEGE DECISION (FIXED)
    if len(safe) > 0:
        college_name = safe[0].get("college") or "this college"
        decision = f"{college_name} is a safe option for your rank {rank}."
    elif len(moderate) > 0:
        college_name = moderate[0].get("college") or "this college"
        decision = f"{college_name} is slightly risky but possible with your rank."
    else:
        decision = "No safe colleges found. Focus on improving skills or explore better options."

    # 💸 ROI
    if income < 400000:
        roi_advice = "Your financial condition is tight, prioritize low-fee colleges with good placements."
    else:
        roi_advice = "You can balance ROI with brand value."

    # 📍 TRAVEL
    if travel == "low":
        travel_advice = "Prefer nearby colleges to reduce living costs."
    else:
        travel_advice = "You can explore colleges outside your city."

    # 🎯 GOAL
    if goal == "high salary":
        goal_advice = "Focus on colleges with strong placement records and coding culture."
    else:
        goal_advice = "Focus on consistent skill development."

    # 🧠 FINAL
    final_advice = (
        f"Based on your rank ({rank}), focus on realistic colleges. "
        f"{decision} Your success depends more on skills than college brand."
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