from abc import abstractmethod
from server.bo.Constraint import Constraint


class UnaryConstraint(Constraint):

    def __init__(self):
        """
        Initialisiert ein unäres Constraint.
        """
        super().__init__()
        self.__bezugsobjekt = None   # Objekt der Klasse Kleidungstyp

    def set_bezugsobjekt(self, bezugsobjekt):
        """Setzen des Bezugsobjekts"""
        self.__bezugsobjekt = bezugsobjekt

    def get_bezugsobjekt(self):
        """Auslesen des Bezugsobjekts"""
        return self.__bezugsobjekt

    @abstractmethod
    def check_constraint(self, kleidungsstuecke):
        pass