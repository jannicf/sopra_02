from server.bo import BusinessObject as bo
from server.bo.Kleidungstyp import Kleidungstyp

class Kleidungsstueck(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__name = ""  # der Name des Kleidungsstücks
        self.__typ = None # von welchem Kleidungstyp dieses Kleidungsstück ist
        self.__kleiderschrank_id = None # ID vom Kleiderschrank

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

    def set_kleiderschrank_id(self, kleiderschrank_id):
        """Setzen der Kleiderschrank ID"""
        self.__kleiderschrank_id = kleiderschrank_id

    def get_kleiderschrank_id(self):
        """Auslesen der Kleiderschrank ID"""
        return self.__kleiderschrank_id

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Kleidungsstück: {}, {}, {}".format(self.get_id(), self.get_name(),
                                                   self.get_typ().get_bezeichnung())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Kleidungsstueck()."""
        obj = Kleidungsstueck()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_name(dictionary["name"])
        obj.set_typ(dictionary["typ"])
        obj.set_kleiderschrank_id(dictionary["kleiderschrank_id"])
        return obj
