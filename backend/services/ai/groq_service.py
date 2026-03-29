from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_ai_report(user_input, career_output, college_output):

    # Create structured JSON
    structured_data = {
        "user": user_input,
        "career": career_output,
        "colleges": college_output
    }

    prompt = f"""
You are a senior mentor: strict, practical, ROI-focused. No fluff.

Use this data: {json.dumps(structured_data)}

If college data exists, use it. If missing, use general knowledge.

Output in EXACT format:

Reality Check:
- 2 short bullet points about user rank/situation

Best Option:
- 1-2 actual colleges or fallback suggestion

ROI Insight:
- 1-2 points about fees vs placement

Strategy:
- 2-3 actionable steps

Final Advice:
- 1 strong concluding line

Future Path Mapping:
- Year 1-2: Learn basics
- Year 3: Build projects
- Year 4: Placement range
- With effort: higher potential

Keep short, reference user input, use data.
"""

    # 🔥 WORKING MODELS
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
                temperature=0.6
            )
            return response.choices[0].message.content
        except Exception as e:
            print("MODEL FAILED:", model, str(e))
            continue

    # Fallback structured message
    return """
Reality Check:
- Your rank limits top college options
- Focus on skills over brand

Best Option:
- State engineering colleges

ROI Insight:
- Low fees, decent placements

Strategy:
- Start coding early
- Build projects
- Seek internships

Final Advice:
Skills matter more than college name

Future Path Mapping:
- Year 1-2: Learn fundamentals
- Year 3: Projects and internships
- Year 4: 4-8 LPA placement
- With effort: 10+ LPA possible
"""