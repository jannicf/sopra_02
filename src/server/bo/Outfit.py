from server.bo import BusinessObject as bo
from server.bo.Kleidungsstueck import Kleidungsstueck

class Outfit(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__bausteine = [] # die Bestandteile eines Outfits bestehend aus Kleidungsstücken
        self.__style = None # jedes Outfit hat einen bestimmten Style

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

    def get_baustein_ids(self):
        """Gibt alle IDs der Kleidungsstücke des Outfits zurück"""
        return [baustein.get_id() for baustein in self.__bausteine]

    def set_style(self, style):
        """Setzen des Outfit-Styles"""
        self.__style = style

    def get_style(self):
        """Auslesen des Outfit-Styles"""
        return self.__style

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Outfit: {}, {}".format(self.get_id(), self.get_style().get_name())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Outfit()."""
        obj = Outfit()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_style(dictionary["style"])
        # Wenn bausteine im Dictionary vorhanden sind, diese auch setzen
        if "bausteine" in dictionary and dictionary["bausteine"] is not None:
            for kleidungsstueck in dictionary["bausteine"]:
                obj.add_baustein(kleidungsstueck)
        return obj
