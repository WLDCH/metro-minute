import os

import pytz

paris_tz = pytz.timezone("Europe/Paris")

API_TOKEN = os.getenv("API_TOKEN")


BASE_URL = "https://prim.iledefrance-mobilites.fr/marketplace"
HEADERS = {
    "apiKey": API_TOKEN,
    "Content-Type": "application/json",
    "Accept": "application/json",
}
