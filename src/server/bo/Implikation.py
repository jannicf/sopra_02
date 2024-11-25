from src.server.bo import BinaryConstraint
from src.server.bo.Kleidungsstueck import Kleidungsstueck
# Kleidungsstueck importieren um die Methode get_typ() zu verwenden

class Implikation(BinaryConstraint):

    def __init__(self):
        super().__init__()

    def check_constraint(self, kleidungsstuecke):

        if not self.get_bezugsobjekt1() or not self.get_bezugsobjekt2():
            return True
        """
        Überprüft, ob der Implikation-Constraint erfüllt ist.
        Returns True wenn der Constraint erfüllt ist (keine Verletzung),
        False wenn er verletzt ist.
        """
        typ1_vorhanden = False
        typ2_vorhanden = False

        for kleidungsstueck in kleidungsstuecke:

            """
            prüfen, ob die übergebenen kleidungsstücke 
            vom selben Typ sind wie das Bezugsobjekt
            """

            if kleidungsstueck.get_typ() == self.get_bezugsobjekt1():
                typ1_vorhanden = True
            if kleidungsstueck.get_typ() == self.get_bezugsobjekt2():
                typ2_vorhanden = True

        # Wenn Typ1 vorhanden ist, muss auch Typ2 vorhanden sein
        # Wenn Typ1 nicht vorhanden ist, ist die Bedingung immer erfüllt
        return not typ1_vorhanden or typ2_vorhanden

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Implikation: {}".format(self.get_id())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in eine Implikation()."""
        obj = Implikation()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        return obj

