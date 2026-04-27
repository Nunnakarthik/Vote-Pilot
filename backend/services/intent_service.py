import re

def detect_intent(message: str):
    query = message.lower()
    
    rules = [
        {"intent": "greeting", "keywords": [r"hi", r"hello", r"hey", r"greetings", r"hola", r"help", r"start"]},
        {"intent": "registration", "keywords": [r"regist", r"apply", r"sign up", r"form 6", r"enroll", r"eligib"]},
        {"intent": "voting", "keywords": [r"vote", r"voting", r"ballot", r"booth", r"cast", r"evm", r"vvpat"]},
        {"intent": "documents", "keywords": [r"id ", r"document", r"paper", r"proof", r"aadhaar", r"epic", r"licen"]},
        {"intent": "timeline", "keywords": [r"date", r"when", r"deadline", r"timeline", r"schedule", r"phase"]},
        {"intent": "results", "keywords": [r"result", r"count", r"winner", r"who won", r"leads"]},
        {"intent": "location", "keywords": [r"poll", r"station", r"site", r"map", r"where", r"locat"]}
    ]

    for rule in rules:
        matches = [k for k in rule["keywords"] if re.search(k, query)]
        if matches:
            confidence = min(0.5 + (len(matches) * 0.1), 0.95)
            return {"intent": rule["intent"], "confidence": confidence}

    return {"intent": "general", "confidence": 0.1}
