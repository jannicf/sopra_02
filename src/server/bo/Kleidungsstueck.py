from src.server.bo import BusinessObject as bo
from src.server.bo.Kleidungstyp import Kleidungstyp
#Kleidungstyp importieren um Kleidungstyp-Objekte speichern zu können


class Kleidungsstueck(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__name = ""  # der Name des Kleidungsstücks
        self.__typ = None # von welchem Kleidungstyp dieses Kleidungsstück ist

    def set_name(self, name):
        """Setzen des Namens vom Kleidungsstück"""
        self.__name = name

    def get_name(self):
        """Auslesen des Namens vom Kleidungsstück"""
        return self.__name

    def set_typ(self, typ: Kleidungstyp):
        """Setzen des Kleidungstyps eines Kleidungsstücks"""
        self.__typ = typ

    def get_typ(self):
        """Auslesen des Kleidungstyps eines Kleidungsstücks"""
        return self.__typ

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Kleidungsstück: {}, {}".format(self.get_id(), self.get_typ())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Kleidungsstueck()."""
        obj = Kleidungsstueck()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_name(dictionary["name"])
        obj.set_typ(dictionary["typ"])
        return obj
