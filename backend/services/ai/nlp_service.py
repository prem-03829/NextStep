# services/ai/nlp_service.py

def map_interest_to_course(user_input: str):
    user_input = user_input.lower()

    mapping = {
        "software": "B.TECH",
        "coding": "B.TECH",
        "engineer": "B.TECH",
        "data": "B.TECH",
        "ai": "B.TECH",

        "manager": "MBA",
        "business": "MBA",

        "research": "M.TECH",
        "phd": "PH.D"
    }

    for key, value in mapping.items():
        if key in user_input:
            return value

    return "ALL"