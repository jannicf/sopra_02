from abc import abstractmethod
from src.server.bo.BusinessObject import BusinessObject

class Constraint(BusinessObject):

    def __init__(self):
        """
        Initialisiert ein Constraint.

        """
        super().__init__()
        self._style = None

    def set_style(self, style):
        """Setzen des Styles für den Constraint"""
        self._style = style

    def get_style(self):
        """Auslesen des Styles"""
        return self._style


    @abstractmethod
    def check_constraint(self):
        """
        Überprüft, ob das Constraint erfüllt ist.

        """
        pass