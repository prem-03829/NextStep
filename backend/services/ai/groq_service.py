from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROK_API_KEY"))


def generate_ai_report(user_input, career, colleges):

    prompt = f"""
You are a strict and honest career mentor.

User:
Rank: {user_input.get("rank")}
Income: {user_input.get("family_income")}
Goal: {user_input.get("goal")}
Preferred Course: {user_input.get("preferred_course")}

Career: {career}

Colleges:
Safe: {colleges.get("safe")}
Moderate: {colleges.get("moderate")}
Dream: {colleges.get("dream")}

Give:
- brutally honest advice
- ROI thinking
- whether college choice is good or bad
- step-by-step roadmap

Talk like an elder brother, not like AI.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",   # ✅ comma added
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    return response.choices[0].message.content
