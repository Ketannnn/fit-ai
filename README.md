# Personal AI Trainer With Automatic Exercise Recognition and Counting

This project is an AI-powered fitness application that leverages Computer Vision, Pose Estimation, and Machine Learning to accurately track exercise repetitions during workouts. Recently, the architecture has been modernized and decoupled into a standalone **React frontend** and a **Python backend**.

## Project Architecture

The application is split into two primary components:

### 1. Frontend (`/frontend`)
A highly interactive, visually striking web application built with React and Tailwind CSS. The UI takes inspiration from premium AI SaaS platforms, featuring subtle gradients, glassmorphism effects, and dynamic micro-animations.
- **Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **Key Features**: Smooth onboarding process, data-rich dashboards, live AI-coach visualizer mockups.
- **Navigation**: Please see the `/frontend/README.md` for specific instructions to run and develop the frontend.

### 2. Backend (`/backend`)
The core machine learning engine responsible for real-time video processing and exercise inferences.
- **Tech Stack**: Python, OpenCV, MediaPipe, Streamlit, Keras (BiLSTM), OpenAI.
- **Core Features**:
  - **Exercise Classifier**: Utilizes BiLSTM models to classify distinct exercises based on MediaPipe landmarks (joint angles and normalized distances).
  - **Repetition Counting**: Tracks user repetitions mechanically using structural thresholds, as well as via automatic deep learning-based classification.
  - **Chatbot Integration**: Embeds an OpenAI GPT-3.5-turbo chatbot functioning as a personal fitness coach.
- **Navigation**: Includes scripts for feature extraction, training sequences, and launching the original Streamlit application wrapper (`main.py`).

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended for frontend)
- Python 3.7+ (for backend)

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will serve on `http://localhost:5173`.

### Running the Backend
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate | On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python -m streamlit run main.py
```
*(Note: Be sure your webcam is configured correctly if you plan to use live WebCam modules)*

# Use for both the streamlit and backend server
.\.venv312\Scripts\activate.ps1 
# Terminal 1 (already running)
python -m streamlit run main.py   # :8501
# Terminal 2 — start this new one
uvicorn auth_api:app --port 8000  # :8000
# Terminal 3 (already running)
npm run dev                        # :5173

---

## Datasets and Resources

Datasets available at:
- [Kaggle Dataset](https://www.kaggle.com/datasets/riccardoriccio/real-time-exercise-recognition-dataset)
- [Hugging Face Dataset](https://huggingface.co/datasets/RickyRiccio/Real_Time_Exercise_Recognition_Dataset)

This AI counting logic is based on the paper: "Real-Time Fitness Exercise Classification and Counting from Video Frames"
- [Link to Paper](https://arxiv.org/abs/2411.11548)

---
## Warning
- The current application utilizes the "BiLSTM Invariant" model trained on angles and normalized distances. For top performance (coordinates + angles), explore the `train_bidirectionallstm.py` script.
- Ensure that necessary instructional videos are manually sourced if you wish to see form-tutorials within the local Streamlit application.

## License and Contacts
Feel free to contact the original application author at: riccardopersonalmail@gmail.com
LinkedIn: https://www.linkedin.com/in/riccardo-riccio-bb7163296/

*(Give a star ⭐ to the repository if it was useful. Thank you! 😊)*
