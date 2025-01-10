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
        from server.bo.Kardinalitaet import Kardinalitaet
        from server.bo.Mutex import Mutex
        from server.bo.Implikation import Implikation

        # Wenn constraint ein dict ist
        if isinstance(constraint, dict):
            constraint_type = constraint.get('type')
            if constraint_type == 'kardinalitaet':
                self.__constraints['kardinalitaeten'].append(constraint)
            elif constraint_type == 'mutex':
                self.__constraints['mutexe'].append(constraint)
            elif constraint_type == 'implikation':
                self.__constraints['implikationen'].append(constraint)
        # Wenn constraint ein BO-Objekt ist
        else:
            if isinstance(constraint, Kardinalitaet):
                self.__constraints['kardinalitaeten'].append({
                    'type': 'kardinalitaet',
                    'minAnzahl': constraint.get_min_anzahl(),
                    'maxAnzahl': constraint.get_max_anzahl(),
                    'bezugsobjekt_id': constraint.get_bezugsobjekt().get_id()
                })
            elif isinstance(constraint, Mutex):
                self.__constraints['mutexe'].append({
                    'type': 'mutex',
                    'bezugsobjekt1_id': constraint.get_bezugsobjekt1().get_id(),
                    'bezugsobjekt2_id': constraint.get_bezugsobjekt2().get_id()
                })
            elif isinstance(constraint, Implikation):
                self.__constraints['implikationen'].append({
                    'type': 'implikation',
                    'bezugsobjekt1_id': constraint.get_bezugsobjekt1().get_id(),
                    'bezugsobjekt2_id': constraint.get_bezugsobjekt2().get_id()
                })

    def get_constraints(self):
        """Gibt alle Constraints in einem JSON-kompatiblen Format zurück"""
        if not hasattr(self, '__constraints'):
            self.__constraints = {
                'kardinalitaeten': [],
                'mutexe': [],
                'implikationen': []
            }
        return self.__constraints

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
        from server.bo.Kleidungstyp import Kleidungstyp  # Lokaler Import
        from server.bo.Kardinalitaet import Kardinalitaet
        from server.bo.Mutex import Mutex
        from server.bo.Implikation import Implikation

        obj = Style()
        obj.set_id(dictionary.get("id"))
        obj.set_name(dictionary["name"])

        # Features verarbeiten
        if "features" in dictionary:
            for feature_id in dictionary["features"]:
                kleidungstyp = Kleidungstyp()
                kleidungstyp.set_id(feature_id)
                obj.add_feature(kleidungstyp)

        # Constraints verarbeiten
        if "constraints" in dictionary:
            # Kardinalitäten
            for k in dictionary["constraints"].get("kardinalitaeten", []):
                kardinalitaet = Kardinalitaet()
                kardinalitaet.set_min_anzahl(k["min_anzahl"])
                kardinalitaet.set_max_anzahl(k["max_anzahl"])
                bezugsobjekt = Kleidungstyp()
                bezugsobjekt.set_id(k["bezugsobjekt_id"])
                kardinalitaet.set_bezugsobjekt(bezugsobjekt)
                kardinalitaet.set_style(obj)
                obj.add_constraint(kardinalitaet)

            # Mutexe
            for m in dictionary["constraints"].get("mutexe", []):
                mutex = Mutex()
                bezugsobjekt1 = Kleidungstyp()
                bezugsobjekt1.set_id(m["bezugsobjekt1_id"])
                bezugsobjekt2 = Kleidungstyp()
                bezugsobjekt2.set_id(m["bezugsobjekt2_id"])
                mutex.set_bezugsobjekt1(bezugsobjekt1)
                mutex.set_bezugsobjekt2(bezugsobjekt2)
                mutex.set_style(obj)
                obj.add_constraint(mutex)

            # Implikationen
            for i in dictionary["constraints"].get("implikationen", []):
                implikation = Implikation()
                bezugsobjekt1 = Kleidungstyp()
                bezugsobjekt1.set_id(i["bezugsobjekt1_id"])
                bezugsobjekt2 = Kleidungstyp()
                bezugsobjekt2.set_id(i["bezugsobjekt2_id"])
                implikation.set_bezugsobjekt1(bezugsobjekt1)
                implikation.set_bezugsobjekt2(bezugsobjekt2)
                implikation.set_style(obj)
                obj.add_constraint(implikation)

        obj.set_kleiderschrank_id(dictionary["kleiderschrank_id"])

        return obj