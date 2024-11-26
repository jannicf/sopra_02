from src.server.bo import BusinessObject as bo
from src.server.bo import Kleidungsstueck

class Outfit(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__bausteine = [] # die Bestandteile eines Outfits bestehend aus Kleidungsstücken

    def add_baustein(self, kleidungsstueck: Kleidungsstueck):
        """Fügt ein Kleidungsstück zum Outfit hinzu"""
        self.__bausteine.append(kleidungsstueck)

    def remove_baustein(self, kleidungsstueck: Kleidungsstueck):
        """Entfernt ein Kleidungsstück aus dem Outfit"""
        if kleidungsstueck in self.__bausteine:
            self.__bausteine.remove(kleidungsstueck)

    def get_bausteine(self):
        """Gibt alle Kleidungsstücke des Outfits zurück"""
        return self.__bausteine

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Outfit: {}".format(self.get_id())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Outfit()."""
        obj = Outfit()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        return obj
