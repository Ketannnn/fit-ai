import os
from dotenv import load_dotenv
import streamlit as st
from typing import Literal, Optional
from langchain_community.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferWindowMemory
from dataclasses import dataclass

# Load environment variables from .env file
load_dotenv()


import requests

def fetch_bmi_context(username: str) -> str:
    """Fetch BMI history and return a short trend summary for the system prompt."""
    try:
        resp = requests.get(f"http://127.0.0.1:8000/bmi-history/{username}", timeout=3)
        if resp.status_code != 200:
            return ""
        history = resp.json()
        if len(history) < 2:
            return f"Current BMI: {history[0]['bmi']:.1f}" if history else ""
        first, last = history[0]["bmi"], history[-1]["bmi"]
        delta = last - first
        trend = "improving ↓" if delta < -0.3 else ("worsening ↑" if delta > 0.3 else "stable →")
        return (
            f"Current BMI: {last:.1f} ({trend} from {first:.1f} "
            f"over {len(history)} recorded sessions)"
        )
    except Exception:
        return ""

def build_system_prompt(profile: Optional[dict] = None, bmi_context: str = "") -> str:
    """Build a personalized system prompt from the user's fitness profile."""
    base = (
        "You are a chatbot inserted in a web app that uses AI to classify and "
        "count the repetitions of home exercises. "
        "Act as an expert in fitness and respond to the user as their personal AI trainer. "
        "Keep your answers concise and to the point."
    )
    if not profile:
        return base

    injuries_text = profile.get('injuries', '') or 'None'
    personalized = (
        f"You are a personal AI fitness coach.\n"
        f"Here is your client's profile:\n"
        f"- Name: {profile.get('username', 'User')}\n"
        f"- Age: {profile.get('age')} | Gender: {profile.get('gender')}\n"
        f"- Height: {profile.get('height_cm')} cm | Weight: {profile.get('weight_kg')} kg\n"
        f"- Fitness Goal: {profile.get('fitness_goal')}\n"
        f"- Activity Level: {profile.get('activity_level')}\n"
        f"- Injuries / Limitations: {injuries_text}\n"
        f"- Workout Days per Week: {profile.get('workout_days')}\n"
    )
    if bmi_context:
        personalized += f"- BMI Trend: {bmi_context}\n"
        
    personalized += (
        f"\nAlways tailor your advice, workout suggestions, and exercise modifications "
        f"to this specific profile. Be concise, motivating, and realistic."
    )
    return personalized

@dataclass
class Message:
    origin: Literal["human", "ai"]
    message: str

def initialize_session_state(user_profile: Optional[dict] = None, bmi_context: str = ""):
    if "token_count" not in st.session_state:
        st.session_state.token_count = 0
    if "history" not in st.session_state:
        st.session_state.history = []
    if "conversation" not in st.session_state:
        llm = ChatOpenAI(
            openai_api_base="http://127.0.0.1:1234/v1",
            openai_api_key="lm-studio",
            temperature=0.7,
            model_name="llama-3-8b-lexi-uncensored"
        )

        # Use a lighter memory for local LLMs to prevent crashes
        conversation_memory = ConversationBufferWindowMemory(k=10)
        system_prompt = build_system_prompt(user_profile, bmi_context)
        conversation_memory.save_context({"human": "Hello"}, {"ai": system_prompt})
        st.session_state.conversation = ConversationChain(
            llm=llm,
            memory=conversation_memory,
        )

def on_click_callback():
    human_prompt = st.session_state.get('human_prompt', '')
    if human_prompt:
        llm_response = st.session_state.conversation.run(human_prompt)
        st.session_state.history.append(Message("human", human_prompt))
        st.session_state.history.append(Message("ai", llm_response))
        st.session_state.token_count += len(llm_response.split())  # Example token approximation

        # Clear the text input field after submitting the message
        st.session_state.human_prompt = ""

def chat_ui(user_profile: Optional[dict] = None):
    bmi_context = ""
    if user_profile:
        bmi_context = fetch_bmi_context(user_profile["username"])
    initialize_session_state(user_profile, bmi_context)
    st.title("Ask me anything about Fitness 🤖")

    # Define custom CSS style for message
    custom_css = """
        <style>
            .chat-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px;
            }
            .chat-row {
                display: flex;
                width: 100%;
                margin-bottom: 10px;
            }
            .user-row {
                justify-content: flex-end;
            }
            .ai-row {
                justify-content: flex-start;
            }
            .chat-bubble {
                padding: 12px 16px;
                border-radius: 18px;
                max-width: 80%;
                font-size: 16px;
                line-height: 1.5;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .user-bubble {
                background: linear-gradient(135deg, #00b4db, #0083b0);
                color: white !important;
                border-bottom-right-radius: 4px;
            }
            .ai-bubble {
                background-color: #262730;
                color: #fafafa !important;
                border-bottom-left-radius: 4px;
                border: 1px solid #464646;
            }
        </style>
    """

    # Display custom CSS
    st.markdown(custom_css, unsafe_allow_html=True)

    chat_placeholder = st.container()
    prompt_placeholder = st.form("chat-form")

    with chat_placeholder:
        st.markdown('<div class="chat-container">', unsafe_allow_html=True)
        for chat in st.session_state.history:
            row_class = "user-row" if chat.origin == 'human' else "ai-row"
            bubble_class = "user-bubble" if chat.origin == 'human' else "ai-bubble"
            div = f"""
            <div class="chat-row {row_class}">
                <div class="chat-bubble {bubble_class}">
                    {chat.message}
                </div>
            </div>
            """
            st.markdown(div, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

    with prompt_placeholder:
        st.text_input("Chat", key="human_prompt")
        st.form_submit_button("Submit", on_click=on_click_callback)

    # st.caption(f"Used {st.session_state.token_count} tokens")

if __name__ == "__main__":
    chat_ui()
