"""
auth_api.py — FastAPI authentication server for Fitness AI Trainer.
Handles user signup, login, and profile retrieval.
Shares users.db with the Streamlit backend.

Run with:
    uvicorn auth_api:app --reload --port 8000
"""

import sqlite3
import os
from pathlib import Path
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import bcrypt
import requests
from dotenv import load_dotenv
load_dotenv()

LM_STUDIO_BASE_URL = os.getenv("LM_STUDIO_BASE_URL", "http://127.0.0.1:1234/v1")
LM_STUDIO_MODEL = os.getenv("LM_STUDIO_MODEL", "llama-3-8b-lexi-uncensored")
LM_STUDIO_CHAT_URL = f"{LM_STUDIO_BASE_URL.rstrip('/')}/chat/completions"

from chatbot import build_system_prompt, fetch_bmi_context

# ── DB Setup ────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "users.db"


def get_db():
    """Return a sqlite3 connection to the shared users.db file."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create tables if they don't exist."""
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            username      TEXT    UNIQUE NOT NULL,
            password_hash TEXT    NOT NULL,
            age           INTEGER,
            gender        TEXT,
            height_cm     REAL,
            weight_kg     REAL,
            fitness_goal  TEXT,
            activity_level TEXT,
            injuries      TEXT,
            workout_days  INTEGER,
            created_at    TEXT    NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS bmi_history (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            height_cm   REAL    NOT NULL,
            weight_kg   REAL    NOT NULL,
            bmi         REAL    NOT NULL,
            recorded_at TEXT    NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS workout_plans (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            plan_json   TEXT    NOT NULL,
            created_at  TEXT    NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS diet_plans (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            plan_json   TEXT    NOT NULL,
            created_at  TEXT    NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.commit()
    conn.close()


# ── FastAPI App ──────────────────────────────────────────────────────────────

app = FastAPI(title="FitAI Auth API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialise DB on startup
init_db()


# ── Pydantic Models ──────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    username: str
    password: str
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    fitness_goal: str
    activity_level: str
    injuries: str = ""
    workout_days: int


class UpdateStatsRequest(BaseModel):
    username: str
    height_cm: float
    weight_kg: float


class LoginRequest(BaseModel):
    username: str
    password: str


class VoiceChatRequest(BaseModel):
    username: Optional[str] = None
    message: str
    history: list = []


class GenerateWorkoutPlanRequest(BaseModel):
    username: str


class GenerateDietPlanRequest(BaseModel):
    username: str


class UpdatePlanRequest(BaseModel):
    username: str
    plan_json: dict


class UserProfile(BaseModel):
    username: str
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    fitness_goal: str
    activity_level: str
    injuries: str
    workout_days: int


# ── Helpers ──────────────────────────────────────────────────────────────────

def extract_json_block(text: str) -> str:
    """
    Extracts a JSON block from text using markers or brace matching.
    Includes a basic repair for missing trailing braces.
    """
    # 1. Check for explicit markers
    if "---JSON_START---" in text and "---JSON_END---" in text:
        start = text.find("---JSON_START---") + len("---JSON_START---")
        end = text.find("---JSON_END---")
        return text[start:end].strip()

    # 2. Fallback to brace finding
    start = text.find('{')
    end = text.rfind('}')
    
    if start != -1:
        if end == -1 or end < start:
            # No closing brace? Try to just take from start to end of string
            return text[start:].strip()
        
        extracted = text[start:end+1].strip()
        
        # 3. Simple repair: If it starts with { but doesn't end with }, add it
        # This fixes truncation issues
        if extracted.startswith('{') and not extracted.endswith('}'):
            extracted += '}'
        
        return extracted
        
    return text


def row_to_profile(row) -> dict:
    return {
        "username":       row["username"],
        "age":            row["age"],
        "gender":         row["gender"],
        "height_cm":      row["height_cm"],
        "weight_kg":      row["weight_kg"],
        "fitness_goal":   row["fitness_goal"],
        "activity_level": row["activity_level"],
        "injuries":       row["injuries"] or "",
        "workout_days":   row["workout_days"],
    }


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.post("/signup", summary="Register a new user with their fitness profile")
def signup(data: SignupRequest):
    # Check username uniqueness
    conn = get_db()
    existing = conn.execute(
        "SELECT id FROM users WHERE username = ?", (data.username,)
    ).fetchone()

    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="Username already taken.")

    # Hash password
    password_hash = bcrypt.hashpw(
        data.password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    conn.execute("""
        INSERT INTO users
            (username, password_hash, age, gender, height_cm, weight_kg,
             fitness_goal, activity_level, injuries, workout_days, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.username, password_hash, data.age, data.gender,
        data.height_cm, data.weight_kg, data.fitness_goal,
        data.activity_level, data.injuries, data.workout_days,
        datetime.utcnow().isoformat()
    ))
    conn.commit()

    # Return the full profile so the frontend can store it
    row = conn.execute(
        "SELECT * FROM users WHERE username = ?", (data.username,)
    ).fetchone()
    
    # Record initial BMI in history
    bmi = data.weight_kg / ((data.height_cm / 100) ** 2)
    conn.execute("""
        INSERT INTO bmi_history (user_id, height_cm, weight_kg, bmi, recorded_at)
        VALUES (?, ?, ?, ?, ?)
    """, (row["id"], data.height_cm, data.weight_kg, round(bmi, 2), datetime.utcnow().isoformat()))
    conn.commit()
    
    conn.close()

    return {"success": True, "profile": row_to_profile(row)}


@app.post("/login", summary="Authenticate a user and return their profile")
def login(data: LoginRequest):
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM users WHERE username = ?", (data.username,)
    ).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    # Verify password
    if not bcrypt.checkpw(data.password.encode("utf-8"), row["password_hash"].encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    return {"success": True, "profile": row_to_profile(row)}


@app.get("/profile/{username}", summary="Fetch a user profile (used by Streamlit)")
def get_profile(username: str):
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM users WHERE username = ?", (username,)
    ).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="User not found.")

    return row_to_profile(row)


@app.get("/health", summary="Health check")
def health():
    return {"status": "ok", "db": str(DB_PATH)}


@app.post("/update-stats", summary="Update user height and weight and record BMI history")
def update_stats(data: UpdateStatsRequest):
    conn = get_db()
    
    # Get user
    user = conn.execute("SELECT id FROM users WHERE username = ?", (data.username,)).fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user profile
    conn.execute("""
        UPDATE users 
        SET height_cm = ?, weight_kg = ?
        WHERE id = ?
    """, (data.height_cm, data.weight_kg, user["id"]))
    
    # Record history
    bmi = data.weight_kg / ((data.height_cm / 100) ** 2)
    conn.execute("""
        INSERT INTO bmi_history (user_id, height_cm, weight_kg, bmi, recorded_at)
        VALUES (?, ?, ?, ?, ?)
    """, (user["id"], data.height_cm, data.weight_kg, round(bmi, 2), datetime.utcnow().isoformat()))
    
    conn.commit()
    
    # Get updated profile
    updated_row = conn.execute("SELECT * FROM users WHERE id = ?", (user["id"],)).fetchone()
    conn.close()
    
    return {"success": True, "profile": row_to_profile(updated_row)}


@app.get("/bmi-history/{username}", summary="Get BMI history for a user")
def get_bmi_history(username: str):
    conn = get_db()
    
    # Get user id
    user = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get history
    history = conn.execute("""
        SELECT height_cm, weight_kg, bmi, recorded_at 
        FROM bmi_history 
        WHERE user_id = ? 
        ORDER BY recorded_at ASC
    """, (user["id"],)).fetchall()
    
    conn.close()
    
    return [dict(row) for row in history]


@app.post("/voice-assistant/chat")
def voice_assistant_chat(data: VoiceChatRequest):
    user_profile = None
    bmi_context = ""
    
    if data.username:
        try:
            conn = get_db()
            row = conn.execute("SELECT * FROM users WHERE username = ?", (data.username,)).fetchone()
            conn.close()
            if row:
                user_profile = row_to_profile(row)
                bmi_context = fetch_bmi_context(data.username)
        except Exception:
            pass

    system_content = build_system_prompt(user_profile, bmi_context)
    system_content += "\n\nSTRICT VOICE ASSISTANT RULES:\n1. Your response MUST be a short summary of 1-3 sentences.\n2. NEVER use bullet points.\n3. Keep it motivating and concise."

    messages = [{"role": "system", "content": system_content}]
    
    # Add history
    for msg in data.history[-6:]:
        messages.append({
            "role": msg['role'],
            "content": msg['content']
        })
    
    messages.append({"role": "user", "content": data.message})

    payload = {
        "model": LM_STUDIO_MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 150
    }

    try:
        res = requests.post(
            LM_STUDIO_CHAT_URL,
            json=payload,
            timeout=90
        )
        if res.status_code == 200:
            return res.json()
        else:
            raise HTTPException(status_code=res.status_code, detail="LM Studio error")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/workout-plan/generate", summary="Generate and store a new workout plan")
def generate_workout_plan(data: GenerateWorkoutPlanRequest):
    conn = get_db()
    user_row = conn.execute("SELECT * FROM users WHERE username = ?", (data.username,)).fetchone()
    
    if not user_row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
        
    profile = row_to_profile(user_row)
    
    system_prompt = f"""
You are an expert AI fitness coach. Generate a 7-day body workout plan based on the user's physical profile.
User Profile:
- Age: {profile['age']}
- Gender: {profile['gender']}
- Height: {profile['height_cm']} cm
- Weight: {profile['weight_kg']} kg
- Fitness Goal: {profile['fitness_goal']}
- Activity Level: {profile['activity_level']}
- Injuries: {profile['injuries'] if profile['injuries'] else 'None'}
- Workout Days/Week: {profile['workout_days']}

Output ONLY valid JSON.
Start your response with ---JSON_START--- and end it with ---JSON_END---.
The format must be exactly like this:
---JSON_START---
{{
  "monday": {{"focus": "Chest & Triceps", "exercises": ["Push-ups: 3x10", "Dips: 3x12"]}},
  "tuesday": {{"focus": "Rest or Light Cardio", "exercises": ["30 min walk"]}},
  "wednesday": {{"focus": "Back & Biceps", "exercises": ["Pull-ups: 3x5", "Bicep Curls: 3x15"]}},
  "thursday": {{"focus": "Rest", "exercises": ["Stretching"]}},
  "friday": {{"focus": "Legs", "exercises": ["Squats: 4x15", "Lunges: 3x12"]}},
  "saturday": {{"focus": "Shoulders & Core", "exercises": ["Shoulder Press: 3x12", "Plank: 3x30s"]}},
  "sunday": {{"focus": "Rest", "exercises": ["Active Recovery"]}}
}}
---JSON_END---
Do NOT include any markdown formatting like ```json. Do NOT include any explanations. Just the JSON block between the markers. Ensure every opening brace has a matching closing brace.
"""
    
    payload = {
        "model": LM_STUDIO_MODEL,
        "messages": [{"role": "system", "content": system_prompt}],
        "temperature": 0.7,
        "max_tokens": 800
    }
    
    try:
        res = requests.post(LM_STUDIO_CHAT_URL, json=payload, timeout=90)
        if res.status_code == 200:
            content = res.json()['choices'][0]['message']['content']
            # Robustly extract JSON block
            json_str = extract_json_block(content)
            
            # Verify it's valid JSON
            import json
            try:
                parsed_json = json.loads(json_str)
            except json.JSONDecodeError:
                conn.close()
                raise HTTPException(status_code=500, detail="LLM did not return valid JSON structure. Please try again.")
            
            # Store in DB
            conn.execute("""
                INSERT INTO workout_plans (user_id, plan_json, created_at)
                VALUES (?, ?, ?)
            """, (user_row["id"], json_str, datetime.utcnow().isoformat()))
            conn.commit()
            conn.close()
            
            return {"success": True, "plan": parsed_json}
        else:
            conn.close()
            raise HTTPException(status_code=res.status_code, detail="LM Studio error")
    except Exception as e:
        try:
            conn.close()
        except:
            pass
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/workout-plan/{username}", summary="Get the most recent workout plan")
def get_workout_plan(username: str):
    conn = get_db()
    user = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
    
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
        
    plan = conn.execute("""
        SELECT plan_json, created_at FROM workout_plans 
        WHERE user_id = ? 
        ORDER BY created_at DESC LIMIT 1
    """, (user["id"],)).fetchone()
    
    conn.close()
    
    import json
    if plan:
        return {"success": True, "plan": json.loads(plan["plan_json"]), "created_at": plan["created_at"]}
    return {"success": False, "plan": None}


@app.post("/diet-plan/generate", summary="Generate and store a new diet plan")
def generate_diet_plan(data: GenerateDietPlanRequest):
    conn = get_db()
    user_row = conn.execute("SELECT * FROM users WHERE username = ?", (data.username,)).fetchone()
    
    if not user_row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
        
    profile = row_to_profile(user_row)
    
    system_prompt = f"""
You are an expert AI nutritionist. Generate a 7-day diet plan based on the user's physical profile.
User Profile:
- Age: {profile['age']}
- Gender: {profile['gender']}
- Height: {profile['height_cm']} cm
- Weight: {profile['weight_kg']} kg
- Fitness Goal: {profile['fitness_goal']}
- Activity Level: {profile['activity_level']}

Output ONLY valid JSON.
Start your response with ---JSON_START--- and end it with ---JSON_END---.
The format must be exactly like this:
---JSON_START---
{{
  "monday": {{"meals": {{"breakfast": "Oatmeal with berries", "lunch": "Grilled chicken salad", "dinner": "Baked salmon with quinoa", "snacks": "Greek yogurt"}}, "calories": "~2000"}},
  ...
}}
---JSON_END---
IMPORTANT: Note that "calories" is a sibling of "meals", NOT nested inside it.
Do NOT include any markdown formatting like ```json. Do NOT include any explanations. Just the JSON block between the markers.
"""
    
    payload = {
        "model": LM_STUDIO_MODEL,
        "messages": [{"role": "system", "content": system_prompt}],
        "temperature": 0.7,
        "max_tokens": 1000
    }
    
    try:
        res = requests.post(LM_STUDIO_CHAT_URL, json=payload, timeout=90)
        if res.status_code == 200:
            content = res.json()['choices'][0]['message']['content']
            # Robustly extract JSON block
            json_str = extract_json_block(content)
            
            import json
            try:
                parsed_json = json.loads(json_str)
            except json.JSONDecodeError:
                conn.close()
                raise HTTPException(status_code=500, detail="LLM did not return valid JSON structure. Please try again.")
            
            conn.execute("""
                INSERT INTO diet_plans (user_id, plan_json, created_at)
                VALUES (?, ?, ?)
            """, (user_row["id"], json_str, datetime.utcnow().isoformat()))
            conn.commit()
            conn.close()
            
            return {"success": True, "plan": parsed_json}
        else:
            conn.close()
            raise HTTPException(status_code=res.status_code, detail="LM Studio error")
    except Exception as e:
        try: conn.close()
        except: pass
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/diet-plan/{username}", summary="Get the most recent diet plan")
def get_diet_plan(username: str):
    conn = get_db()
    user = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
        
    plan = conn.execute("SELECT plan_json, created_at FROM diet_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", (user["id"],)).fetchone()
    conn.close()
    
    import json
    if plan:
        return {"success": True, "plan": json.loads(plan["plan_json"]), "created_at": plan["created_at"]}
    return {"success": False, "plan": None}


@app.post("/workout-plan/update", summary="Manually update workout plan")
def update_workout_plan(data: UpdatePlanRequest):
    conn = get_db()
    user = conn.execute("SELECT id FROM users WHERE username = ?", (data.username,)).fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
    
    import json
    plan_str = json.dumps(data.plan_json)
    conn.execute("INSERT INTO workout_plans (user_id, plan_json, created_at) VALUES (?, ?, ?)", (user["id"], plan_str, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()
    return {"success": True}


@app.post("/diet-plan/update", summary="Manually update diet plan")
def update_diet_plan(data: UpdatePlanRequest):
    conn = get_db()
    user = conn.execute("SELECT id FROM users WHERE username = ?", (data.username,)).fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
    
    import json
    plan_str = json.dumps(data.plan_json)
    conn.execute("INSERT INTO diet_plans (user_id, plan_json, created_at) VALUES (?, ?, ?)", (user["id"], plan_str, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()
    return {"success": True}
