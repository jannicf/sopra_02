from src.server.bo import BusinessObject as bo
from src.server.bo.Style import Style   #Style importieren um Style-Objekte speichern zu können


class Kleidungstyp(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__bezeichnung = ""  #die Bezeichnung des Kleidungstyps
        self.__verwendungen = []  # in welchen Styles der Kleidungsytp verwendet wird

    def set_bezeichnung(self, bezeichnung):
        """Setzen des Namens vom Kleidungstyp"""
        self.__bezeichnung = bezeichnung

    def get_bezeichnung(self):
        """Auslesen des Namens vom Kleidungstyp"""
        return self.__bezeichnung

    def add_verwendung(self, verwendung: Style):
        """Hinzufügen von verwendeten Styles zu bestimmtem Kleidungstyp"""
        self.__verwendungen.append(verwendung)
        # auch dem Style den Kleidungstyp hinzufügen,
        # wenn er nicht schon in der Liste ist
        if self not in verwendung.get_features():
            verwendung.add_feature(self)

    def delete_verwendung(self, verwendung: Style):
        """Löschen von verwendeten Styles zu bestimmtem Kleidungstyp"""
        if verwendung in self.__verwendungen:
            self.__verwendungen.remove(verwendung)
            # auch aus der anderen Richtung löschen
            if self in verwendung.get_features():
                verwendung.remove_feature(self)

    def get_verwendungen(self):
        """Auslesen der Verwendungen des Kleidungstyps"""
        return self.__verwendungen

    def __eq__(self, other):
        """Zwei Kleidungstypen sind gleich, wenn sie die gleiche ID und Bezeichnung haben
        wichtig für Vergleich der Bezugsobjekte bei den Constraints
        -> Python checkt nicht mehr die exakten Speicheradressen bei == , sondern gleiche iD und gleiche Bezeichnung"""

        if isinstance(other, Kleidungstyp):
            return self.get_id() == other.get_id() and self.get_bezeichnung() == other.get_bezeichnung()
        return False

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Kleidungstyp: {}, {}".format(self.get_id(), self.get_bezeichnung())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen Kleidungstyp()."""
        obj = Kleidungstyp()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_bezeichnung(dictionary["bezeichnung"])
        # Wenn verwendungen im Dictionary vorhanden sind, diese auch setzen
        if "verwendungen" in dictionary and dictionary["verwendungen"] is not None:
            for style in dictionary["verwendungen"]:
                obj.add_verwendung(style)
        return obj
