"""Module providing services related to train information retrieval."""

from configparser import ConfigParser
from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict

import requests

import psycopg2
from psycopg2.extensions import connection


@dataclass
class TrainInformation:
    """
    Represents information about a train's arrival and departure.

    Attributes:
        destination_name (str): The name of the train's destination.
        journey_name (str): The name of the train's journey.
        vehicle_at_stop (bool): Indicates whether the vehicle is at the stop.
        departure_status (str): The departure status of the train.
        aimed_arrival_time (datetime): The scheduled (theoretical) arrival time of the train in format : "STIF:Line::CXXXXX:" with CXXXXX being the line identifier in Lignes Référentiel
        expected_arrival_time (datetime): The expected arrival time of the train in format "STIF:StopPoint:Q:XXXXX:" with XXXXX being the identifier in the Arrêts Référentiel.
    """

    destination_name: str
    journey_name: str
    vehicle_at_stop: bool
    departure_status: str
    aimed_arrival_time: datetime
    expected_arrival_time: datetime


config = ConfigParser()
config.read("config.ini")
API_TOKEN = config["api-token"]["TOKEN"]


BASE_URL = "https://prim.iledefrance-mobilites.fr/marketplace"
headers = {
    "apiKey": API_TOKEN,
    "Content-Type": "application/json",
    "Accept": "application/json",
}


def fetch_line_references(conn: connection, type: str) -> Dict[str, str]:
    with conn.cursor() as cursor:
        query = f"SELECT DISTINCT(name_line, line_ref) FROM core.{type}_temps_reel"
        cursor.execute(query)
        rows = cursor.fetchall()
        lines = [row[0].split(",")[0][1:] for row in rows]
        refs = [row[0].split(",")[1][:-1] for row in rows]
        lines_to_ref = {name: ref for name, ref in zip(lines, refs)}
    return lines_to_ref


def fetch_stops_references(conn: connection, type: str, line: str) -> Dict[str, str]:
    with conn.cursor() as cursor:
        query = f"SELECT DISTINCT(ar_rname, ar_rref) FROM core.{type}_temps_reel WHERE name_line = '{line}'"
        cursor.execute(query)
        rows = cursor.fetchall()
        stops = [row[0].split(",")[0][1:] for row in rows]
        refs = [row[0].split(",")[1][:-1] for row in rows]
        stops_to_ref = {name: ref for name, ref in zip(stops, refs)}
    return stops_to_ref


def get_arrival_time(
    line: str, station: str, num_trains: int = 3
) -> List[TrainInformation]:
    """
    Returns a list containing information about the next arrival times
    of trains at a given station.

    Args:
        line (str): The name of the train line.
        station (str): The name of the station where arrival times are desired.
        num_trains (int, optional): The number of next trains to retrieve arrival times for.
            Defaults to 3.

    Returns:
        List[TrainInformation]: A list of TrainInformation objects containing
        information about the next arrival times of trains at the specified station.
    """

    response = requests.get(
        f"{BASE_URL}/stop-monitoring",
        params={
            "LineRef": line,
            "MonitoringRef": station,
        },
        headers=headers,
    ).json()

    next_stops = []
    monitored_stop_visit = response["Siri"]["ServiceDelivery"][
        "StopMonitoringDelivery"
    ][0]["MonitoredStopVisit"]

    for next_train in range(0, num_trains):
        monitored_call = monitored_stop_visit[next_train]["MonitoredVehicleJourney"][
            "MonitoredCall"
        ]

        destination_name = (
            monitored_call.get("DestinationDisplay")[0].get("value")
            if monitored_call.get("DestinationName") is None
            else monitored_call.get("DestinationName")[0].get("value")
        )
        # journey_name = monitored_stop_visit[next_train]["MonitoredVehicleJourney"][
        #     "JourneyNote"
        # ][0].get("value") # this raise error
        journey_name = "none"
        vehicle_at_stop = monitored_call.get("VehicleAtStop")
        departure_status = monitored_call.get("DepartureStatus")
        # aimed_arrival_time = datetime.strptime(
        #     monitored_call.get("AimedArrivalTime"), "%Y-%m-%dT%H:%M:%S.%fZ"
        # ) #Not always provided
        aimed_arrival_time = datetime(2024, 5, 16)
        expected_arrival_time = datetime.strptime(
            monitored_call.get("ExpectedArrivalTime"), "%Y-%m-%dT%H:%M:%S.%fZ"
        )

        train_info = TrainInformation(
            destination_name=destination_name,
            journey_name=journey_name,
            vehicle_at_stop=vehicle_at_stop,
            departure_status=departure_status,
            aimed_arrival_time=aimed_arrival_time,
            expected_arrival_time=expected_arrival_time,
        )

        next_stops.append(train_info)

    return next_stops


if __name__ == "__main__":
    db_params = {
        "host": "localhost",
        "database": "metrominute",
        "user": "postgres",
        "password": "postgres",
        "port": 5432,
    }

    conn = psycopg2.connect(**db_params)

    metro_line_refs = fetch_line_references(conn=conn, type="metro")
    metro_13_stops_refs = fetch_stops_references(conn=conn, type="metro", line="13")

    line_ref = metro_line_refs["13"]
    stops_ref = metro_13_stops_refs['"Gabriel Péri"']

    print(get_arrival_time(line=line_ref, station=stops_ref))
