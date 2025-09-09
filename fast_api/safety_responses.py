# safety_responses.py

# This file centralizes the critical safety logic and responses for the chatbot.

# A dictionary mapping crisis types to a set of trigger keywords.
SAFETY_KEYWORDS_MAP = {
    "SUICIDE_RISK": {"suicide", "kill myself", "self-harm", "self harm", "want to die", "end my life"},
    "SEVERE_DEPRESSION": {"hopeless", "pointless", "can't go on", "no reason to live", "emptiness", "worthless"},
    "PANIC_ATTACK": {"panic attack", "can't breathe", "hyperventilating", "overwhelmed", "spiraling", "losing control"},
    "UNSAFE_SITUATION": {"unsafe", "scared at home", "being hurt", "abuse", "not safe", "in danger"}
}

# A dictionary mapping crisis types to the exact, pre-written response.
EMERGENCY_RESPONSES_MAP = {
    "SUICIDE_RISK": (
        "It sounds like you are in immediate distress. Your safety is the most important thing right now. "
        "Please connect with iCALL at 9152987821 or the Aasra helpline at 9820466726. "
        "Help is available for you 24/7."
    ),
    "SEVERE_DEPRESSION": (
        "Feeling hopeless and empty can be incredibly difficult, but please know that these feelings can be managed with support. "
        "Talking to a professional is a brave first step. You can book a confidential session with a university counselor here: [link_to_booking_page]"
    ),
    "PANIC_ATTACK": (
        "It sounds like you might be feeling overwhelmed. Let's try to ground ourselves right now. "
        "Try the 5-4-3-2-1 technique: Name 5 things you can see, 4 things you can feel, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. "
        "When you feel ready, consider talking to a counselor about these feelings."
    ),
    "UNSAFE_SITUATION": (
        "If you are in an environment where you feel unsafe or are being hurt, your immediate safety is the priority. "
        "If you are in immediate danger, please call 112 immediately. You can also reach out to campus security at [Campus Security Number] for assistance."
    )
}