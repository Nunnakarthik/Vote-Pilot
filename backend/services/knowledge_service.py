import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "electionData.json")

def get_local_knowledge(intent: str):
    try:
        if not os.path.exists(DATA_PATH):
            return None
        with open(DATA_PATH, "r") as f:
            db = json.load(f)
            return db.get(intent)
    except Exception as e:
        print(f"Error reading knowledge base: {e}")
        return None

def format_local_response(data: dict):
    if not data:
        return "I don't have specific data on that yet."

    response = f"### {data.get('title', 'Information')}\n\n"
    
    steps = data.get("steps", [])
    if steps:
        for i, step in enumerate(steps, 1):
            response += f"{i}. {step}\n"

    tip = data.get("tip")
    if tip:
        response += f"\n**💡 Tip:** {tip}"

    return response
