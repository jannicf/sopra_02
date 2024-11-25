from abc import ABC, abstractmethod
from src.server.bo import BusinessObject

class Constraint(BusinessObject, ABC):

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