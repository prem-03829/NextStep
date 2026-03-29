def simulate_career(career):
    """
    Simulate future career prospects
    """
    base_salary = career.get("avg_salary", 10)
    
    # Simple simulation: salary growth over 5 years
    simulation = {
        "year_1": base_salary,
        "year_3": base_salary * 1.2,
        "year_5": base_salary * 1.5,
        "year_10": base_salary * 2.0,
        "growth_rate": "15-20% annually",
        "job_satisfaction": "High" if career.get("growth") in ["high", "very high"] else "Medium"
    }
    
    return simulation