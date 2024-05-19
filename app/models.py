from dataclasses import dataclass
from datetime import datetime


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
