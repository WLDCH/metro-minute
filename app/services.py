"""Module providing services related to train information retrieval."""

from datetime import datetime
from typing import List, Dict, Any
from collections import defaultdict

import requests

from psycopg2.extensions import connection

from database import get_db_connection
from models import TrainInformation
from config import BASE_URL, HEADERS


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
        stops = [row[0].split(",")[0][1:] for row in rows]
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

    for next_train in range(0, num_trains):
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
    conn = get_db_connection()

    metro_line_refs = fetch_line_references(conn=conn, type="metro")
    metro_stops_refs = fetch_stops_references(conn=conn, type="metro", line="12")

    line_ref = metro_line_refs["12"]
    stops_ref = metro_stops_refs['Rennes']

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