from server.bo import BusinessObject as bo

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

    def set_eigentuemer(self, eigentuemer):
        """Setzen des Eigentümers"""
        from server.bo.Person import Person  # Lokaler Import
        if isinstance(eigentuemer, Person):
            self.__eigentuemer = eigentuemer

    def get_eigentuemer(self):
        """Auslesen des Eigentümers"""
        return self.__eigentuemer

    def add_kstueck(self, kleidungsstueck):
        """Kleidungsstück in den Kleiderschrank hinzufügen"""
        from server.bo.Kleidungsstueck import Kleidungsstueck  # Lokaler Import
        if isinstance(kleidungsstueck, Kleidungsstueck):
            self.__inhalt.append(kleidungsstueck)

    def delete_kstueck(self, kleidungsstueck):
        """Kleidungsstück aus dem Kleiderschrank entfernen"""
        if kleidungsstueck in self.__inhalt:
            self.__inhalt.remove(kleidungsstueck)

    def __str__(self):
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Kleiderschrank: {}, {}, {}".format(self.get_id(), self.get_name() , self.get_eigentuemer().get_nickname())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen Kleiderschrank()."""
        from server.bo.Person import Person  # Lokaler Import
        from server.bo.Kleidungsstueck import Kleidungsstueck  # Lokaler Import
        obj = Kleiderschrank()
        obj.set_id(dictionary["id"])  # Teil von BusinessObject
        obj.set_name(dictionary["name"])
        # Prüfen ob eigentuemer im Dictionary existiert
        if "eigentuemer" in dictionary and dictionary["eigentuemer"]:
            obj.set_eigentuemer(Person.from_dict(dictionary["eigentuemer"]))
        # Wenn Inhalt im Dictionary vorhanden ist, diesen auch setzen
        if "inhalt" in dictionary and dictionary["inhalt"] is not None:
            for kleidungsstueck in dictionary["inhalt"]:
                obj.add_kstueck(Kleidungsstueck.from_dict(kleidungsstueck))
        return obj
