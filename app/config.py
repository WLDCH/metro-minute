from configparser import ConfigParser
from datetime import datetime
import pytz

config = ConfigParser()
config.read("config.ini")

paris_tz = pytz.timezone("Europe/Paris")


API_TOKEN = config["api-token"]["TOKEN"]

BASE_URL = "https://prim.iledefrance-mobilites.fr/marketplace"
HEADERS = {
    "apiKey": API_TOKEN,
    "Content-Type": "application/json",
    "Accept": "application/json",
}
