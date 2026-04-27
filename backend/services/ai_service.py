import httpx
import os
from dotenv import load_dotenv

load_dotenv()

async def call_ai(user_message: str, user_level: str = "beginner"):
    api_key = os.getenv("GEMINI_API_KEY")
    model = "gemini-1.5-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    system_prompt = f"""You are 'Vote Pilot Expert', an authoritative yet friendly election official. 
    Your mission is to provide non-partisan, 100% accurate voting guidance.
    
    Current context: User is at {user_level} knowledge level.
    
    RULES:
    1. STRUCTURE: Use clear ### Headers and • Bullet points.
    2. TONE: Professional, encouraging, and easy to understand for everyone.
    3. NO JARGON: Explain technical terms (e.g., 'Precinct' -> 'Voting place').
    4. SUGGESTIONS: Always end with 2-3 short follow-up questions the user might have.
    5. FORMATTING: Use **bolding** for important deadlines and required documents."""

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"{system_prompt}\n\nUser Question: {user_message}"}]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 800
        }
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=30.0)
            response.raise_for_status()
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"AI Service Error: {e}")
            raise Exception("Failed to get response from AI")
