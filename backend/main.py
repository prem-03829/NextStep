from fastapi import FastAPI

from routes import (
    career,
    predictor,
    colleges,
    recommendation,
    decision,
    chatbot
)

app = FastAPI(title="NextStep API")

app.include_router(career.router)
app.include_router(predictor.router)
app.include_router(colleges.router)
app.include_router(recommendation.router)
app.include_router(decision.router)
app.include_router(chatbot.router)