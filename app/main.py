from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi import Form
from starlette.requests import Request

import uvicorn

from services import fetch_stops_names
from database import get_db_connection


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
@app.get("/stops")
async def get_stops(line: str  = Query(...), type: str = Query(...)):

    stops = fetch_stops_names(conn=get_db_connection(), type=type, line=line)
    return {'stops': stops}



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)