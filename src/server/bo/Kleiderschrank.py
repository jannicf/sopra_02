from src.server.bo import BusinessObject as bo
from src.server.bo.Person import Person
from src.server.bo.Kleidungsstueck import Kleidungsstueck
# Person und Kleidungsstueck importieren um diese Objekte speichern zu können

class Kleiderschrank(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__eigentuemer = None   # Der Eigentümer des Kleiderschranks (Person-Instanz)
        self.__inhalt = []   # Der Inhalt des Kleiderschranks (Kleidungsstück-Instanzen)
        self.__name = ""           # Der Name des Kleiderschranks

    def set_name(self, name):
        """Setzen des Namens vom Kleiderschrank"""
        self.__name = name

    def get_name(self):
        """Auslesen des Namens vom Kleiderschrank"""
        return self.__name

    def get_inhalt(self):
        """Auslesen des Kleiderschrankinhalts"""
        return self.__inhalt

    def set_eigentuemer(self, eigentuemer: Person):
        """Setzen des Eigentümers"""
        self.__eigentuemer = eigentuemer

    def get_eigentuemer(self):
        """Auslesen des Eigentümers"""
        return self.__eigentuemer

    def add_kstueck(self, kleidungsstueck: Kleidungsstueck):
        """Kleidungsstück in den Kleiderschrank hinzufügen"""
        pass

    def delete_kstueck(self, kleidungsstueck: Kleidungsstueck):
        """Kleidungsstück aus dem Kleiderschrank entfernen"""
        pass

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "User: {}, {}, {}, {}".format(self.get_id(), self.__eigentuemer, self.__inhalt, self.__name)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in eine Transaction()."""
        obj = Kleiderschrank()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_name(dictionary["name"])
        obj.set_eigentuemer(dictionary["eigentuemer"])
        return obj
