# main.py

import os
import json
import spacy
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv

# Import the emergency constants from your safety file
from safety_responses import SAFETY_KEYWORDS_MAP, EMERGENCY_RESPONSES_MAP

# --- 1. Basic Setup & Configuration ---

load_dotenv()
app = FastAPI(
    title="MindWell AI Chatbot API",
    description="An API for a mental wellness chatbot for students.",
    version="1.1.0"
)

# Configure CORS
origins = ["http://localhost:3000", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. NLP & AI Model Configuration ---

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy 'en_core_web_sm' model...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set!")

genai.configure(api_key=GEMINI_API_KEY)

# --- 3. Pydantic Data Models (for Request/Response Validation) ---

# Represents a single message in the conversation history
class ChatMessage(BaseModel):
    role: str
    parts: List[str]

# Represents the input from the frontend, which now includes the history
class UserInput(BaseModel):
    history: List[ChatMessage]

class BotResponse(BaseModel):
    reply: str

# Represents the rich output of the analysis endpoint
class AnalysisResponse(BaseModel):
    sentiment: str = Field(..., example="Stressed")
    confidence: float = Field(..., example=0.95)
    topics: List[str] = Field(..., example=["exams", "parental pressure"])
    urgency: str = Field(..., example="High")
    summary: str = Field(..., example="The user is feeling stressed due to exam pressure and parental expectations.")

# --- 4. Master Prompts ---

MASTER_PROMPT_CHAT = """
You are 'MindWell', a caring wellness assistant for students in India. Your primary goal is to be a supportive and natural conversational partner. Your tone should always be calm, empathetic, and encouraging.

Your conversational flow MUST follow these steps:
1.  **Validate & Ask:** Acknowledge the user's feelings with an original, empathetic phrase. Then, in the SAME response, you MUST ask ONE gentle, open-ended question to understand more. **DO NOT offer a resource in this step.** Your only goal here is to listen and learn more.
2.  **Listen & Offer:** **ONLY AFTER** the user has replied to your question from Step 1, you can then acknowledge their second message and gently offer ONE relevant resource. Phrase it as a helpful suggestion like, "Thank you for sharing that. It sounds like you're dealing with X, sometimes Y can help. Would you be interested...?"

**CRITICAL RULE for short answers:** If the user gives a short, dismissive reply like "no" or "nah", DO NOT PROBE FURTHER. Acknowledge their response and gracefully end the conversation with a supportive closing statement.

You are a guide, NOT a therapist. Keep responses concise.

**APPROVED RESOURCES:**
- For Stress/Anxiety: "A helpful technique is the 3-minute breathing exercise: [link_to_audio.mp3]"
- For Academic Burnout: "The Pomodoro Technique can help manage your workload. Here's a guide: [link_to_article]"
- To Talk to a Professional: "You can book a confidential session with a counselor here: [link_to_booking_page]"
"""

MASTER_PROMPT_ANALYZE = """
Analyze the following conversation transcript between a student ('User') and a wellness chatbot ('Bot').
Provide an overall analysis of the user's state throughout the conversation.
Return ONLY a valid JSON object with the following keys:
- "sentiment": The dominant sentiment of the user (e.g., "Anxious", "Stressed").
- "confidence": A float between 0 and 1.
- "topics": A JSON array of the main topics discussed (e.g., ["exams", "parental pressure"]).
- "urgency": The overall urgency level ("Low", "Medium", or "High").
- "summary": A one-sentence summary of the user's core issue.
"""

# --- 5. Helper Function ---

def clean_text(text: str) -> str:
    """Uses spaCy to clean and lemmatize text for analysis."""
    doc = nlp(text.lower())
    cleaned_tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct and not token.is_space]
    return " ".join(cleaned_tokens)

# --- 6. API Endpoints ---

@app.post("/api/chat", response_model=BotResponse, tags=["Chatbot"])
async def chat(user_input: UserInput):
    """
    Handles conversational interactions with memory.
    The frontend must send the recent chat history with each call.
    """
    if not user_input.history:
        raise HTTPException(status_code=400, detail="Chat history cannot be empty.")

    # **Critical Safety Net** - checks the LATEST user message
    last_user_message = user_input.history[-1].parts[0].lower()
    for crisis_type, keywords in SAFETY_KEYWORDS_MAP.items():
        if any(keyword in last_user_message for keyword in keywords):
            return BotResponse(reply=EMERGENCY_RESPONSES_MAP[crisis_type])

    try:
        # **OPTIMIZED:** The prompt is now a system instruction, not part of the history.
        model_with_instructions = genai.GenerativeModel(
            'gemini-1.5-flash',
            system_instruction=MASTER_PROMPT_CHAT
        )
        
        # Convert Pydantic models to the dictionary format the Gemini API expects
        gemini_history = [{"role": msg.role, "parts": msg.parts} for msg in user_input.history]

        response = await model_with_instructions.generate_content_async(gemini_history)
        return BotResponse(reply=response.text)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred with the AI service: {e}")


@app.post("/api/analyze", response_model=AnalysisResponse, tags=["Analytics"])
async def analyze(user_input: UserInput): # Re-using UserInput model for simplicity, expecting a long transcript
    """
    Performs a rich analysis of an entire conversation transcript.
    The frontend should send the complete, formatted chat history in the 'message' field of a single history item.
    """
    transcript = user_input.history[0].parts[0]
    cleaned_transcript = clean_text(transcript)
    
    if not cleaned_transcript:
        return AnalysisResponse(sentiment="Neutral", confidence=1.0, topics=[], urgency="Low", summary="No meaningful text provided.")

    try:
        # For one-shot analysis, concatenating the prompt is fine
        full_prompt = f"{MASTER_PROMPT_ANALYZE}\n\nTranscript:\n'''{cleaned_transcript}'''"
        model = genai.GenerativeModel('gemini-1.5-flash') # Using a fresh instance
        response = await model.generate_content_async(full_prompt)
        
        response_text = response.text.strip().replace("`", "")
        if response_text.startswith("json"):
            response_text = response_text[4:]
        
        analysis_data = json.loads(response_text)
        return AnalysisResponse(**analysis_data)

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI model returned an invalid JSON format.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")