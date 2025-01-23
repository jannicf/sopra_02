# übernommen aus der Vorlage von Prof. Thies aus 'PythonBankBeispiel-RELEASE_1.2.2'

from abc import ABC


class BusinessObject(ABC):
    """Gemeinsame Basisklasse aller in diesem Projekt für die Umsetzung des Fachkonzepts relevanten Klassen.

    Zentrales Merkmal ist, dass jedes BusinessObject eine Nummer besitzt, die man in
    einer relationalen Datenbank auch als Primärschlüssel bezeichnen würde.
    """
    def __init__(self):
        self._id = 0 # Die eindeutige Identifikationsnummer einer Instanz dieser Klasse.

    def get_id(self):
        """Auslesen der ID."""
        return self._id

    def set_id(self, id):
        """Setzen der ID."""
        self._id = id