from src.server.bo.BinaryConstraint import BinaryConstraint
from src.server.bo.Kleidungstyp import Kleidungstyp
from src.server.bo.Style import Style


class Mutex(BinaryConstraint):

    def __init__(self):
        super().__init__()

    def check_constraint(self, kleidungsstuecke):
        """
        Überprüft, ob der Mutex-Constraint erfüllt ist.
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
            Prüfen, ob die übergebenen kleidungsstücke 
            vom selben Typ sind wie das Bezugsobjekt
            """

            if kleidungsstueck.get_typ() == self.get_bezugsobjekt1():
                typ1_vorhanden = True
            if kleidungsstueck.get_typ() == self.get_bezugsobjekt2():
                typ2_vorhanden = True

        # Constraint ist verletzt, wenn BEIDE Typen vorkommen
        return not (typ1_vorhanden and typ2_vorhanden)

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Mutex: {}, {}, {}".format(self.get_id(), self.get_bezugsobjekt1().get_bezeichnung(),
                                          self.get_bezugsobjekt2().get_bezeichnung())

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Mutex()
        obj.set_id(dictionary.get("id"))

        if "bezugsobjekt1" in dictionary:
            if isinstance(dictionary["bezugsobjekt1"], int):
                bezugsobjekt1 = Kleidungstyp()
                bezugsobjekt1.set_id(dictionary["bezugsobjekt1"])
                obj.set_bezugsobjekt1(bezugsobjekt1)
            else:
                print("bezugsobjekt1 ist kein int:", dictionary["bezugsobjekt1"])  # Debugging
                obj.set_bezugsobjekt1(dictionary["bezugsobjekt1"])

        if "bezugsobjekt2" in dictionary:
            if isinstance(dictionary["bezugsobjekt2"], int):
                bezugsobjekt2 = Kleidungstyp()
                bezugsobjekt2.set_id(dictionary["bezugsobjekt2"])
                obj.set_bezugsobjekt2(bezugsobjekt2)
            else:
                print("bezugsobjekt2 ist kein int:", dictionary["bezugsobjekt2"])  # Debugging
                obj.set_bezugsobjekt2(dictionary["bezugsobjekt2"])

        if "style" in dictionary:
            if isinstance(dictionary["style"], int):
                style = Style()
                style.set_id(dictionary["style"])
                obj.set_style(style)
            else:
                print("style ist kein int:", dictionary["style"])  # Debugging
                obj.set_style(dictionary["style"])

        return obj

