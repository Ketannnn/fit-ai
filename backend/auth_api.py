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
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import bcrypt

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
