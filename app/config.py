from configparser import ConfigParser

config = ConfigParser()
config.read("config.ini")

API_TOKEN = config["api-token"]["TOKEN"]

BASE_URL = "https://prim.iledefrance-mobilites.fr/marketplace"
HEADERS = {
    "apiKey": API_TOKEN,
    "Content-Type": "application/json",
    "Accept": "application/json",
}
