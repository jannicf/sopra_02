from abc import ABC, abstractmethod
from src.server.bo import Constraint
from Kleidungstyp import Kleidungstyp


class BinaryConstraint(Constraint, ABC):
    def __init__(self):
        """
        Initialisiert ein binäres Constraint.
        """
        super().__init__()
        self.__bezugsobjekt1 = None   # Objekt der Klasse Kleidungstyp
        self.__bezugsobjekt2 = None   # Objekt der Klasse Kleidungstyp

    def set_bezugsobjekt1(self, bezugsobjekt):
        """Setzen des Bezugsobjekts"""
        self.__bezugsobjekt1 = bezugsobjekt

    def get_bezugsobjekt1(self):
        """Auslesen des Bezugsobjekts"""
        return self.__bezugsobjekt1

    def set_bezugsobjekt2(self, bezugsobjekt):
        """Setzen des Bezugsobjekts"""
        self.__bezugsobjekt2 = bezugsobjekt

    def get_bezugsobjekt2(self):
        """Auslesen des Bezugsobjekts"""
        return self.__bezugsobjekt2

    @abstractmethod
    def check_constraint(self):
        pass