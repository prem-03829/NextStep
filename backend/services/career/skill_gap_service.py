# services/career/skill_gap_service.py

def get_skill_gap(user_input, career):
    user_skills = user_input.get("interests", [])
    required_skills = career.get("skills", [])

    gap = []

    for skill in required_skills:
        if skill not in user_skills:
            gap.append(skill)

    return gap