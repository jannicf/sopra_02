from src.server.bo.Kardinalitaet import Kardinalitaet
from src.server.bo.Implikation import Implikation
from src.server.bo.Mutex import Mutex

from src.server.db.KardinalitaetMapper import KardinalitaetMapper
from src.server.db.ImplikationMapper import ImplikationMapper
from src.server.db.MutexMapper import MutexMapper

class WardrobeAdministration(object):
    """Diese Klasse aggregiert sämtliche Business Logik der Anwendung"""

    def __init__(self):
        pass

    """
       Constraint-spezifische Methoden
       """

    def create_kardinalitaet(self, min_anzahl, max_anzahl, bezugsobjekt):
        """Eine Kardinalität anlegen."""
        kardinalitaet = Kardinalitaet()
        kardinalitaet.set_min_anzahl(min_anzahl)
        kardinalitaet.set_max_anzahl(max_anzahl)
        kardinalitaet.set_bezugsobjekt(bezugsobjekt)
        kardinalitaet.set_id(1)

        with KardinalitaetMapper() as mapper:
            return mapper.insert(kardinalitaet)

    def create_mutex(self, bezugsobjekt1, bezugsobjekt2):
        """Eine Mutex-Beziehung anlegen."""
        mutex = Mutex()
        mutex.set_bezugsobjekt1(bezugsobjekt1)
        mutex.set_bezugsobjekt2(bezugsobjekt2)
        mutex.set_id(1)

        with MutexMapper() as mapper:
            return mapper.insert(mutex)

    def create_implikation(self, bezugsobjekt1, bezugsobjekt2):
        """Eine Implikations-Beziehung anlegen."""
        implikation = Implikation()
        implikation.set_bezugsobjekt1(bezugsobjekt1)
        implikation.set_bezugsobjekt2(bezugsobjekt2)
        implikation.set_id(1)

        with ImplikationMapper() as mapper:
            return mapper.insert(implikation)
