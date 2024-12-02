from src.server.bo import BusinessObject as bo
from src.server.bo.Style import Style   #Style importieren um Style-Objekte speichern zu können


class Kleidungstyp(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__bezeichnung = ""  #die Bezeichnung des Kleidungstyps
        self.__verwendung = None  # Der Style, in dem der Kleidungstyp verwendet wird

    def set_bezeichnung(self, bezeichnung):
        """Setzen des Namens vom Kleidungstyp"""
        self.__bezeichnung = bezeichnung

    def get_bezeichnung(self):
        """Auslesen des Namens vom Kleidungstyp"""
        return self.__bezeichnung

    def set_verwendung(self, verwendung: Style):
        """Setzen des verwendeten Styles für den Kleidungstyp"""
        self.__verwendung = verwendung
        # Falls der Style den Kleidungstyp noch nicht kennt, hinzufügen
        if self not in verwendung.get_features():
            verwendung.add_feature(self)

    def get_verwendung(self):
        """Auslesen der Verwendung des Kleidungstyps"""
        return self.__verwendung

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Kleidungstyp: {}, {}".format(self.get_id(), self.get_bezeichnung())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen Kleidungstyp()."""
        obj = Kleidungstyp()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_bezeichnung(dictionary["bezeichnung"])
        # Wenn verwendung im Dictionary vorhanden ist, diese auch setzen
        if "verwendung" in dictionary and dictionary["verwendung"] is not None:
            style = Style.from_dict(dictionary["verwendung"])
            obj.set_verwendung(style)
        return obj
