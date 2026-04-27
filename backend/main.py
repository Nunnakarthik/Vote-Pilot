from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from . import models, database
from .database import engine, get_db
from services.intent_service import detect_intent
from services.knowledge_service import get_local_knowledge, format_local_response

# Initialize database
models.Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = ""
    state: Optional[str] = "National"

class UserLogin(BaseModel):
    email: str
    password: str

# Local Responses for fallback
GREETING_RESPONSE = "Hello! I am **Vote Pilot**, your civic assistant. How can I help you today with election information?"
FALLBACK_RESPONSE = "I'm sorry, I'm currently in **Local Mode** and don't have information on that specific topic. Try asking about **registration**, **voting**, or **deadlines**!"

@app.get("/api/chat")
async def chat_get():
    return {"message": "Chat endpoint is active. Use POST to send messages."}

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "vote-pilot-backend", "db": "connected"}

@app.post("/api/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user.password)
    new_user = models.User(
        email=user.email, 
        hashed_password=hashed_password,
        full_name=user.full_name,
        state=user.state
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user": {"email": new_user.email}}

@app.post("/api/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "message": "Login successful", 
        "user": {
            "email": db_user.email,
            "full_name": db_user.full_name,
            "state": db_user.state
        }
    }

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
