from abc import abstractmethod
from src.server.bo.BusinessObject import BusinessObject

class Constraint(BusinessObject):

    def __init__(self):
        """
        Initialisiert ein Constraint.

        """
        super().__init__()


    @abstractmethod
    def check_constraint(self):
        """
        Überprüft, ob das Constraint erfüllt ist.

        """
        pass