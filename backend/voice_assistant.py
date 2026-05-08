import streamlit as st
import streamlit.components.v1 as components
import requests
import json
import datetime
import time

from chatbot import build_system_prompt

def inject_voice_assistant(user_profile: dict = None):
    """
    Voice Assistant v8.0 - Chat History + Response Box + Stop Speech
    """

    # Initialize session state
    if 'voice_input_bridge' not in st.session_state:
        st.session_state.voice_input_bridge = "___FITAI_BEACON___"
    if 'assistant_reply' not in st.session_state:
        st.session_state.assistant_reply = ''
    if 'last_processed' not in st.session_state:
        st.session_state.last_processed = ''
    if 'pending_speech' not in st.session_state:
        st.session_state.pending_speech = ''
    if 'is_processing' not in st.session_state:
        st.session_state.is_processing = False
    if 'chat_history' not in st.session_state:
        st.session_state.chat_history = []
    if 'show_chat_history' not in st.session_state:
        st.session_state.show_chat_history = False

    # Callback function that runs when input changes
    def on_voice_input_change():
        transcript = st.session_state.voice_input_bridge
        
        if transcript and transcript != "___FITAI_BEACON___" and st.session_state.last_processed != transcript:
            st.session_state.is_processing = True
            
            try:
                system_content = build_system_prompt(user_profile)
                system_content += "\n\nSTRICT VOICE ASSISTANT RULES:\n1. Your response MUST be a short summary of 1-3 sentences by default.\n2. NEVER use bullet points or long lists unless the user explicitly asks for a 'detailed' answer.\n3. If the user asks for a plan, just give a high-level summary. Only provide the full details if asked to 'explain' or 'give details'."
                
                # Build messages with history context
                messages = [{"role": "system", "content": system_content}]
                
                # Add history (last 6 messages / 3 exchanges) for context
                for msg in st.session_state.chat_history[-6:]:
                    messages.append({
                        "role": msg['role'],
                        "content": msg['content']
                    })
                
                # Add current transcript with reinforced brevity
                messages.append({"role": "user", "content": f"{transcript}\n\n(IMPORTANT: Provide a 1-2 sentence summary ONLY. No lists.)"})
                
                payload = {
                    "model": "llama-3-8b-lexi-uncensored",
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 100
                }
                
                start_time = time.time()
                
                res = requests.post(
                    'http://127.0.0.1:1234/v1/chat/completions',
                    json=payload,
                    timeout=90
                )
                
                elapsed = time.time() - start_time
                
                if res.status_code == 200:
                    assistant_reply = res.json()['choices'][0]['message']['content']
                    
                    # Store in chat history
                    st.session_state.chat_history.append({
                        'role': 'user',
                        'content': transcript,
                        'timestamp': datetime.datetime.now().strftime('%H:%M:%S')
                    })
                    st.session_state.chat_history.append({
                        'role': 'assistant',
                        'content': assistant_reply,
                        'timestamp': datetime.datetime.now().strftime('%H:%M:%S'),
                        'duration': f"{elapsed:.1f}s"
                    })
                    
                    # Store the reply
                    st.session_state.assistant_reply = assistant_reply
                    st.session_state.pending_speech = assistant_reply
                    st.session_state.last_processed = transcript
                else:
                    error_msg = f"Server error: {res.status_code}"
                    st.session_state.assistant_reply = error_msg
                    st.session_state.pending_speech = "Sorry, the server returned an error."
                
            except requests.exceptions.Timeout:
                error_msg = "Request timed out after 90 seconds."
                st.session_state.assistant_reply = error_msg
                st.session_state.pending_speech = "The request took too long. Please try again."
                
            except requests.exceptions.ConnectionError:
                error_msg = "Cannot connect to LM Studio."
                st.session_state.assistant_reply = error_msg
                st.session_state.pending_speech = "Cannot connect to the AI server."
                
            except Exception as e:
                error_msg = f"Error: {str(e)}"
                st.session_state.assistant_reply = error_msg
                st.session_state.pending_speech = "An error occurred."
            
            finally:
                st.session_state.is_processing = False
                st.session_state.voice_input_bridge = "___FITAI_BEACON___"

    # Sidebar with chat history toggle
    st.sidebar.text(f"FitAI v8.0")
    
    if st.sidebar.button("📜 Toggle Chat History", use_container_width=True):
        st.session_state.show_chat_history = not st.session_state.show_chat_history
    
    if st.sidebar.button("🗑️ Clear History", use_container_width=True):
        st.session_state.chat_history = []
        st.session_state.assistant_reply = ''
        st.rerun()
    
    # Chat history display in sidebar
    if st.session_state.show_chat_history:
        st.sidebar.markdown("### 💬 Chat History")
        if st.session_state.chat_history:
            for msg in st.session_state.chat_history:
                if msg['role'] == 'user':
                    st.sidebar.markdown(f"**🎤 You** ({msg['timestamp']})")
                    st.sidebar.info(msg['content'])
                else:
                    duration = msg.get('duration', '')
                    st.sidebar.markdown(f"**🤖 AI** ({msg['timestamp']}) {duration}")
                    st.sidebar.success(msg['content'])
        else:
            st.sidebar.text("No messages yet")
    
    # Main UI Styles
    st.markdown("""
        <style>
            /* Voice Assistant Button */
            #voice-assistant-root {
                position: fixed; bottom: 30px; right: 30px;
                z-index: 999999; font-family: 'Inter', sans-serif;
            }
            .mic-button {
                width: 65px; height: 65px; border-radius: 50%;
                background: linear-gradient(135deg, #00F5A0, #00c8ff);
                border: none; cursor: pointer;
                box-shadow: 0 10px 25px rgba(0, 245, 160, 0.4);
                display: flex; align-items: center; justify-content: center;
                transition: all 0.3s ease;
            }
            .mic-button.processing {
                background: linear-gradient(135deg, #FFA500, #FF6347);
                animation: pulse 1.5s infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            .mic-icon { color: #002e1e; font-size: 28px; }
            
            /* Response Display Box */
            #response-box-container {
                position: fixed;
                bottom: 110px;
                right: 30px;
                max-width: 450px;
                min-width: 300px;
                max-height: 400px;
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 20px;
                border: 2px solid rgba(0, 245, 160, 0.3);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                padding: 20px;
                z-index: 999998;
                opacity: 0;
                transform: translateY(20px);
                pointer-events: none;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            #response-box-container.show {
                opacity: 1;
                transform: translateY(0);
                pointer-events: all;
            }
            
            .response-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(0, 245, 160, 0.2);
            }
            
            .response-title {
                color: #00F5A0;
                font-weight: 600;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .response-controls {
                display: flex;
                gap: 8px;
            }
            
            .control-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                font-size: 16px;
            }
            .control-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.05);
            }
            .control-btn.stop {
                background: rgba(239, 68, 68, 0.2);
                border-color: rgba(239, 68, 68, 0.4);
            }
            .control-btn.stop:hover {
                background: rgba(239, 68, 68, 0.3);
            }
            .control-btn.close:hover {
                background: rgba(100, 100, 100, 0.3);
            }
            
            .response-content {
                color: #e2e8f0;
                font-size: 15px;
                line-height: 1.6;
                max-height: 300px;
                overflow-y: auto;
                padding-right: 10px;
                white-space: pre-wrap;
            }
            
            .response-content::-webkit-scrollbar {
                width: 6px;
            }
            .response-content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 3px;
            }
            .response-content::-webkit-scrollbar-thumb {
                background: rgba(0, 245, 160, 0.3);
                border-radius: 3px;
            }
            .response-content::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 245, 160, 0.5);
            }
            
            .user-message {
                color: #94a3b8;
                font-size: 13px;
                font-style: italic;
                margin-bottom: 10px;
                padding: 8px 12px;
                background: rgba(0, 245, 160, 0.1);
                border-radius: 8px;
                border-left: 3px solid #00F5A0;
            }
            
            /* Status indicator */
            .status-indicator {
                position: fixed;
                bottom: 80px;
                right: 110px;
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(10px);
                padding: 8px 16px;
                border-radius: 20px;
                border: 1px solid rgba(0, 245, 160, 0.3);
                color: white;
                font-size: 13px;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
                z-index: 999997;
            }
            .status-indicator.show {
                opacity: 1;
            }
            
            /* Hide beacon input */
            div[data-testid="stTextInput"]:has(input[value*="FITAI_BEACON"]) {
                display: none !important;
            }
        </style>
        
        <div id="response-box-container">
            <div class="response-header">
                <div class="response-title">
                    <span>🤖</span>
                    <span>AI Response</span>
                </div>
                <div class="response-controls">
                    <button class="control-btn stop" id="stop-speech-btn" title="Stop Speaking">
                        🔇
                    </button>
                    <button class="control-btn close" id="close-response-btn" title="Close">
                        ✕
                    </button>
                </div>
            </div>
            <div class="user-message" id="user-message"></div>
            <div class="response-content" id="response-content">
                Waiting for response...
            </div>
        </div>
        
        <div class="status-indicator" id="status-indicator">
            Ready
        </div>
        
        <div id="voice-assistant-root">
            <button class="mic-button" id="fitai-mic-btn">
                <span class="mic-icon" id="mic-icon-span">🎤</span>
            </button>
        </div>
    """, unsafe_allow_html=True)

    # Hidden input with callback
    st.text_input(
        "Bridge", 
        value=st.session_state.voice_input_bridge, 
        key="voice_input_bridge",
        on_change=on_voice_input_change,
        label_visibility="collapsed"
    )

    # JavaScript
    cache_buster = int(time.time() * 1000)
    speech_text = st.session_state.pending_speech.replace('"', '\\"').replace('\n', ' ').replace("'", "\\'")
    user_text = st.session_state.last_processed.replace('"', '\\"').replace('\n', ' ').replace("'", "\\'")
    is_processing = "true" if st.session_state.is_processing else "false"
    
    js_code = f"""
    <script>
        // Cache buster: {cache_buster}
        (function() {{
            const doc = window.parent.document;
            const speechText = "{speech_text}";
            const userText = "{user_text}";
            const isProcessing = {is_processing};
            
            let currentUtterance = null;
            
            // Speech synthesis function
            function speakText(text) {{
                if (!text || text === "" || text === "Ready") return;
                
                if (!window.lastSpokenText || window.lastSpokenText !== text) {{
                    window.parent.speechSynthesis.cancel();
                    
                    setTimeout(() => {{
                        currentUtterance = new SpeechSynthesisUtterance(text);
                        currentUtterance.rate = 0.95;
                        currentUtterance.pitch = 1.0;
                        currentUtterance.volume = 1.0;
                        
                        currentUtterance.onstart = () => {{
                            console.log("🔊 Speaking response");
                            const stopBtn = doc.getElementById('stop-speech-btn');
                            if (stopBtn) stopBtn.style.background = "rgba(239, 68, 68, 0.4)";
                        }};
                        
                        currentUtterance.onend = () => {{
                            console.log("✅ Speech complete");
                            const stopBtn = doc.getElementById('stop-speech-btn');
                            if (stopBtn) stopBtn.style.background = "rgba(255, 255, 255, 0.1)";
                        }};
                        
                        window.parent.speechSynthesis.speak(currentUtterance);
                        window.lastSpokenText = text;
                    }}, 100);
                }}
            }}
            
            // Stop speech function
            function stopSpeech() {{
                window.parent.speechSynthesis.cancel();
                const stopBtn = doc.getElementById('stop-speech-btn');
                if (stopBtn) stopBtn.style.background = "rgba(255, 255, 255, 0.1)";
                console.log("🔇 Speech stopped");
            }}
            
            function init() {{
                const btn = doc.getElementById('fitai-mic-btn');
                const icon = doc.getElementById('mic-icon-span');
                const root = doc.getElementById('voice-assistant-root');
                const responseBox = doc.getElementById('response-box-container');
                const responseContent = doc.getElementById('response-content');
                const userMessage = doc.getElementById('user-message');
                const statusIndicator = doc.getElementById('status-indicator');
                const stopSpeechBtn = doc.getElementById('stop-speech-btn');
                const closeResponseBtn = doc.getElementById('close-response-btn');
                
                if (!btn || !icon || !root) {{
                    setTimeout(init, 300);
                    return;
                }}

                // Stop speech button
                if (stopSpeechBtn) {{
                    stopSpeechBtn.onclick = stopSpeech;
                }}
                
                // Close response box button
                if (closeResponseBtn) {{
                    closeResponseBtn.onclick = () => {{
                        if (responseBox) responseBox.classList.remove('show');
                        stopSpeech();
                    }};
                }}

                // Show processing state
                if (isProcessing) {{
                    btn.classList.add('processing');
                    icon.innerText = "⏳";
                    if (statusIndicator) {{
                        statusIndicator.innerText = "AI is thinking...";
                        statusIndicator.classList.add('show');
                    }}
                }} else {{
                    btn.classList.remove('processing');
                    icon.innerText = "🎤";
                }}

                // Display response
                if (speechText && speechText !== "" && speechText !== "Ready" && !isProcessing) {{
                    if (responseBox && responseContent && userMessage) {{
                        // Show user message
                        if (userText) {{
                            userMessage.innerText = "You asked: " + userText;
                            userMessage.style.display = "block";
                        }} else {{
                            userMessage.style.display = "none";
                        }}
                        
                        // Show response
                        responseContent.innerText = speechText;
                        responseBox.classList.add('show');
                        
                        // Speak the response
                        speakText(speechText);
                    }}
                    
                    if (statusIndicator) {{
                        statusIndicator.classList.remove('show');
                    }}
                }}

                // Find beacon input
                function findBeaconInput() {{
                    const inputs = doc.querySelectorAll('input[type="text"]');
                    for (let input of inputs) {{
                        if (input.value && input.value.includes("FITAI_BEACON")) {{
                            return input;
                        }}
                    }}
                    return null;
                }}

                // Voice input handler
                btn.onclick = function() {{
                    if (isProcessing) {{
                        if (statusIndicator) {{
                            statusIndicator.innerText = "Please wait...";
                            statusIndicator.classList.add('show');
                            setTimeout(() => statusIndicator.classList.remove('show'), 2000);
                        }}
                        return;
                    }}
                    
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (!SpeechRecognition) {{
                        alert("Speech recognition requires Chrome or Edge browser");
                        return;
                    }}

                    const recognition = new SpeechRecognition();
                    recognition.lang = 'en-US';
                    recognition.continuous = false;
                    recognition.interimResults = false;

                    recognition.onstart = () => {{
                        btn.style.background = "#ff4b4b";
                        icon.innerText = "🔴";
                        if (statusIndicator) {{
                            statusIndicator.innerText = "Listening...";
                            statusIndicator.classList.add('show');
                        }}
                        // Hide response box while listening
                        if (responseBox) responseBox.classList.remove('show');
                        console.log("🎤 Recording started");
                    }};

                    recognition.onresult = (event) => {{
                        const transcript = event.results[0][0].transcript;
                        console.log("📝 Transcribed:", transcript);
                        
                        if (statusIndicator) {{
                            statusIndicator.innerText = "Sending: " + transcript;
                        }}
                        icon.innerText = "📤";
                        
                        const bridgeInput = findBeaconInput();
                        if (!bridgeInput) {{
                            console.error("❌ Bridge input not found");
                            if (statusIndicator) {{
                                statusIndicator.innerText = "Error: Connection lost";
                                setTimeout(() => statusIndicator.classList.remove('show'), 2000);
                            }}
                            resetUI();
                            return;
                        }}

                        const nativeSetter = Object.getOwnPropertyDescriptor(
                            window.HTMLInputElement.prototype, 
                            'value'
                        ).set;
                        nativeSetter.call(bridgeInput, transcript);
                        
                        bridgeInput.dispatchEvent(new Event('input', {{ bubbles: true }}));
                        bridgeInput.dispatchEvent(new Event('change', {{ bubbles: true }}));
                        
                        console.log("✅ Sent to AI");
                        
                        btn.classList.add('processing');
                        icon.innerText = "⏳";
                        if (statusIndicator) {{
                            statusIndicator.innerText = "AI is thinking (up to 90s)...";
                        }}
                    }};

                    recognition.onerror = (event) => {{
                        console.error("❌ Recognition error:", event.error);
                        if (statusIndicator) {{
                            statusIndicator.innerText = "Error: " + event.error;
                            statusIndicator.classList.add('show');
                            setTimeout(() => statusIndicator.classList.remove('show'), 3000);
                        }}
                        resetUI();
                    }};

                    recognition.onend = () => {{
                        console.log("🎤 Recording ended");
                        if (icon.innerText === "🔴") resetUI();
                    }};

                    function resetUI() {{
                        btn.style.background = "linear-gradient(135deg, #00F5A0, #00c8ff)";
                        btn.classList.remove('processing');
                        icon.innerText = "🎤";
                    }}
                    
                    recognition.start();
                }};
            }}
            
            init();
        }})();
    </script>
    """
    
    components.html(js_code, height=0)
    
    if st.session_state.pending_speech and not st.session_state.is_processing:
        st.session_state.pending_speech = ''