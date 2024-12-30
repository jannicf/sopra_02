from abc import abstractmethod
from server.bo.Constraint import Constraint


class BinaryConstraint(Constraint):
    def __init__(self):
        """
        Initialisiert ein binäres Constraint.
        """
        super().__init__()
        self.__bezugsobjekt1 = None   # Objekt der Klasse Kleidungstyp
        self.__bezugsobjekt2 = None   # Objekt der Klasse Kleidungstyp

    def set_bezugsobjekt1(self, bezugsobjekt1):
        """Setzen des Bezugsobjekts"""
        self.__bezugsobjekt1 = bezugsobjekt1

    def get_bezugsobjekt1(self):
        """Gibt das erste Bezugsobjekt zurück."""
        return self.__bezugsobjekt1

    def set_bezugsobjekt2(self, bezugsobjekt2):
        """Setzen des Bezugsobjekts"""
        self.__bezugsobjekt2 = bezugsobjekt2

    def get_bezugsobjekt2(self):
        """Gibt das zweite Bezugsobjekt zurück."""
        return self.__bezugsobjekt2

    @abstractmethod
    def check_constraint(self):
        pass