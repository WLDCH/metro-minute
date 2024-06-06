import os

import uvicorn
from database import get_db_connection
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from services import (
    fetch_line_references,
    fetch_monitoring_stop_info,
    fetch_stops_names,
    fetch_stops_references,
    parse_monitoring_stop_info,
)
from starlette.requests import Request

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise toutes les origines (dommages) à accéder à l'API
    allow_credentials=True,  # Autorise l'envoi de cookies
    allow_methods=[
        "*"
    ],  # Autorise toutes les méthodes HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Autorise tous les en-têtes de requête
)

app.mount("/static", StaticFiles(directory="webapp/build/static"), name="static")
templates = Jinja2Templates(directory="webapp/build")


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


# @app.get("/api/schedule/")
@app.get("/stops")
async def get_stops(line: str = Query(...), type: str = Query(...)):
    stops = fetch_stops_names(conn=get_db_connection(), type=type, line=line)
    return {"stops": stops}


@app.get("/schedules")
async def get_schedules(
    line: str = Query(...), type: str = Query(...), stop: str = Query(...)
):
    lines_refs = fetch_line_references(conn=get_db_connection(), type=type)
    stops_refs = fetch_stops_references(conn=get_db_connection(), type=type, line=line)
    line_ref = lines_refs[line]

    next_trains = []
    for stop_ref in stops_refs[stop]:
        stop_monitoring_data = fetch_monitoring_stop_info(line=line_ref, stop=stop_ref)
        next_train = parse_monitoring_stop_info(
            data=stop_monitoring_data, num_trains=10
        )
        next_trains.extend(next_train)

    return {
        "schedules_in_minutes": [
            next_train.arrival_time_in_minutes for next_train in next_trains
        ],
        "schedules_in_time": [
            next_train.arrival_time_local for next_train in next_trains
        ],
        "destination_names": [
            next_train.destination_name for next_train in next_trains
        ],
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
