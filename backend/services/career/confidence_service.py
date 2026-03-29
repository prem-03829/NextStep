# services/career/confidence_service.py

def calculate_confidence(score):
    if score >= 6:
        return "High"
    elif score >= 3:
        return "Medium"
    else:
        return "Low"