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
        aimed_arrival_time (datetime): The scheduled (theoretical) arrival time of the train in UTC time zone.
        expected_arrival_time (datetime): The expected arrival time of the train in format in UTC time zone.
        arrival_time_in_minutes (int): The arrival time of the train in minutes.
        arrival_time_local (str): The arrival time of the train in local time zone.
    """

    destination_name: str
    journey_name: str
    vehicle_at_stop: bool
    departure_status: str
    aimed_arrival_time: datetime
    expected_arrival_time: datetime
    arrival_time_in_minutes: int
    arrival_time_local: str
