from abc import abstractmethod
from server.bo.BusinessObject import BusinessObject

class Constraint(BusinessObject):

    def __init__(self):
        """
        Initialisiert ein Constraint.

        """
        super().__init__()
        self._style = None

    def set_style(self, style):
        self._style = style

    def get_style(self):
        return self._style

    @abstractmethod
    def check_constraint(self, kleidungsstuecke):
        """
        Überprüft, ob das Constraint erfüllt ist.

        """
        pass