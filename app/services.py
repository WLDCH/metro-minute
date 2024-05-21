"""Module providing services related to train information retrieval."""

from datetime import datetime
from typing import List, Dict, Any
from collections import defaultdict

import pytz

import requests

from psycopg2.extensions import connection

from database import get_db_connection
from models import TrainInformation
from config import BASE_URL, HEADERS, paris_tz


def fetch_line_references(conn: connection, type: str) -> Dict[str, str]:
    """
    A function to fetch line references based on the type of transport.

    Args:
        conn (connection): The database connection.
        type (str): The type of lines.

    Returns:
        Dict[str, str]: A dictionary mapping line names to their references.
    """
    with conn.cursor() as cursor:
        query = f"SELECT DISTINCT(name_line, line_ref) FROM core.{type}_temps_reel"
        cursor.execute(query)
        rows = cursor.fetchall()
        lines = [row[0].split(",")[0][1:] for row in rows]
        refs = [row[0].split(",")[1][:-1] for row in rows]
        lines_to_ref = {name: ref for name, ref in zip(lines, refs)}
    return lines_to_ref


def fetch_stops_references(conn: connection, type: str, line: str) -> Dict[str, str]:
    """
    A function to fetch stops references based on the type and line provided.

    Args:
        conn (connection): The database connection.
        type (str): The type of stops.
        line (str): The line reference.

    Returns:
        Dict[str, str]: A dictionary mapping stops to their references.
    """
    with conn.cursor() as cursor:
        query = f"SELECT DISTINCT(ar_rname, ar_rref) FROM core.{type}_temps_reel WHERE name_line = '{line}'"
        cursor.execute(query)
        rows = cursor.fetchall()
        stops = [row[0].split(",")[0][1:].strip('"') for row in rows]
        refs = [row[0].split(",")[1][:-1] for row in rows]
        stops_to_ref = defaultdict(list)
        for stop, ref in zip(stops, refs):
            stops_to_ref[stop].append(ref)
    return dict(stops_to_ref)


def fetch_stops_names(conn: connection, type: str, line: str) -> List[str]:
    stops_to_ref = fetch_stops_references(conn=conn, type=type, line=line)
    return list(stops_to_ref.keys())


def fetch_monitoring_stop_info(line: str, stop: str) -> Dict[str, Any]:
    """
    Fetches monitoring stop information for a specific line and stop.

    Args:
        line (str): The line reference.
        stop (str): The monitoring stop reference.

    Returns:
        Dict[str, Any]: The response data containing monitoring stop information.
    """
    print(f'{line} - {stop}')
    response = requests.get(
        f"{BASE_URL}/stop-monitoring",
        params={
            "LineRef": line,
            "MonitoringRef": stop,
        },
        headers=HEADERS,
    )

    response.raise_for_status()
    return response.json()


def parse_monitoring_stop_info(
    data: Dict[str, Any], num_trains: int = 3
) -> List[TrainInformation]:
    """
    Parses monitoring stop information from the provided data and returns a list of TrainInformation objects.

    Args:
        data (Dict[str, Any]): The monitoring stop information data to be parsed.
        num_trains (int, optional): The number of trains to extract information for. Defaults to 3.

    Returns:
        List[TrainInformation]: A list of TrainInformation objects containing parsed information about the next trains.
    """
    next_stops = []
    monitored_stop_visit = data["Siri"]["ServiceDelivery"]["StopMonitoringDelivery"][0][
        "MonitoredStopVisit"
    ]

    print(f'{monitored_stop_visit=}')

    next_train = 0
    utc_now = datetime.utcnow()
    while len(next_stops) < num_trains and len(monitored_stop_visit)>next_train:
        monitored_call = monitored_stop_visit[next_train]["MonitoredVehicleJourney"][
            "MonitoredCall"
        ]

        destination_name = (
            monitored_call.get("DestinationDisplay")[0].get("value")
            if monitored_call.get("DestinationName") is None
            else monitored_call.get("DestinationName")[0].get("value")
        )

        journey_name = (
            monitored_stop_visit[next_train]["MonitoredVehicleJourney"]["JourneyNote"][
                0
            ].get("value")
            if len(
                monitored_stop_visit[next_train]["MonitoredVehicleJourney"][
                    "JourneyNote"
                ]
            )
            >= 1
            else "None"
        )

        vehicle_at_stop = monitored_call.get("VehicleAtStop")
        departure_status = monitored_call.get("DepartureStatus")
        aimed_arrival_time = monitored_call.get("AimedArrivalTime", None)
        aimed_arrival_time = (
            datetime.strptime(aimed_arrival_time, "%Y-%m-%dT%H:%M:%S.%fZ")
            if aimed_arrival_time is not None
            else None
        )
        
        if monitored_call.get('ExpectedArrivalTime') is not None:
            expected_arrival_time = datetime.strptime(
                monitored_call.get("ExpectedArrivalTime"), "%Y-%m-%dT%H:%M:%S.%fZ"
            )
        else:
            expected_arrival_time = datetime.strptime(
                monitored_call.get("ExpectedDepartureTime"), "%Y-%m-%dT%H:%M:%S.%fZ"
            ) # case when stop is terminus

        if expected_arrival_time < utc_now:
            next_train += 1
            continue

        arrival_time_in_minute = round(
            (expected_arrival_time - datetime.utcnow()).total_seconds() / 60
        )

        arrival_time_local = (
            expected_arrival_time.replace(tzinfo=pytz.utc).astimezone(paris_tz).time().strftime("%H:%M:%S")
        )

        train_info = TrainInformation(
            destination_name=destination_name,
            journey_name=journey_name,
            vehicle_at_stop=vehicle_at_stop,
            departure_status=departure_status,
            aimed_arrival_time=aimed_arrival_time,
            expected_arrival_time=expected_arrival_time,
            arrival_time_in_minutes=arrival_time_in_minute,
            arrival_time_local=arrival_time_local,
        )

        next_stops.append(train_info)
        next_train += 1

    return next_stops


if __name__ == "__main__":
    conn = get_db_connection()

    line_refs = fetch_line_references(conn=conn, type="rer")
    stops_refs = fetch_stops_references(conn=conn, type="rer", line="B")

    line_ref = line_refs["B"]
    stops_ref = stops_refs["Villepinte"]

    print('{line_ref=} - {stops_ref=}')

    stop_monitoring_data_aller = fetch_monitoring_stop_info(
        line=line_ref, stop=stops_ref[0]
    )
    stop_monitoring_data_retour = fetch_monitoring_stop_info(
        line=line_ref, stop=stops_ref[1]
    )
    next_train_aller = parse_monitoring_stop_info(
        data=stop_monitoring_data_aller, num_trains=1
    )
    next_train_retour = parse_monitoring_stop_info(
        data=stop_monitoring_data_retour, num_trains=1
    )

    print(next_train_aller)
    print(next_train_retour)
