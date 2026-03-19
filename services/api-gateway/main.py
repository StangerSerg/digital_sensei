# test_server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
)

@app.get("/api/v1/web/user/{user_id}/dashboard")
async def dashboard(user_id: int):
    return {
        "user": {
            "rank": "3 кю · Воин",
            "streak": 14,
            "total_days": 45
        },
        "bushido": [
            {"name": "義 Справедливость", "value": 8, "trend": 0.3},
            {"name": "勇 Мужество", "value": 7, "trend": -0.2},
            {"name": "仁 Сострадание", "value": 9, "trend": 0.5},
            {"name": "礼 Уважение", "value": 8, "trend": 0},
            {"name": "誠 Честность", "value": 9, "trend": 0.2},
            {"name": "名誉 Честь", "value": 8, "trend": 0.1},
            {"name": "忠義 Верность", "value": 7, "trend": -0.3}
        ],
        "sword": [
            {"name": "Математика", "value": 72, "trend": 2},
            {"name": "Программирование", "value": 68, "trend": 5},
            {"name": "Аналитика", "value": 45, "trend": 8}
        ],
        "quality": {"energy": 7, "movement": 6, "clarity": 8},
        "recommendations": [
            "Мужество проседает — добавь вызовы",
            "Аналитика растёт — отлично!"
        ]
    }

@app.post("/api/v1/web/morning")
async def morning(request: dict):
    return {"reply": "🌅 Принято, воин! Да пребудет с тобой сила!"}

@app.post("/api/v1/web/evening")
async def evening(request: dict):
    return {"reply": "🌙 Отчёт получен. Сенсеи изучают..."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


