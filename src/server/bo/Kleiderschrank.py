from server.bo import BusinessObject as bo

class Kleiderschrank(bo.BusinessObject):
    def __init__(self):
        super().__init__()
        self.__eigentuemer = None   # Der Eigentümer des Kleiderschranks
        self.__inhalt = list("")   # Der Inhalt des Kleiderschranks
        self.__name = ""           # Der Name des Kleiderschranks

    def set_name(self, new_name):
        """Setzen des Namens vom Kleiderschrank"""
        self.__name = new_name

    def get_name(self):
        """Auslesen des Namens vom Kleiderschrank"""
        return self.__name

    def set_inhalt(self, new_inhalt):
        """Setzen des Kleiderschrankinhalts"""
        self.__inhalt = list(new_inhalt)

    def get_inhalt(self):
        """Auslesen des Kleiderschrankinhalts"""
        return self.__inhalt

    def set_eigentuemer(self, new_eigentuemer):
        """Setzen des Eigentümers"""
        self.__eigentuemer = new_eigentuemer

    def get_eigentuemer(self):
        """Auslesen des Eigentümers"""
        return self.__eigentuemer

    def add_kstueck(self, new_ks):
        """Kleidungsstück in den Kleiderschrank hinzufügen"""
        pass

    def delete_kstueck(self, old_ks):
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
        obj.set_inhalt(dictionary["inhalt"])
        obj.set_eigentuemer(dictionary["eigentuemer"])
        return obj
