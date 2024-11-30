from src.server.bo import UnaryConstraint
from Kleidungstyp import Kleidungstyp

class Kardinalitaet(UnaryConstraint):

    def __init__(self):
        """
        Initialisiert ein Kardinalitäts-Constraint.
        """
        super().__init__()
        self.__min_anzahl = 0
        self.__max_anzahl = 0

    def set_min_anzahl(self, min_anzahl):
        """Setzen der minimalen Anzahl"""
        self.__min_anzahl = min_anzahl

    def get_min_anzahl(self):
        """Auslesen der minimalen Anzahl"""
        return self.__min_anzahl

    def set_max_anzahl(self, max_anzahl):
        """Setzen der maximalen Anzahl"""
        self.__max_anzahl = max_anzahl

    def get_max_anzahl(self):
        """Auslesen der maximalen Anzahl"""
        return self.__max_anzahl

    def check_constraint(self, kleidungsstuecke):
        """
        Überprüft, ob der Kardinalitäts-Constraint erfüllt ist.
        Returns True wenn der Constraint erfüllt ist (keine Verletzung),
        False wenn er verletzt ist.
        """
        # Wenn kein Bezugsobjekt gesetzt ist, können wir nicht prüfen
        if not self.get_bezugsobjekt():
            return True

        anzahl = 0

        for kleidungsstueck in kleidungsstuecke:

            """
            Prüfen, ob die übergebenen kleidungsstücke 
            vom selben Typ sind wie das Bezugsobjekt
            """

            if kleidungsstueck.get_typ() == self.get_bezugsobjekt():
                anzahl += 1

        # Prüfen ob die Anzahl zwischen Minimum und Maximum liegt
        return self.get_min_anzahl() <= anzahl <= self.get_max_anzahl()

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Kardinalität: {}, {}, {}, {}".format(self.get_id(),self.get_bezugsobjekt().get_bezeichnung(),
                                                 self.get_min_anzahl(), self.get_max_anzahl())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in eine Kardinalitaet()."""
        obj = Kardinalitaet()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_min_anzahl(dictionary["min_anzahl"])
        obj.set_max_anzahl(dictionary["max_anzahl"])
        obj.set_bezugsobjekt(dictionary["bezugsobjekt"])
        return obj