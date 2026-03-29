from fastapi import APIRouter
from pydantic import BaseModel
from services.ai.chatbot_service import generate_mental_guide_response

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


class ChatRequest(BaseModel):
    message: str
    context: dict = None  # Optional context from user's session


@router.post("/chat")
def chat(request: ChatRequest):
    message = request.message.strip()
    context = request.context

    if not message:
        return {"response": "I'm here to help you navigate your college and career decisions. What would you like to talk about?"}

    try:
        response = generate_mental_guide_response(message, context)
        return {"response": response}
    except Exception as e:
        return {"response": "I'm experiencing some technical difficulties, but I'm here to support you. Please try again or rephrase your question."}
