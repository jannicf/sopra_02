from src.server.bo import BusinessObject as bo

class Person(bo.BusinessObject):


    def __init__(self):
        super().__init__()
        self.__vorname = ""  # Der Vorname des Benutzers.
        self.__nachname = ""  # Der Nachname des Benutzers.
        self.__nickname = ""  # Der Nickname des Benutzers.
        self.__google_id = ""  # Die Google ID.
        self.__kleiderschrank = list("")  # Der Kleiderschrank des Benutzers.


    def get_vorname(self):
        """Auslesen des Vornamens."""
        return self.__vorname

    def set_vorname(self, value):
        """Setzen des Vornamens."""
        self.__vorname = value

    def get_nachname(self):
        """Auslesen des Nachnamens."""
        return self.__nachname

    def set_nachname(self, value):
        """Setzen des Nachnamens."""
        self.__nachname = value

    def get_nickname(self):
        """Auslesen des Nicknamens."""
        return self.__nickname

    def set_nickname(self, value):
        """Setzen des Nicknamens."""
        self.__nickname = value

    def get_google_id(self):
        """Auslesen der Google ID."""
        return self.__google_id

    def set_google_id(self, value):
        """Setzen der Google ID."""
        self.__google_id = value

    def get_kleiderschrank(self):
        """Auslesen des Kleiderschanks."""
        return self.__kleiderschrank

    def set_kleiderschrank(self, value):
        """Setzen des Kleiderschranks."""
        pass

    def add_kschrank(self, new_ks):
        """Einen neuen Kleiderschrank hinzufügen."""
        pass

    def delete_kschrank(self, old_ks):
        """Einen  Kleiderschrank löschen."""
        pass

    def __str__(self):
        """Erzeugen einer einfachen textuellen Darstellung der jeweiligen Instanz."""
        return "Person: {}, {}, {}, {}, {}".format(self.get_id(), self.__vorname, self.__nachname, self.__nickname, self.__google_id)

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen User()."""
        obj = Person()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_vorname(dictionary["vorname"])
        obj.set_nachname(dictionary["nachname"])
        obj.set_nickname(dictionary["nickname"])
        obj.set_google_id(dictionary["user_id"])
        # Kleiderschrank?
        return obj