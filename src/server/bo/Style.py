from server.bo import BusinessObject as bo
from server.bo.Constraint import Constraint


class Style(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__name = ""
        self.__constraints = {
            'kardinalitaeten': [],
            'mutexe': [],
            'implikationen': []
        } # Liste der Constraints in diesem Style
        self.__features = []  # Liste der Kleidungstypen in diesem Style
        self.__kleiderschrank_id = None

    def set_name(self, name):
        """Setzen des Namens vom Style"""
        self.__name = name

    def get_name(self):
        """Auslesen des Namens vom Style"""
        return self.__name

    def add_feature(self, kleidungstyp):
        from server.bo.Kleidungstyp import Kleidungstyp  # Lokaler Import
        if not isinstance(kleidungstyp, Kleidungstyp):
            return
        self.__features.append(kleidungstyp)

    def remove_feature(self, kleidungstyp):
        """Entfernt einen Kleidungstyp aus dem Style"""
        if kleidungstyp in self.__features:
            self.__features.remove(kleidungstyp)
            # auch aus der anderen Richtung löschen
            if self in kleidungstyp.get_verwendungen():
                kleidungstyp.delete_verwendung(self)

    def get_features(self):
        """Gibt die IDs der Kleidungstypen zurück"""
        return [feature if isinstance(feature, int) else feature.get_id() for feature in self.__features]

    def add_constraint(self, constraint):
        if isinstance(constraint, dict):
            constraint_type = constraint.get('type')
            if constraint_type == 'kardinalitaet':
                self.__constraints['kardinalitaeten'].append({
                    'minAnzahl': constraint.get('minAnzahl'),
                    'maxAnzahl': constraint.get('maxAnzahl'),
                    'bezugsobjekt_id': constraint.get('bezugsobjekt_id')
                })
            elif constraint_type == 'mutex':
                self.__constraints['mutexe'].append({
                    'bezugsobjekt1_id': constraint.get('bezugsobjekt1_id'),
                    'bezugsobjekt2_id': constraint.get('bezugsobjekt2_id')
                })
            elif constraint_type == 'implikation':
                self.__constraints['implikationen'].append({
                    'bezugsobjekt1_id': constraint.get('bezugsobjekt1_id'),
                    'bezugsobjekt2_id': constraint.get('bezugsobjekt2_id')
                })

    def get_constraints(self):
        """Gibt alle Constraints in einem JSON-kompatiblen Format zurück"""
        return self.__constraints

    def set_constraints(self, constraints):
        """Setzt die Constraints."""
        if isinstance(constraints, dict):
            self.__constraints = {
                'kardinalitaeten': constraints.get('kardinalitaeten', []),
                'mutexe': constraints.get('mutexe', []),
                'implikationen': constraints.get('implikationen', [])
            }

    def remove_constraint(self, constraint: Constraint):
        """Entfernt einen Constraint aus dem Style"""
        if constraint in self.__constraints:
            self.__constraints.remove(constraint)

    def __eq__(self, other):
        """Zwei Styles sind gleich, wenn sie die gleiche ID haben"""
        if isinstance(other, Style):
            return self.get_id() == other.get_id()
        return False

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Style: {}, {}".format(self.get_id(), self.get_name())

    def get_features_as_list(self):
        """Gibt die Features in einem serialisierbaren Format zurück"""
        features = []
        for feature in self.__features:
            features.append({
                'id': feature.get_id(),
                'bezeichnung': feature.get_bezeichnung()
            })
        return features

    def set_kleiderschrank_id(self, kleiderschrank_id):
        """Setzen der Kleiderschrank ID"""
        self.__kleiderschrank_id = kleiderschrank_id

    def get_kleiderschrank_id(self):
        """Auslesen der Kleiderschrank ID"""
        return self.__kleiderschrank_id

    @staticmethod
    def from_dict(dictionary=dict()):
        from server.bo.Kleidungstyp import Kleidungstyp
        obj = Style()
        obj.set_id(dictionary.get("id"))
        obj.set_name(dictionary["name"])

        # Features verarbeiten
        if "features" in dictionary:
            for feature_id in dictionary["features"]:
                kleidungstyp = Kleidungstyp()
                kleidungstyp.set_id(feature_id)
                obj.add_feature(kleidungstyp)

        # Constraints direkt setzen, wenn sie im Dictionary sind
        if "constraints" in dictionary:
            obj.set_constraints(dictionary["constraints"])

        obj.set_kleiderschrank_id(dictionary.get("kleiderschrank_id"))
        return obj