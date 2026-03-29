# services/career/career_service.py

from services.career.confidence_service import calculate_confidence
from services.career.skill_gap_service import get_skill_gap
from services.career.regret_service import predict_regret
from services.career.simulation_service import simulate_career


# Dummy career dataset (later replace with DB)
CAREER_DATA = [
    {
        "name": "Software Engineer",
        "skills": ["coding", "problem solving", "data structures"],
        "avg_salary": 12,
        "growth": "high",
        "course": "CS"
    },
    {
        "name": "Data Scientist",
        "skills": ["python", "statistics", "machine learning"],
        "avg_salary": 14,
        "growth": "very high",
        "course": "AI"
    },
    {
        "name": "Mechanical Engineer",
        "skills": ["mechanics", "design", "cad"],
        "avg_salary": 7,
        "growth": "medium",
        "course": "ME"
    }
]


def match_career(user_input, career):
    score = 0

    # interest match
    for interest in user_input["interests"]:
        if interest in career["skills"]:
            score += 2

    # course match
    if user_input["preferred_course"] == career["course"]:
        score += 3

    return score


def generate_personalized_path(user_input, career):
    path = []

    if career["name"] == "Software Engineer":
        path = [
            "Learn Python / C++",
            "Master DSA",
            "Build projects",
            "Do internships",
            "Crack placements"
        ]

    elif career["name"] == "Data Scientist":
        path = [
            "Learn Python",
            "Study Statistics",
            "Learn ML",
            "Build AI projects",
            "Participate in Kaggle"
        ]

    else:
        path = [
            "Learn core subjects",
            "Practice tools",
            "Internships",
            "Industry exposure"
        ]

    return path


def career_recommendation_engine(user_input):
    results = []

    for career in CAREER_DATA:
        score = match_career(user_input, career)

        if score > 0:
            confidence = calculate_confidence(score)
            skill_gap = get_skill_gap(user_input, career)
            regret = predict_regret(user_input, career)
            simulation = simulate_career(career)

            personalized_path = generate_personalized_path(user_input, career)

            results.append({
                "career": career["name"],
                "score": score,
                "confidence": confidence,
                "skill_gap": skill_gap,
                "regret_risk": regret,
                "future_simulation": simulation,
                "personalized_path": personalized_path
            })

    results = sorted(results, key=lambda x: x["score"], reverse=True)

    return {
        "recommended_careers": results[:3]
    }