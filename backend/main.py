import streamlit as st

# Set configuration for the theme before any other Streamlit command
st.set_page_config(page_title='Fitness AI Coach', layout='centered')

import os
from dotenv import load_dotenv
load_dotenv()

FASTAPI_BASE_URL = os.getenv("FASTAPI_BASE_URL", "http://127.0.0.1:8000")

# from Audio import text_to_speech, get_audio
import cv2
import tempfile
import ExerciseAiTrainer as exercise
from chatbot import chat_ui
from voice_assistant import inject_voice_assistant
import time
import requests


# ── Grid Helper Functions ──────────────────────────────────────────────────

def workout_to_list(plan):
    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    data = []
    for day in days:
        day_data = plan.get(day, {})
        exercises = day_data.get("exercises", [])
        if isinstance(exercises, str): exercises = [exercises]
        data.append({
            "Day": day.capitalize(),
            "Focus": day_data.get("focus", ""),
            "Exercises": ", ".join(exercises)
        })
    return data

def list_to_workout(data_list):
    plan = {}
    for row in data_list:
        day = row["Day"].lower()
        plan[day] = {
            "focus": row["Focus"],
            "exercises": [ex.strip() for ex in row["Exercises"].split(",") if ex.strip()]
        }
    return plan

def diet_to_list(plan):
    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    data = []
    for day in days:
        day_data = plan.get(day, {})
        meals = day_data.get("meals", {})
        snacks = meals.get("snacks", "")
        if isinstance(snacks, list): snacks = ", ".join(snacks)
        data.append({
            "Day": day.capitalize(),
            "Calories": day_data.get("calories", ""),
            "Breakfast": meals.get("breakfast", ""),
            "Lunch": meals.get("lunch", ""),
            "Dinner": meals.get("dinner", ""),
            "Snacks": snacks
        })
    return data

def list_to_diet(data_list):
    plan = {}
    for row in data_list:
        day = row["Day"].lower()
        plan[day] = {
            "calories": row["Calories"],
            "meals": {
                "breakfast": row["Breakfast"],
                "lunch": row["Lunch"],
                "dinner": row["Dinner"],
                "snacks": row["Snacks"]
            }
        }
    return plan


