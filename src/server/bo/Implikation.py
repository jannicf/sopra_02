from server.bo.BinaryConstraint import BinaryConstraint
from server.bo.Kleidungstyp import Kleidungstyp
from server.bo.Style import Style

class Implikation(BinaryConstraint):

    def __init__(self):
        super().__init__()

    def check_constraint(self, kleidungsstuecke):
        """
        Überprüft, ob der Implikation-Constraint erfüllt ist.
        Returns True wenn der Constraint erfüllt ist (keine Verletzung),
        False wenn er verletzt ist.
        """
        # Wenn kein Bezugsobjekt gesetzt ist, können wir nicht prüfen
        if not self.get_bezugsobjekt1() or not self.get_bezugsobjekt2():
            return True

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
        return "Implikation: {}, {}, {}".format(self.get_id(), self.get_bezugsobjekt1().get_bezeichnung(),
                                          self.get_bezugsobjekt2().get_bezeichnung())

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Implikation()
        obj.set_id(dictionary.get("id"))

        if "bezugsobjekt1" in dictionary:
            bezugsobjekt1 = Kleidungstyp()
            bezugsobjekt1.set_id(dictionary["bezugsobjekt1"])
            obj.set_bezugsobjekt1(bezugsobjekt1)

        if "bezugsobjekt2" in dictionary:
            bezugsobjekt2 = Kleidungstyp()
            bezugsobjekt2.set_id(dictionary["bezugsobjekt2"])
            obj.set_bezugsobjekt2(bezugsobjekt2)

        if "style" in dictionary:
            style = Style()
            style.set_id(dictionary["style"])
            obj.set_style(style)

        return obj


