# services/career/regret_service.py

def predict_regret(user_input, career):
    interest_match = any(skill in user_input["interests"] for skill in career["skills"])

    if not interest_match:
        return "High Risk"

    if career["avg_salary"] < 8:
        return "Medium Risk"

    return "Low Risk"