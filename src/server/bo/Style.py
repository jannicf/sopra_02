from server.bo import BusinessObject as bo
from server.bo.Constraint import Constraint


class Style(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__name = ""
        self.__constraints = [] # Liste der Constraints in diesem Style
        self.__features = []  # Liste der Kleidungstypen in diesem Style
        self.__kleiderschrank_id = None

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
            self.__constraints.remove(constraint)

    def get_constraints(self):
        from server.bo.Kardinalitaet import Kardinalitaet
        from server.bo.Mutex import Mutex
        from server.bo.Implikation import Implikation

        """Gibt alle Constraints in einem JSON-kompatiblen Format zurück,
        so wie es das Frontend in 'StyleBO.fromJSON()' erwartet.
        """
        constraints_list = []

        for c in self.__constraints:
            constraint_data = {
                'id': c.get_id(),
                'type': c.__class__.__name__.lower()  # z.B. 'mutex', 'implikation', 'kardinalitaet'
            }

            if isinstance(c, Kardinalitaet):
                constraint_data.update({
                    'min_anzahl': c.get_min_anzahl(),
                    'max_anzahl': c.get_max_anzahl(),
                    # Hier: Bezugsobjekt-ID statt nur Bezeichnung
                    'bezugsobjekt_id': c.get_bezugsobjekt().get_id(),
                })
            elif isinstance(c, Mutex):
                constraint_data.update({
                    'bezugsobjekt1_id': c.get_bezugsobjekt1().get_id(),
                    'bezugsobjekt2_id': c.get_bezugsobjekt2().get_id(),
                })
            elif isinstance(c, Implikation):
                constraint_data.update({
                    'bezugsobjekt1_id': c.get_bezugsobjekt1().get_id(),
                    'bezugsobjekt2_id': c.get_bezugsobjekt2().get_id(),
                })

            constraints_list.append(constraint_data)

        return constraints_list

    def __eq__(self, other):
        """Zwei Styles sind gleich, wenn sie die gleiche ID haben"""
        if isinstance(other, Style):
            return self.get_id() == other.get_id()
        return False

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Style: {}, {}".format(self.get_id(), self.get_name())

    def get_features_as_list(self):
        return self.__features

    def get_constraints_as_list(self):
        from server.bo.Kardinalitaet import Kardinalitaet
        from server.bo.Mutex import Mutex
        from server.bo.Implikation import Implikation

        result = []
        for c in self.__constraints:
            c_dict = {
                'id': c.get_id(),
                'type': c.__class__.__name__.lower()  # "mutex", "implikation", "kardinalitaet"
            }

            if isinstance(c, Kardinalitaet):
                c_dict.update({
                    'min_anzahl': c.get_min_anzahl(),
                    'max_anzahl': c.get_max_anzahl(),
                    'bezugsobjekt': {
                        'id': c.get_bezugsobjekt().get_id(),
                        'bezeichnung': c.get_bezugsobjekt().get_bezeichnung()
                    }
                })
            elif isinstance(c, Mutex):
                c_dict.update({
                    'bezugsobjekt1': {
                        'id': c.get_bezugsobjekt1().get_id(),
                        'bezeichnung': c.get_bezugsobjekt1().get_bezeichnung()
                    },
                    'bezugsobjekt2': {
                        'id': c.get_bezugsobjekt2().get_id(),
                        'bezeichnung': c.get_bezugsobjekt2().get_bezeichnung()
                    }
                })
            elif isinstance(c, Implikation):
                c_dict.update({
                    'bezugsobjekt1': {
                        'id': c.get_bezugsobjekt1().get_id(),
                        'bezeichnung': c.get_bezugsobjekt1().get_bezeichnung()
                    },
                    'bezugsobjekt2': {
                        'id': c.get_bezugsobjekt2().get_id(),
                        'bezeichnung': c.get_bezugsobjekt2().get_bezeichnung()
                    }
                })

            result.append(c_dict)
        return result

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
        if "id" in dictionary:
            obj.set_id(dictionary["id"])
        obj.set_name(dictionary["name"])

        if "features" in dictionary and dictionary["features"]:
            for feature_id in dictionary["features"]:
                kleidungstyp = Kleidungstyp()
                kleidungstyp.set_id(feature_id)
                obj.add_feature(kleidungstyp)

        if "constraints" in dictionary and dictionary["constraints"]:
            for constraint in dictionary["constraints"]:
                if "type" not in constraint:
                    continue

                if constraint["type"] == "kardinalitaet":
                    k = Kardinalitaet()
                    k.set_min_anzahl(constraint["min_anzahl"])
                    k.set_max_anzahl(constraint["max_anzahl"])
                    k.set_bezugsobjekt(Kleidungstyp().set_id(constraint["bezugsobjekt_id"]))
                    obj.add_constraint(k)
                elif constraint["type"] == "mutex":
                    m = Mutex()
                    m.set_bezugsobjekt1(Kleidungstyp().set_id(constraint["bezugsobjekt1_id"]))
                    m.set_bezugsobjekt2(Kleidungstyp().set_id(constraint["bezugsobjekt2_id"]))
                    obj.add_constraint(m)
                elif constraint["type"] == "implikation":
                    i = Implikation()
                    i.set_bezugsobjekt1(Kleidungstyp().set_id(constraint["bezugsobjekt1_id"]))
                    i.set_bezugsobjekt2(Kleidungstyp().set_id(constraint["bezugsobjekt2_id"]))
                    obj.add_constraint(i)

        obj.set_kleiderschrank_id(dictionary["kleiderschrank_id"])

        return obj
