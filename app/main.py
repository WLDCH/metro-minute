from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from starlette.requests import Request

import uvicorn

from services import (
    fetch_line_references,
    fetch_stops_names,
    fetch_monitoring_stop_info,
    fetch_stops_references,
    parse_monitoring_stop_info,
)
from database import get_db_connection


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

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")


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
    stop_ref_aller = stops_refs[stop][0]
    stop_ref_retour = stops_refs[stop][1]

    stop_monitoring_data_aller = fetch_monitoring_stop_info(
        line=line_ref, stop=stop_ref_aller
    )
    stop_monitoring_data_retour = fetch_monitoring_stop_info(
        line=line_ref, stop=stop_ref_retour
    )

    next_train_aller = parse_monitoring_stop_info(
        data=stop_monitoring_data_aller, num_trains=1
    )
    next_train_retour = parse_monitoring_stop_info(
        data=stop_monitoring_data_retour, num_trains=1
    )

    return {
        "schedules": [
            next_train_aller[0].arrival_time_in_minutes,
            next_train_retour[0].arrival_time_in_minutes,
        ],
        "destination_names": [
            next_train_aller[0].destination_name,
            next_train_retour[0].destination_name,
        ],
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
