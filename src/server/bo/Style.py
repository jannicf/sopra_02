from server.bo import BusinessObject as bo
from server.bo.Constraint import Constraint


class Style(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__name = ""
        self.__constraints = [] # Liste der Constraints in diesem Style
        self.__features = []  # Liste der Kleidungstypen in diesem Style

    def set_name(self, name):
        """Setzen des Namens vom Style"""
        self.__name = name

    def get_name(self):
        """Auslesen des Namens vom Style"""
        return self.__name

    def add_feature(self, kleidungstyp):
        """Fügt einen Kleidungstyp zum Style hinzu"""
        from server.bo.Kleidungstyp import Kleidungstyp  # Lokaler Import
        self.__features.append(kleidungstyp)
        # auch dem Kleidungstyp den Style hinzufügen,
        # wenn er nicht schon in der Liste ist
        if self not in kleidungstyp.get_verwendungen():
            kleidungstyp.add_verwendung(self)

    def remove_feature(self, kleidungstyp):
        """Entfernt einen Kleidungstyp aus dem Style"""
        from server.bo.Kleidungstyp import Kleidungstyp  # Lokaler Import
        if kleidungstyp in self.__features:
            self.__features.remove(kleidungstyp)
            # auch aus der anderen Richtung löschen
            if self in kleidungstyp.get_verwendungen():
                kleidungstyp.delete_verwendung(self)

    def get_features(self):
        """Gibt alle Kleidungstypen zurück"""
        return self.__features

    def add_constraint(self, constraint):
        """Fügt einen Constraint zum Style hinzu, sofern er ein Objekt von
           instantiierbaren Constraint-Kindklassen ist"""
        from server.bo.Kardinalitaet import Kardinalitaet
        from server.bo.Mutex import Mutex
        from server.bo.Implikation import Implikation
        if isinstance(constraint, (Kardinalitaet, Mutex, Implikation)):
            if constraint not in self.__constraints:
                self.__constraints.append(constraint)

    def remove_constraint(self, constraint: Constraint):
        """Entfernt einen Constraint aus dem Style"""
        if constraint in self.__constraints:
            self.__features.remove(constraint)

    def get_constraints(self):
        """Gibt alle Constraints zurück"""
        return self.__constraints

    def __eq__(self, other):
        """Zwei Styles sind gleich, wenn sie die gleiche ID haben"""
        if isinstance(other, Style):
            return self.get_id() == other.get_id()
        return False

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Style: {}, {}".format(self.get_id(), self.get_name())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen Style()."""
        from server.bo.Kleidungstyp import Kleidungstyp  # Lokaler Import
        from server.bo.Kardinalitaet import Kardinalitaet
        from server.bo.Mutex import Mutex
        from server.bo.Implikation import Implikation

        obj = Style()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject!
        obj.set_name(dictionary["name"])
        # Wenn constraints im Dictionary vorhanden sind, diese auch setzen
        if "constraints" in dictionary and dictionary["constraints"] is not None:
            for constraint in dictionary["constraints"]:
                obj.add_constraint(constraint)
        # Wenn features im Dictionary vorhanden sind, diese auch setzen
        if "features" in dictionary and dictionary["features"] is not None:
            for kleidungstyp in dictionary["features"]:
                obj.add_feature(kleidungstyp)
        return obj
