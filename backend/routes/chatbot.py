from fastapi import APIRouter

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

@router.post("/chat")
def chat():
    return {"response": "Hello from chatbot"}