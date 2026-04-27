from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from services.intent_service import detect_intent
from services.knowledge_service import get_local_knowledge, format_local_response

app = FastAPI(title="Vote Pilot API - Local Mode")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    userLevel: Optional[str] = "beginner"

# Local Responses for fallback
GREETING_RESPONSE = "Hello! I am **Vote Pilot**, your civic assistant. How can I help you today with election information?"
FALLBACK_RESPONSE = "I'm sorry, I'm currently in **Local Mode** and don't have information on that specific topic. Try asking about **registration**, **voting**, or **deadlines**!"

@app.get("/api/chat")
async def chat_get():
    return {"message": "Chat endpoint is active. Use POST to send messages."}

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "vote-pilot-backend"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    message = request.message
    
    print(f"[DEBUG] Processing (Local Mode): {message}")

    try:
        # 1. Detect Intent
        intent_data = detect_intent(message)
        intent = intent_data["intent"]
        confidence = intent_data["confidence"]
        
        # 2. Handle Greeting
        if intent == "greeting":
            return {
                "reply": GREETING_RESPONSE,
                "source": "local",
                "intent": "greeting"
            }

        # 3. Fetch Knowledge
        local_data = get_local_knowledge(intent)

        # 4. Return Local Data or Fallback
        if local_data:
            return {
                "reply": format_local_response(local_data),
                "source": "local",
                "intent": intent
            }

        return {
            "reply": FALLBACK_RESPONSE,
            "source": "local",
            "intent": "unknown"
        }

    except Exception as e:
        print(f"[ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
