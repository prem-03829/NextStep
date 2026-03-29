
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import (
    career,
    predictor,
    colleges,
    recommendation,
    decision,
    chatbot,
    personalisation,
)

app = FastAPI(title="NextStep API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3003",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(career.router)
app.include_router(predictor.router)
app.include_router(colleges.router)
app.include_router(recommendation.router)
app.include_router(decision.router)
app.include_router(chatbot.router)
app.include_router(personalisation.router)
