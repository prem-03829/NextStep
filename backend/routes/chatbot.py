from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat(request: ChatRequest):
    message = request.message.strip()

    if not message:
        return {"response": "Please ask a question about colleges, careers, or scholarships."}

    return {
        "response": (
            "Backend chat is connected. "
            f"You asked: {message}"
        )
    }
