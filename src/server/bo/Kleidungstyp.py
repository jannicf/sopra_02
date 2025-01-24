from server.bo import BusinessObject as bo
from server.bo.Style import Style   #Style importieren um Style-Objekte speichern zu können

class Kleidungstyp(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self.__bezeichnung = ""  #die Bezeichnung des Kleidungstyps
        self.__verwendungen = []  # in welchen Styles der Kleidungsytp verwendet wird
        self.__kleiderschrank_id = None  # ID vom Kleiderschrank

    def set_bezeichnung(self, bezeichnung):
        """Setzen des Namens vom Kleidungstyp"""
        self.__bezeichnung = bezeichnung

    def get_bezeichnung(self):
        """Auslesen des Namens vom Kleidungstyp"""
        return self.__bezeichnung

    def set_kleiderschrank_id(self, kleiderschrank_id):
        """Setzen der Kleiderschrank ID"""
        self.__kleiderschrank_id = kleiderschrank_id

    def get_kleiderschrank_id(self):
        """Auslesen der Kleiderschrank ID"""
        return self.__kleiderschrank_id

    def add_verwendung(self, verwendung: Style):
        """Hinzufügen von verwendeten Styles zu bestimmtem Kleidungstyp"""
        self.__verwendungen.append(verwendung)
        # auch dem Style den Kleidungstyp hinzufügen,
        # wenn er nicht schon in der Liste ist
        if self not in verwendung.get_features():
            verwendung.add_feature(self)

    def delete_verwendung(self, verwendung: Style):
        """Löschen von verwendeten Styles zu bestimmtem Kleidungstyp"""
        if verwendung in self.__verwendungen:
            self.__verwendungen.remove(verwendung)
            # auch aus der anderen Richtung löschen
            if self in verwendung.get_features():
                verwendung.remove_feature(self)

    def get_verwendungen(self):
        """Auslesen der Verwendungen des Kleidungstyps"""
        if self.__verwendungen is None:
            self.__verwendungen = []
        return self.__verwendungen

    def __eq__(self, other):
        """Zwei Kleidungstypen sind gleich, wenn sie die gleiche ID haben
        wichtig für Vergleich der Bezugsobjekte bei den Constraints
        -> Python checkt nicht mehr die exakten Speicheradressen bei == , sondern gleiche iD und gleiche Bezeichnung"""

        if isinstance(other, Kleidungstyp):
            return self.get_id() == other.get_id()
        return False

    def __str__(self) -> str:
        """Umwandlung des Objekts in eine lesbare String-Ausgabe"""
        return "Kleidungstyp: {}, {}".format(self.get_id(), self.get_bezeichnung())

    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Kleidungstyp()
        obj.set_id(dictionary.get('id', 0))  # Default 0 wenn keine ID
        obj.set_bezeichnung(dictionary.get('bezeichnung'))
        obj.set_kleiderschrank_id(dictionary.get('kleiderschrank_id'))

        # Verwendungen verarbeiten
        verwendungen = dictionary.get('verwendungen', [])
        if isinstance(verwendungen, list):
            for v in verwendungen:
                if isinstance(v, dict) and 'id' in v:
                    obj.add_verwendung(v['id'])
                elif isinstance(v, int):
                    obj.add_verwendung(v)

        return obj
