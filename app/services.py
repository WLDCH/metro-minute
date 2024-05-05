"""Module providing services related to train information retrieval."""

from configparser import ConfigParser
from dataclasses import dataclass
from datetime import datetime
from typing import List

import requests


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
        params={"LineRef": line, "MonitoringRef": station,},
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
        journey_name = monitored_stop_visit[next_train]["MonitoredVehicleJourney"][
            "JourneyNote"
        ][0].get("value")
        vehicle_at_stop = monitored_call.get("VehicleAtStop")
        departure_status = monitored_call.get("DepartureStatus")
        aimed_arrival_time = datetime.strptime(
            monitored_call.get("AimedArrivalTime"), "%Y-%m-%dT%H:%M:%S.%fZ"
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
    print(
        get_arrival_time(line="STIF:Line::C01742:", station="STIF:StopPoint:Q:473921:")
    )
