import json

with open("data/college_data_2.json") as f:
    data1 = json.load(f)

with open("data/college_data_3.json") as f:
    data2 = json.load(f)

print("File1 colleges:", len(data1))
print("File2 colleges:", len(data2))

merged_colleges = {}

# Step 1: Add all from file1
for college in data1:
    merged_colleges[college["id"]] = college

# Step 2: Merge file2
for college in data2:
    cid = college["id"]

    if cid not in merged_colleges:
        merged_colleges[cid] = college
    else:
        existing_courses = merged_colleges[cid]["courses"]
        new_courses = college["courses"]

        course_map = {c["course_id"]: c for c in existing_courses}

        for course in new_courses:
            if course["course_id"] not in course_map:
                existing_courses.append(course)
            else:
                old_course = course_map[course["course_id"]]

                # keep better version
                if len(course.keys()) > len(old_course.keys()):
                    index = existing_courses.index(old_course)
                    existing_courses[index] = course

# ✅ NOW create final_data (after merge)
final_data = list(merged_colleges.values())

with open("data/college_data_final.json", "w") as f:
    json.dump(final_data, f, indent=2)

print("✅ Merged file created successfully!")