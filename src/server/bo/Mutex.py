from src.server.bo import BinaryConstraint
from src.server.bo.Kleidungsstueck import Kleidungsstueck
# Kleidungsstueck importieren um die Methode get_typ() zu verwenden

class Mutex(BinaryConstraint):

    def __init__(self):
        super().__init__()

    def check_constraint(self, kleidungsstuecke):

        """Überprüft, ob der Mutex-Constraint erfüllt ist.
        Returns True wenn der Constraint erfüllt ist (keine Verletzung),
        False wenn er verletzt ist."""

        if not self.get_bezugsobjekt1() or not self.get_bezugsobjekt2():
            return True

        typ1_vorhanden = False
        typ2_vorhanden = False

        for kleidungsstueck in kleidungsstuecke:

            """prüfen, ob die übergebenen kleidungsstücke 
            vom selben Typ sind wie das Bezugsobjekt"""

            if kleidungsstueck.get_typ() == self.get_bezugsobjekt1():
                typ1_vorhanden = True
            if kleidungsstueck.get_typ() == self.get_bezugsobjekt2():
                typ2_vorhanden = True

        # Constraint ist verletzt, wenn BEIDE Typen vorkommen
        return not (typ1_vorhanden and typ2_vorhanden)

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Mutex: {}".format(self.get_id())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Mutex()."""
        obj = Mutex()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        return obj
