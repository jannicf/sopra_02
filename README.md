
| ![Logo](frontend/public/logo192.png) | ***MEIN<br> DIGITALER<br> KLEIDERSCHRANK*** | ![Logo](frontend/public/logo192.png) |
|:------------------------------------:|:-------------------------------------------:|:------------------------------------:|
___
# Gliederung
___
- [Software-Praktikum WS 24/25](#software-praktikum-ws-2425)
  - [Mitwirkende](#mitwirkende)
  - [Inhalt](#inhalt)
- [Frontend Setup](#frontend-setup)
  - [Voraussetzungen](#prerequisites)
  - [Installation](#installation)
- [Backend Setup](#backend-setup)
  - [Voraussetzungen](#voraussetzungen-1)
  - [Installation](#installation-1)
- [Datenbank](#database)
- [Deployment](#deployment)

___

# Software-Praktikum WS 24/25

___
### Mitwirkende
___

|                      [Boris Burkert](https://github.com/Boris147)                       |                                                                    [Jannic Friese](https://github.com/jannicfriese)                                                                    |                        [Josef Stuby](https://github.com/J0seef)                         |                    [Lucas Urban](https://github.com/LucasUrban-WI7)                     |                       [Xiaoping Wu](https://github.com/Xiao1309)                        |                                                                                            [Yasin Yasar](https://github.com/yasinyasar017)                                                                                            |
|:---------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| - Use-Case-Diagramme <br> -Klassendiagramme <br> - Business Objects <br> - Mapper <br>  | - textuelle Use-Cases <br> -Klassendiagramme <br> - Business Objects <br> - Mapper <br> - Datenbank <br> - Backend-Tests <br> - Frontend-Layout <br> - Deployment <br> - Dokumentation | - Use-Case-Diagramme <br> -Klassendiagramme <br> - Business Objects <br> - Mapper <br>  | - Use-Case-Diagramme <br> -Klassendiagramme <br> - Business Objects <br> - Mapper <br>  | - Use-Case-Diagramme <br> -Klassendiagramme <br> - Business Objects <br> - Mapper <br>  | - Use-Case-Diagramme <br> -Klassendiagramme <br> - Business Objects <br> - Mapper <br> - APIs im frontend <br> - KleiderschrankAPI <br> - API Test im frontend <br> - Google Firebase <br> - Person mit Kleiderschrank Zuweisung <br> |
___
### Inhalt
___

- [/src](/src): In diesem Verzeichnis finden Sie den Source Code des Projekts.
- [/frontend](/frontend): In diesem Verzeichnis finden Sie separat vom restlichen Source Code 
den Source Code des Frontend.
- [/mysql](/mysql): Hier finden Sie mySQL-spezifisches Material wie z.B. den Dump, um eine
Beispieldatenbank herzustellen.
___

# Frontend Setup

___
### Voraussetzungen
___
- Node.js (Version 18 oder höher) -> [hier herunterladen](https://nodejs.org/)
___
### Installation
___
1) Ins frontend-Verzeichnis wechseln
```
cd frontend
```
2) Abhängigkeiten in der package.json installieren
```
npm install
```
3) Entwicklungsserver starten
```
npm start
```

___

# Backend Setup

___
### Voraussetzungen
___
- Python (Version 3.9 oder höher) -> [hier herunterladen](https://www.python.org/downloads/)
___
### Installation
___
1) Ins src-Verzeichnis wechseln
```
cd src
```
2) Virtuelle Umgebung erstellen
```
python -m venv venv
```
3) Virtuelle Umgebung aktivieren für Windows
```
venv\Scripts\activate 
```
4) Virtuelle Umgebung aktivieren für Unix
```
source venv/bin/activate
```
5) requirements.txt installieren
```
pip install -r requirements.txt
```
6) main.py starten
```
python main.py
```
___

# Datenbank

___
Lokale DB
- mySQL installieren -> [hier herunterladen](https://dev.mysql.com/downloads/mysql/)
- Datenbankinstanz erstellen
- Datenbank erstellen
- sopra_db_dump.sql importieren

Google Cloud SQL
- Google Cloud SDK installieren -> [hier herunterladen](https://cloud.google.com/sdk)
- Google Cloud Proxy konfigurieren -> [siehe Google-Dokumentation](https://cloud.google.com/sdk/docs/proxy-settings) 
1) Anmeldung bei gcloud
```
gcloud auth login
```
2) Auswahl des Projekts
```
gcloud config set project civil-array-440815-m3
```
3) Proxy starten
```
./cloud_sql_proxy -instances=civil-array-440815-m3:europe-west3:sopra-db-instanz=tcp:3306
```
___

# Deployment

___
1) Ins frontend-Verzeichnis wechseln
```
cd frontend
```
2) Frontend aufbauen
```
npm run build
```
- Build-Ordner aus dem Frontend in src verschieben
3) App deployen
```
gcloud app deploy
```
4) App aufrufen
```
gcloud app browse
```
___