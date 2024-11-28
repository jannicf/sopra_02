from src.server.bo import BusinessObject as bo

class Person(bo.BusinessObject):


    def __init__(self):
        super().__init__()
        self.__vorname = ""  # Der Vorname des Benutzers.
        self.__nachname = ""  # Der Nachname des Benutzers.
        self.__nickname = ""  # Der Nickname des Benutzers.
        self.__google_id = ""  # Die Google ID.
        self.__kleiderschrank = None  # Der Kleiderschrank des Benutzers.


    def get_vorname(self):
        """Auslesen des Vornamens."""
        return self.__vorname

    def set_vorname(self, vorname):
        """Setzen des Vornamens."""
        self.__vorname = vorname

    def get_nachname(self):
        """Auslesen des Nachnamens."""
        return self.__nachname

    def set_nachname(self, nachname):
        """Setzen des Nachnamens."""
        self.__nachname = nachname

    def get_nickname(self):
        """Auslesen des Nicknamens."""
        return self.__nickname

    def set_nickname(self, nickname):
        """Setzen des Nicknamens."""
        self.__nickname = nickname

    def get_google_id(self):
        """Auslesen der Google ID."""
        return self.__google_id

    def set_google_id(self, google_id):
        """Setzen der Google ID."""
        self.__google_id = google_id

    def get_kleiderschrank(self):
        """Auslesen des Kleiderschanks."""
        return self.__kleiderschrank

    def set_kleiderschrank(self, kleiderschrank):
        """Setzen des Kleiderschranks."""
        pass

    def __str__(self):
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Person: {}, {}, {}, {}, {}, {}".format(self.get_id(), self.get_vorname(), self.get_nachname(),
                                                       self.get_nickname(), self.get_google_id(),
                                                       self.get_kleiderschrank().get_name())


    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in eine Person()."""
        obj = Person()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_vorname(dictionary["vorname"])
        obj.set_nachname(dictionary["nachname"])
        obj.set_nickname(dictionary["nickname"])
        obj.set_google_id(dictionary["google_id"])
        obj.set_kleiderschrank(dictionary["kleiderschrank"])
        return obj