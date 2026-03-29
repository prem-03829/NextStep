# services/college/roi_service.py

def calculate_roi(college):
    avg_package = college.get("avg_package", 0)
    fees = college.get("fees", 1)

    return round(avg_package / fees, 2)