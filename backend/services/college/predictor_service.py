from utils.data_loader import load_college_data as load_data, load_advanced_data
from services.ai.chatbot_service import generate_college_explanation


# 🔥 Probability
def calculate_admission_probability(rank, cutoff):
    if not cutoff or cutoff <= 0:
        return 0

    ratio = rank / cutoff

    if ratio <= 0.7:
        return 0.95
    elif ratio <= 0.9:
        return 0.8
    elif ratio <= 1.1:
        return 0.6
    elif ratio <= 1.3:
        return 0.4
    else:
        return 0.1


# 🔥 Category classification
def classify_college(probability):
    if probability >= 0.8:
        return "safe", "High chance of admission"
    elif probability >= 0.5:
        return "moderate", "Decent chance of admission"
    else:
        return "dream", "Low chance, ambitious choice"


# 🔥 ROI
def calculate_roi(avg_package, total_fees):
    if not avg_package or not total_fees:
        return 0
    return round(avg_package / total_fees, 2)


# 🔥 Risk
def calculate_risk(rank, cutoff):
    if not cutoff or rank is None:
        return "medium"

    ratio = rank / cutoff

    if ratio <= 0.8:
        return "low"
    elif ratio <= 1.2:
        return "medium"
    else:
        return "high"


# 🔥 Final score
def calculate_final_score(prob, roi, placement):
    return (
        prob * 0.5 +
        roi * 0.2 +
        (placement / 100) * 0.3
    )


# 🚀 MAIN FUNCTION
def predict_colleges(rank=None, percentile=None, category="OPEN", selected_course="ALL"):

    # 🔥 LOAD DATA SAFELY
    basic_data = load_data() or []
    advanced_data = load_advanced_data() or []
    colleges = basic_data + advanced_data

    results = []
    selected_course = selected_course.replace(".", "").upper().strip()

    # 🔥 SAVE ORIGINAL INPUT
    input_value = rank if rank is not None else percentile

    # 🔥 ESTIMATE RANK FROM PERCENTILE
    if percentile is not None and rank is None:
        # Rough estimate: percentile 100 = rank 1, percentile 0 = rank 100000
        rank = (100 - percentile) * 1000
        rank = max(1, int(rank))  # ensure positive

    for college in colleges:

        # 🔥 SAFETY (THIS FIXES YOUR ERROR)
        if not isinstance(college, dict):
            continue

        courses = college.get("courses") or []

        for course in courses:

            if not isinstance(course, dict):
                continue

            degree_name = course.get("degree", "")
            normalized_degree = degree_name.replace(".", "").upper()

            if selected_course != "ALL" and selected_course != normalized_degree:
                continue

            cutoffs = course.get("cutoffs") or {}

            prob_rank = None
            prob_percentile = None

            rank_cutoff = None
            percentile_cutoff = None

            # 🔵 Rank logic
            if rank is not None:
                rank_cutoff = cutoffs.get(category) or cutoffs.get("OPEN")
                if rank_cutoff:
                    prob_rank = calculate_admission_probability(rank, rank_cutoff)

            # 🔵 Percentile logic
            percentile_cutoff = (
                cutoffs.get("MHT_CET_PERCENTILE") or
                cutoffs.get("JEE_MAIN_PERCENTILE")
            )

            if percentile is not None and percentile_cutoff:
                diff = percentile - percentile_cutoff

                if diff >= 10:
                    prob_percentile = 0.95
                elif diff >= 5:
                    prob_percentile = 0.8
                elif diff >= 0:
                    prob_percentile = 0.6
                elif diff >= -5:
                    prob_percentile = 0.4
                else:
                    prob_percentile = 0.1

            # 🔥 FINAL DECISION
            if prob_rank is None and prob_percentile is None:
                continue

            probability = max(
                p for p in [prob_rank, prob_percentile] if p is not None
            )

            # 🔥 SAFE cutoff
            if prob_rank is not None and rank_cutoff is not None:
                closing_value = rank_cutoff
            elif prob_percentile is not None:
                closing_value = percentile_cutoff
            else:
                continue

            category_label, reason = classify_college(probability)

            placements = course.get("placements") or {}
            avg_package = placements.get("avg_package", 0)
            placement = placements.get("placement_percentage", 0)
            top_companies = placements.get("top_companies", [])

            fees = course.get("fees") or {}
            total_fees = fees.get("total_fees", 0)

            roi = calculate_roi(avg_package, total_fees)
            final_score = calculate_final_score(probability, roi, placement)

            risk = calculate_risk(rank, closing_value)

            if probability < 0.2:
                continue

            results.append({
                "college": college.get("college_name"),
                "city": college.get("city"),
                "degree": degree_name,
                "branch": course.get("branch"),

                "category": category_label,
                "confidence": round(probability, 2),
                "reason": reason,
                "final_score": round(final_score, 2),

                "cutoff": closing_value,
                "your_input": input_value,

                "avg_package": avg_package,
                "fees": total_fees,
                "roi": roi,
                "risk": risk,

                "placement_percentage": placement,
                "top_companies": top_companies,

                "explanation": None
            })

    # 🔥 SORT + SAFE RETURN
    results.sort(key=lambda x: x["final_score"], reverse=True)
    results = results[:20]

    # 🔥 AI (SAFE)
    for i, r in enumerate(results):
        if i < 5:
            try:
                response = generate_college_explanation(r)
                r["explanation"] = response if response else "AI explanation unavailable"
            except Exception as e:
                print("AI ERROR:", str(e))
                r["explanation"] = "AI explanation unavailable"

    return results if results else []   # 🔥 FINAL FIX