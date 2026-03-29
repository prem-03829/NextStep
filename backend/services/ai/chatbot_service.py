from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# 🔥 MAIN MENTOR (STRUCTURED + HYBRID AI)
def generate_mental_guide_response(user_message, context=None):

    system_prompt = """
You are a smart Indian career mentor and guide.

STYLE:
- Talk like an elder brother
- Be practical, not emotional
- No long paragraphs
- Use bullet points only

RULES:
- Keep answers short and structured
- Use real-world logic (ROI, placements, skills)
- Avoid generic motivation
- If data is given → use it
- If data missing → use general knowledge

FORMAT:

1. Reality Check:
- ...

2. Insight:
- ...

3. Action Steps:
- ...

4. Final Advice:
- ...
"""

    context_str = ""
    if context:
        context_str = f"\nContext:\n{json.dumps(context, indent=2)}"

    models = [
        "llama-3.1-8b-instant",
        "qwen/qwen3-32b",
        "moonshotai/kimi-k2-instruct"
    ]

    for model in models:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {
                        "role": "user",
                        "content": f"{user_message}\n{context_str}"
                    }
                ],
                temperature=0.5,
                max_tokens=400
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Model {model} failed:", e)
            continue

    return "Unable to generate response right now. Try again."


# 🔥 COLLEGE EXPLANATION (UI FRIENDLY)
def generate_college_explanation(college):

    prompt = f"""
Explain this college in SHORT bullet points (no paragraph):

College: {college.get('college')}
City: {college.get('city')}
Course: {college.get('degree')} - {college.get('branch')}
Confidence: {college.get('confidence')*100:.0f}%
ROI: {college.get('roi')}
Risk: {college.get('risk')}

FORMAT:
- 2–3 bullet points
- mention placement/ROI
- mention whether it's a good choice
"""

    models = [
        "llama-3.1-8b-instant",
        "qwen/qwen3-32b",
        "moonshotai/kimi-k2-instruct"
    ]

    for model in models:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4,
                max_tokens=150
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Model {model} failed:", e)
            continue

    return f"- {college.get('college')} offers decent opportunity\n- ROI: {college.get('roi')}\n- Risk level: {college.get('risk')}"