def main():
    # ── User Profile from React Auth ─────────────────────────────────────────
    # React passes the logged-in username as a query param: ?username=yash
    query_params = st.query_params
    username = query_params.get("username", None)
    user_profile = None

    if username:
        try:
            resp = requests.get(f"{FASTAPI_BASE_URL}/profile/{username}", timeout=3)
            if resp.status_code == 200:
                user_profile = resp.json()
                st.session_state["user_profile"] = user_profile
        except Exception:
            pass  # If auth API is down, continue without personalisation
    else:
        # No username — show a redirect hint (non-blocking)
        st.info(
            "💡 **Tip:** Log in from the [FitAI web app](http://localhost:5173/login) "
            "to get personalised AI coaching based on your profile.",
            icon="🔑"
        )
    # ── Exercise Session State ───────────────────────────────────────────────
    if "exercise_running" not in st.session_state:
        st.session_state.exercise_running = False
    if "completion_data" not in st.session_state:
        st.session_state.completion_data = None
    # ─────────────────────────────────────────────────────────────────────────

    # Display completion message if available
    if st.session_state.completion_data is not None:
        data = st.session_state.completion_data
        if isinstance(data, dict):
            st.success("Set completed! 🎉")
            exercise_name_map = {
                'push_up': 'Push-up',
                'squat': 'Squat',
                'bicep_curl': 'Curl',
                'shoulder_press': 'Press'
            }
            for exer_key, count in data.items():
                if count > 0:
                    name = exercise_name_map.get(exer_key, exer_key.replace('_', ' ').title())
                    st.write(f"✅ **{name}**: {count} reps")
        else:
            st.success(f"Set completed! 🎉 Total reps: **{data}**")
        st.session_state.completion_data = None

    # Define App Title and Structure
    st.title('Fitness AI Coach')

    # Inject Voice Assistant (Floating Button)
    inject_voice_assistant(user_profile=user_profile)

    # Options: Video, WebCam, Auto Classify, chatbot, Workout Plan, Diet Plan
    options = st.sidebar.selectbox('Select Option', ('Video', 'WebCam', 'Auto Classify', 'chatbot', 'Workout Plan', 'Diet Plan'))

    if options == 'chatbot':
        st.markdown('-------')
        st.markdown("The chatbot can make mistakes. Check important info.")
        chat_ui(user_profile=user_profile)

    elif options == 'Workout Plan':
        st.markdown('-------')
        st.markdown('## 📅 Your Weekly Workout Plan')
        
        if not user_profile:
            st.warning("Please log in from the React app to generate a personalized workout plan.")
        else:
            username = user_profile['username']
            
            # Fetch existing plan
            if "current_plan" not in st.session_state:
                st.session_state.current_plan = None
                try:
                    resp = requests.get(f"http://127.0.0.1:8000/workout-plan/{username}", timeout=3)
                    if resp.status_code == 200:
                        data = resp.json()
                        if data['success'] and data['plan']:
                            st.session_state.current_plan = data['plan']
                except:
                    pass
            
            if st.button("Generate New Plan 🚀"):
                with st.spinner("Analyzing your profile and generating a personalized plan..."):
                    try:
                        resp = requests.post("http://127.0.0.1:8000/workout-plan/generate", json={"username": username}, timeout=90)
                        if resp.status_code == 200:
                            st.session_state.current_plan = resp.json()['plan']
                            st.success("Workout plan generated successfully!")
                            time.sleep(1)
                            st.rerun()
                        else:
                            st.error("Failed to generate plan. Please try again.")
                    except Exception as e:
                        st.error(f"Error connecting to backend: {e}")
            
            st.markdown("---")
            
            # Display & Edit Plan
            if st.session_state.current_plan:
                plan = st.session_state.current_plan
                
                edit_mode = st.toggle("✏️ Edit Workout Plan")
                
                if edit_mode:
                    import pandas as pd
                    df_data = workout_to_list(plan)
                    edited_df = st.data_editor(pd.DataFrame(df_data), use_container_width=True, hide_index=True)
                    
                    if st.button("💾 Save Workout Plan"):
                        try:
                            new_plan = list_to_workout(edited_df.to_dict('records'))
                            resp = requests.post("http://127.0.0.1:8000/workout-plan/update", json={"username": username, "plan_json": new_plan})
                            if resp.status_code == 200:
                                st.session_state.current_plan = new_plan
                                st.success("🎉 Workout plan saved successfully to database!")
                                time.sleep(1)
                                st.rerun()
                            else:
                                st.error("❌ Failed to update plan.")
                        except Exception as e:
                            st.error(f"Error: {e}")
                else:
                    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                    cols = st.columns(3)
                    for idx, day in enumerate(days):
                        with cols[idx % 3]:
                            day_data = plan.get(day, {})
                            st.markdown(f"### {day.capitalize()}")
                            st.info(f"**Focus:** {day_data.get('focus', 'Rest')}")
                            for ex in day_data.get('exercises', []):
                                st.write(f"- {ex}")
                            st.markdown("---")
            else:
                st.info("You don't have a workout plan yet. Generate one based on your latest profile!")

    elif options == 'Diet Plan':
        st.markdown('-------')
        st.markdown('## 🥗 Your Weekly Diet Plan')
        
        if not user_profile:
            st.warning("Please log in from the React app to generate a personalized diet plan.")
        else:
            username = user_profile['username']
            
            # Fetch existing plan
            if "current_diet_plan" not in st.session_state:
                st.session_state.current_diet_plan = None
                try:
                    resp = requests.get(f"http://127.0.0.1:8000/diet-plan/{username}", timeout=3)
                    if resp.status_code == 200:
                        data = resp.json()
                        if data['success'] and data['plan']:
                            st.session_state.current_diet_plan = data['plan']
                except:
                    pass
            
            if st.button("Generate New Diet Plan 🥗"):
                with st.spinner("Creating your custom nutrition plan..."):
                    try:
                        resp = requests.post("http://127.0.0.1:8000/diet-plan/generate", json={"username": username}, timeout=90)
                        if resp.status_code == 200:
                            st.session_state.current_diet_plan = resp.json()['plan']
                            st.success("Diet plan generated successfully!")
                            time.sleep(1)
                            st.rerun()
                        else:
                            st.error("Failed to generate plan.")
                    except Exception as e:
                        st.error(f"Error connecting to backend: {e}")
            
            st.markdown("---")
            
            # Display & Edit Plan
            if st.session_state.current_diet_plan:
                plan = st.session_state.current_diet_plan
                
                edit_mode = st.toggle("✏️ Edit Diet Plan")
                
                if edit_mode:
                    import pandas as pd
                    df_data = diet_to_list(plan)
                    edited_df = st.data_editor(pd.DataFrame(df_data), use_container_width=True, hide_index=True)
                    
                    if st.button("💾 Save Diet Plan"):
                        try:
                            new_plan = list_to_diet(edited_df.to_dict('records'))
                            resp = requests.post("http://127.0.0.1:8000/diet-plan/update", json={"username": username, "plan_json": new_plan})
                            if resp.status_code == 200:
                                st.session_state.current_diet_plan = new_plan
                                st.success("🎉 Diet plan saved successfully to database!")
                                time.sleep(1)
                                st.rerun()
                            else:
                                st.error("❌ Failed to update plan.")
                        except Exception as e:
                            st.error(f"Error: {e}")
                else:
                    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                    cols = st.columns(2)
                    for idx, day in enumerate(days):
                        with cols[idx % 2]:
                            day_data = plan.get(day, {})
                            st.markdown(f"### {day.capitalize()}")
                            st.info(f"**Calories:** {day_data.get('calories', 'N/A')}")
                            meals = day_data.get('meals', {})
                            for meal_type, description in meals.items():
                                st.write(f"**{meal_type.capitalize()}:** {description}")
                            st.markdown("---")
            else:
                st.info("You don't have a diet plan yet. Generate one to get started!")

    # Define Operations if Video Option is selected
    if options == 'Video':
        st.markdown('-------')

        st.write('## Upload your video and select the correct type of Exercise to count repetitions')
        st.write("")
        st.write('Please ensure you are clearly visible and facing the camera directly. This will help the AI accurately track your movements.')

        # st.set_option('deprecation.showfileUploaderEncoding', False)

        st.sidebar.markdown('-------')

        # User can select different types of exercise
        exercise_options = st.sidebar.selectbox(
            'Select Exercise', ('Bicept Curl', 'Push Up', 'Squat', 'Shoulder Press')
        )

        st.sidebar.markdown('-------')

        # User can upload a video:
        video_file_buffer = st.sidebar.file_uploader("Upload a video", type=["mp4", "mov", 'avi', 'asf', 'm4v'])
        tfflie = tempfile.NamedTemporaryFile(delete=False)

        # if no video uploaded then use a demo
        if not video_file_buffer:
            DEMO_VIDEO = 'demo_2.mp4'
            cap = cv2.VideoCapture(DEMO_VIDEO)
            tfflie.name = DEMO_VIDEO

        # if video is uploaded then analyze the video
        else:
            tfflie.write(video_file_buffer.read())
            cap = cv2.VideoCapture(tfflie.name)
        # st.markdown('-------')

        # Visualize Video before analysis
        st.sidebar.text('Input Video')
        st.sidebar.video(tfflie.name)

        st.markdown('## Input Video')
        st.video(tfflie.name)

        st.markdown('-------')

        # Visualize Video after analysis (analysis based on the selected exercise)
        st.markdown(' ## Output Video')
        if exercise_options == 'Bicept Curl':
            exer = exercise.Exercise()
            counter, stage_right, stage_left = 0, None, None
            exer.bicept_curl(cap, is_video=True, counter=counter, stage_right=stage_right, stage_left=stage_left)

        elif exercise_options == 'Push Up':
            st.write("The exercise need to be filmed showing your left side or facing frontally")
            exer = exercise.Exercise()
            counter, stage = 0, None
            exer.push_up(cap, is_video=True, counter=counter, stage=stage)

        elif exercise_options == 'Squat':
            exer = exercise.Exercise()
            counter, stage = 0, None
            exer.squat(cap, is_video=True, counter=counter, stage=stage)

        elif exercise_options == 'Shoulder Press':
            exer = exercise.Exercise()
            counter, stage = 0, None
            exer.shoulder_press(cap, is_video=True, counter=counter, stage=stage)
    
    # Added new section for Auto Classify
    elif options == 'Auto Classify':
        st.markdown('-------')
        st.write('Click button to start automatic exercise classification and repetition counting')
        st.markdown('-------')
        st.write("Please ensure you are clearly visible and facing the camera directly. This will help the AI accurately track your movements.")
        if not st.session_state.exercise_running:
            auto_classify_button = st.button('Start Auto Classification')
            if auto_classify_button:
                st.session_state.exercise_running = True
                st.rerun()
        else:
            if st.button('Stop Auto Classification'):
                st.session_state.completion_data = st.session_state.get('current_counters', {})
                st.session_state.exercise_running = False
                st.rerun()
            
            time.sleep(2)
            exer = exercise.Exercise()
            exer.auto_classify_and_count()
            # If it breaks naturally (e.g. hands joined)
            st.session_state.completion_data = st.session_state.get('current_counters', {})
            st.session_state.exercise_running = False
            st.rerun()

    # Define Operation if webcam option is selected
    elif options == 'WebCam':
        st.markdown('-------')

        st.sidebar.markdown('-------')

        # User can select different exercises
        exercise_general = st.sidebar.selectbox(
            'Select Exercise', ('Bicept Curl', 'Push Up', 'Squat', 'Shoulder Press')
        )

        # Define a button for start the analysis (pose estimation) on the webcam
        # st.write(' Click button and say "yes" when you are in the correct position for training')
        # button = st.button('Activate AI Trainer')

        # st.markdown('-------')

        # New button for direct activation
        if not st.session_state.exercise_running:
            st.write(' Click button to start training')
            start_button = st.button('Start Exercise')
            if start_button:
                st.session_state.exercise_running = True
                st.session_state.current_reps = 0
                st.rerun()
        else:
            if st.button('Stop Exercise'):
                st.session_state.completion_data = st.session_state.get('current_reps', 0)
                st.session_state.exercise_running = False
                st.rerun()

            time.sleep(2)  # Add a delay of 2 seconds
            ready = True
            # for each type of exercise call the method that analyze that exercise
            if exercise_general == 'Bicept Curl':
                while ready:
                    cap = cv2.VideoCapture(0)
                    exer = exercise.Exercise()
                    counter, stage_right, stage_left = 0, None, None
                    exer.bicept_curl(cap, counter=counter, stage_right=stage_right, stage_left=stage_left)
                    break

            elif exercise_general == 'Push Up':
                while ready:
                    cap = cv2.VideoCapture(0)
                    exer = exercise.Exercise()
                    counter, stage = 0, None
                    exer.push_up(cap, counter=counter, stage=stage)
                    break

            elif exercise_general == 'Squat':
                while ready:
                    cap = cv2.VideoCapture(0)
                    exer = exercise.Exercise()
                    counter, stage = 0, None
                    exer.squat(cap, counter=counter, stage=stage)
                    break

            elif exercise_general == 'Shoulder Press':
                while ready:
                    cap = cv2.VideoCapture(0)
                    exer = exercise.Exercise()
                    counter, stage = 0, None
                    exer.shoulder_press(cap, counter=counter, stage=stage)
                    break
            
            # If it breaks naturally
            st.session_state.completion_data = st.session_state.get('current_reps', 0)
            st.session_state.exercise_running = False
            st.rerun()

def load_css():
    try:
        with open("static/styles.css", "r") as f:
            css = f"<style>{f.read()}</style>"
            st.markdown(css, unsafe_allow_html=True)
    except FileNotFoundError:
        pass

if __name__ == '__main__':
    load_css()
    main()
