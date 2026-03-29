# services/college/risk_service.py

def calculate_risk(user_rank, cutoff):
    if user_rank > cutoff:
        return "High"

    if abs(user_rank - cutoff) < 2000:
        return "Medium"

    return "Low"