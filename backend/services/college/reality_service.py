# services/college/reality_service.py

def reality_check(college):
    if college.get("avg_package", 0) > 10:
        return "Strong placement reality"

    return "Average placement, skill matters more"