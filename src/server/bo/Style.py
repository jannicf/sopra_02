from src.server.bo import BusinessObject as bo
from src.server.bo.Constraint import Constraint
from src.server.bo.Implikation import Implikation
from src.server.bo.Kardinalitaet import Kardinalitaet
from src.server.bo.Mutex import Mutex
#Constraints importieren um Objekte der Kindklassen von Constraint speichern zu können
from src.server.bo.Kleidungstyp import Kleidungstyp
#Kleidungstyp importieren um KLeidungstyp-Objekte speichern zu können

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

    def add_feature(self, kleidungstyp: Kleidungstyp):
        """Fügt einen Kleidungstyp zum Style hinzu"""
        self.__features.append(kleidungstyp)
        # auch dem Kleidungstyp den Style hinzufügen,
        # wenn er nicht schon in der Liste ist
        if self not in kleidungstyp.get_verwendungen():
            kleidungstyp.add_verwendung(self)

    def remove_feature(self, kleidungstyp: Kleidungstyp):
        """Entfernt einen Kleidungstyp aus dem Style"""
        if kleidungstyp in self.__features:
            self.__features.remove(kleidungstyp)
            # auch aus der anderen Richtung löschen
            if self in kleidungstyp.get_verwendungen():
                kleidungstyp.delete_verwendung(self)

    def get_features(self):
        """Gibt alle Kleidungstypen zurück"""
        return self.__features

    def add_constraint(self, constraint: Constraint):
        """Fügt einen Constraint zum Style hinzu, sofern er ein Objekt von
           instantiierbaren Constraint-Kindklassen ist"""
        if isinstance(constraint, (Kardinalitaet, Mutex, Implikation)):
            self.__constraints.append(constraint)

    def remove_constraint(self, constraint: Constraint):
        """Entfernt einen Constraint aus dem Style"""
        if constraint in self.__constraints:
            self.__features.remove(constraint)

    def get_constraints(self):
        """Gibt alle Constraints zurück"""
        return self.__constraints

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Style: {}, {}".format(self.get_id(), self.get_name())

    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in einen Style()."""
        obj = Style()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_name(dictionary["name"])
        # Wenn constraints im Dictionary vorhanden sind, diese auch setzen
        if "constraints" in dictionary and dictionary["constraints"] is not None:
            for constraint in dictionary["constraints"]:
                obj.add_constraint(constraint)
        # Wenn features im Dictionary vorhanden sind, diese auch setzen
        if "features" in dictionary and dictionary["features"] is not None:
            for kleidungstyp in dictionary["kleidungstyp"]:
                obj.add_feature(kleidungstyp)
        return obj
