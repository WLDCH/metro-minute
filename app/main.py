from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi import Form
from starlette.requests import Request

import uvicorn


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise toutes les origines (dommages) à accéder à l'API
    allow_credentials=True,  # Autorise l'envoi de cookies
    allow_methods=["*"],  # Autorise toutes les méthodes HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Autorise tous les en-têtes de requête
)

app.mount('/static', StaticFiles(directory='app/static'), name='static')
templates = Jinja2Templates(directory='app/templates')

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

#@app.get("/api/schedule/")
@app.get("/metro")
async def get_metro_schedule(metro_number: int = Query(...)):
    schedules = {
        1: ["08:00", "08:15", "08:30"],
        2: ["09:00", "09:15", "09:30"],
        3: ["10:00", "10:15", "10:30"],
        4: ["11:00", "11:15", "11:30"],
        5: ["12:00", "12:15", "12:30"],
        6: ["13:00", "13:15", "13:30"],
        7: ["14:00", "14:15", "14:30"],
        8: ["15:00", "15:15", "15:30"],
        9: ["16:00", "16:15", "16:30"],
        10: ["17:00", "17:15", "17:30"],
        11: ["18:00", "18:15", "18:30"],
        12: ["19:00", "19:15", "19:30"],
        13: ["20:00", "20:15", "20:30"],
        14: ["21:00", "21:15", "21:30"]
    }
    return {"schedules": schedules.get(metro_number, [])}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)