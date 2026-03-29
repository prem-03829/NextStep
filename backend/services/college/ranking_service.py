# services/college/ranking_service.py

def calculate_score(roi, risk):
    score = roi * 10

    if risk == "High":
        score -= 20
    elif risk == "Medium":
        score -= 10

    return score