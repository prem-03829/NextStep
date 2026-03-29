import json
from pathlib import Path


# 🧠 Load basic college data
def load_college_data():
    file_path = Path("data/college_data.json")

    if not file_path.exists():
        print("⚠️ college_data.json not found")
        return []

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading college_data.json: {e}")
        return []

    # 🔥 FIX: Normalize to list
    if isinstance(data, dict):
        return list(data.values()) if all(isinstance(v, dict) for v in data.values()) else [data]

    if isinstance(data, list):
        return data

    return []


# 🧠 Load advanced dataset
def load_advanced_data():
    file_path = Path("data/college_data_final.json")

    if not file_path.exists():
        print("⚠️ college_data_final.json not found")
        return []

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading college_data_final.json: {e}")
        return []

    # 🔥 Normalize
    if isinstance(data, dict):
        return list(data.values()) if all(isinstance(v, dict) for v in data.values()) else [data]

    if isinstance(data, list):
        return data

    return []


# 🚀 FINAL MERGED LOADER (USE THIS EVERYWHERE)
def load_all_college_data():
    basic = load_college_data()
    advanced = load_advanced_data()

    combined = basic + advanced

    # 🔥 Optional: remove duplicates (based on name)
    seen = set()
    unique_data = []

    for col in combined:
        name = col.get("name") or col.get("college_name")

        if name and name not in seen:
            seen.add(name)
            unique_data.append(col)

    return unique_data