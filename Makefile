# Variables
REACT_APP_DIR = webapp

# Commandes
.PHONY: all build clean

all: build

# Construire l'application React
build:
	cd $(REACT_APP_DIR) && NODE_OPTIONS=--openssl-legacy-provider npm run build

# Nettoyer les fichiers générés (optionnel)
clean:
	rm -rf $(REACT_APP_DIR)/build
