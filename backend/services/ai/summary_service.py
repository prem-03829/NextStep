# services/ai/summary_service.py

def generate_summary(grouped):
    try:
        safe_count = len(grouped.get("safe", []))
        moderate_count = len(grouped.get("moderate", []))
        dream_count = len(grouped.get("dream", []))

        return (
            f"You have {safe_count} safe options, "
            f"{moderate_count} moderate options, and "
            f"{dream_count} dream colleges."
        )

    except Exception as e:
        print("SUMMARY ERROR:", e)
        return "Summary unavailable"