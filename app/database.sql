BEGIN;

CREATE SCHEMA IF NOT EXISTS referentiel_raw;
CREATE SCHEMA IF NOT EXISTS core;

CREATE TABLE IF NOT EXISTS referentiel_raw.arrets (
ArRId INT PRIMARY KEY NOT NULL,
ArRVersion VARCHAR(50),
ArRCreated TIMESTAMP,
ArRChanged TIMESTAMP,
ArRName VARCHAR(255),
ArRType VARCHAR(30),
ArRPublicCode VARCHAR(30),
ArRXEpsg2154 INT,
ArRYEpsg2151 INT,
ZdAID INT,
ArRGeopoint VARCHAR(255),
ArRTown VARCHAR(255),
ArRPostalRegion VARCHAR(50),
ArRAccessibility VARCHAR(30),
ArRAudibleSignals VARCHAR(30),
ArRVisualSigns VARCHAR(30),
ArRFareZone VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS referentiel_raw.lignes (
ID_Line VARCHAR(10) PRIMARY KEY NOT NULL,
Name_Line VARCHAR(255),
ShortName_Line VARCHAR(255),
TransportMode VARCHAR(50),
TransportSubmode VARCHAR(50),
Type VARCHAR(50),
OperatorRef VARCHAR(50),
OperatorName VARCHAR(50),
AdditionalOperatorName VARCHAR(100),
NetworkName VARCHAR(255),
ColourWeb_hexa VARCHAR(10),
TextColourWeb_hexa VARCHAR(10),
ColourPrint_CMJN VARCHAR(50),
TextColourPrint_hexa VARCHAR(255),
Accessibility VARCHAR(30),
AudibleSigns_Available VARCHAR(30),
VisualSigns_Available VARCHAR(30),
ID_GroupOfLines VARCHAR(30),
ShortName_GroupOfLines VARCHAR(255),
Notice_Title VARCHAR(255),
Notice_Text VARCHAR(255),
Picto VARCHAR(255),
Valid_fromDate DATE,
Valid_toDate VARCHAR(50),
Status VARCHAR(30),
PrivateCode VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS referentiel_raw.donnees_temps_reel (
    MonitoringRef_ArR VARCHAR(50),
    ArRName VARCHAR(255),
    LineRef VARCHAR(50),
    Name_Line VARCHAR(255)
);

\copy referentiel_raw.arrets FROM 'data/arrets.csv' DELIMITER ';' CSV HEADER;

\copy referentiel_raw.lignes FROM 'data/lignes.csv' DELIMITER ';' CSV HEADER;

\copy referentiel_raw.donnees_temps_reel FROM 'data/donnees-temps-reel.csv' DELIMITER ';' CSV HEADER;

COMMIT;