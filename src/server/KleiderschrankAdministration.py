from src.server.bo.Kardinalitaet import Kardinalitaet
from src.server.bo.Implikation import Implikation
from src.server.bo.Mutex import Mutex
from src.server.bo.Person import Person
from src.server.bo.Kleiderschrank import Kleiderschrank
from src.server.bo.Kleidungsstueck import Kleidungsstueck
from src.server.bo.Style import Style
from src.server.bo.Outfit import Outfit
from src.server.bo.Kleidungstyp import Kleidungstyp


from src.server.db.KardinalitaetMapper import KardinalitaetMapper
from src.server.db.ImplikationMapper import ImplikationMapper
from src.server.db.MutexMapper import MutexMapper
from src.server.db.PersonMapper import PersonMapper
from src.server.db.KleiderschrankMapper import KleiderschrankMapper
from src.server.db.KleidungsstueckMapper import KleidungsstueckMapper
from src.server.db.StyleMapper import StyleMapper
from src.server.db.OutfitMapper import OutfitMapper
from src.server.db.KleidungstypMapper import KleidungstypMapper

class KleiderschrankAdministration(object):
    """Diese Klasse aggregiert sämtliche Business Logik der Anwendung.
    Die Administration-Klasse übernimmt in unserer Anwendung die zentrale
    Verantwortung für die Geschäftslogik (Business Logic) und ruft die Mapper
    für die Datenbank auf"""

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

    def get_kardinalitaet_by_id(self, number):
        """Die Kardinalität mit der gegebenen ID auslesen."""
        with KardinalitaetMapper() as mapper:
            return mapper.find_by_id(number)

    def get_all_kardinalitaeten(self):
        """Alle Kardinalitäten auslesen."""
        with KardinalitaetMapper() as mapper:
            return mapper.find_all()

    def save_kardinalitaet(self, kardinalitaet):
        """Die gegebene Kardinalität speichern."""
        with KardinalitaetMapper() as mapper:
            mapper.update(kardinalitaet)

    def delete_kardinalitaet(self, kardinalitaet):
        """Die gegebene Kardinalität aus unserem System löschen."""
        with KardinalitaetMapper() as mapper:
            mapper.delete(kardinalitaet)

    def create_mutex(self, bezugsobjekt1, bezugsobjekt2):
        """Eine Mutex-Beziehung anlegen."""
        mutex = Mutex()
        mutex.set_bezugsobjekt1(bezugsobjekt1)
        mutex.set_bezugsobjekt2(bezugsobjekt2)
        mutex.set_id(1)

        with MutexMapper() as mapper:
            return mapper.insert(mutex)

    def get_mutex_by_id(self, number):
        """Die Mutex-Beziehung mit der gegebenen ID auslesen."""
        with MutexMapper() as mapper:
            return mapper.find_by_id(number)

    def get_all_mutex(self):
        """Alle Mutex-Beziehungen auslesen."""
        with MutexMapper() as mapper:
            return mapper.find_all()

    def save_mutex(self, mutex):
        """Die gegebene Mutex-Beziehung speichern."""
        with MutexMapper() as mapper:
            mapper.update(mutex)

    def delete_mutex(self, mutex):
        """Die gegebene Mutex-Beziehung aus unserem System löschen."""
        with MutexMapper() as mapper:
            mapper.delete(mutex)

    def create_implikation(self, bezugsobjekt1, bezugsobjekt2):
        """Eine Implikations-Beziehung anlegen."""
        implikation = Implikation()
        implikation.set_bezugsobjekt1(bezugsobjekt1)
        implikation.set_bezugsobjekt2(bezugsobjekt2)
        implikation.set_id(1)

        with ImplikationMapper() as mapper:
            return mapper.insert(implikation)

    def get_implikation_by_id(self, number):
        """Die Implikations-Beziehung mit der gegebenen ID auslesen."""
        with ImplikationMapper() as mapper:
            return mapper.find_by_id(number)

    def get_all_implikationen(self):
        """Alle Implikations-Beziehungen auslesen."""
        with ImplikationMapper() as mapper:
            return mapper.find_all()

    def save_implikation(self, implikation):
        """Die gegebene Implikations-Beziehung speichern."""
        with ImplikationMapper() as mapper:
            mapper.update(implikation)

    def delete_implikation(self, implikation):
        """Die gegebene Implikations-Beziehung aus unserem System löschen."""
        with ImplikationMapper() as mapper:
            mapper.delete(implikation)


    """
    Person-spezifische Methoden
    """

    def create_person(self, vorname, nachname, nickname, google_id):
        """Eine neue Person anlegen."""
        person = Person()
        person.set_vorname(vorname)
        person.set_nachname(nachname)
        person.set_nickname(nickname)
        person.set_google_id(google_id)
        person.set_id(1)

        with PersonMapper() as mapper:
            return mapper.insert(person)

    def get_person_by_id(self, number):
        """Die Person mit der gegebenen ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_id(number)

    def get_person_by_google_id(self, id):
        """Die Person mit der gegebenen Google ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_google_id(id)

    def save_person(self, person):
        """Die gegebene Person speichern."""
        with PersonMapper() as mapper:
            mapper.update(person)

    def delete_person(self, person):
        """Die gegebene Person und ihre zugehörigen Ressourcen (z. B. Kleiderschrank) aus unserem System löschen."""
        with PersonMapper() as person_mapper:
            # Prüfen, ob die Person einen Kleiderschrank besitzt
            if person.get_kleiderschrank() is not None:
                kleiderschrank = person.get_kleiderschrank()
                # Kleiderschrank mit allen Inhalten löschen
                with KleiderschrankMapper() as kleiderschrank_mapper:
                    kleiderschrank_mapper.delete(kleiderschrank)

            # Schließlich die Person selbst löschen
            person_mapper.delete(person)


    """
       Kleiderschrank-spezifische Methoden
       """

    def create_kleiderschrank(self, name, eigentuemer):
        """Einen Kleiderschrank anlegen."""
        kleiderschrank = Kleiderschrank()
        kleiderschrank.set_name(name)
        kleiderschrank.set_eigentuemer(eigentuemer)
        kleiderschrank.set_id(1)

        with KleiderschrankMapper() as mapper:
            return mapper.insert(kleiderschrank)

    def get_kleiderschrank_by_id(self, number):
        """Den Kleiderschrank mit der gegebenen ID auslesen."""
        with KleiderschrankMapper() as mapper:
            return mapper.find_by_id(number)

    def get_kleiderschrank_by_eigentuemer(self, eigentuemer):
        """Den Kleiderschrank des übergebenen Eigentümers auslesen."""
        with KleiderschrankMapper() as mapper:
            return mapper.find_by_eigentuemer(eigentuemer)

    def save_kleiderschrank(self, kleiderschrank):
        """Den gegebenen Kleiderschrank speichern."""
        with KleiderschrankMapper() as mapper:
            mapper.update(kleiderschrank)

    def delete_kleiderschrank(self, kleiderschrank):
        """Den gegebenen Kleiderschrank aus unserem System löschen."""
        with KleiderschrankMapper() as mapper:
            mapper.delete(kleiderschrank)


    """
    Style-spezifische Methoden
    """

    def create_style(self, name):
        """Einen Style anlegen"""
        style = Style()
        style.set_name(name)
        style.set_id(1)

        with StyleMapper() as mapper:
            return mapper.insert(style)

    def get_style_by_id(self, number):
        """Den Style mit der gegebenen ID auslesen."""
        with StyleMapper() as mapper:
            return mapper.find_by_id(number)

    def get_all_styles(self):
        """Alle Styles auslesen."""
        with StyleMapper() as mapper:
            return mapper.find_all()

    def save_style(self, style):
        """Den gegebenen Style speichern."""
        with StyleMapper() as mapper:
            mapper.update(style)

    def delete_style(self, style):
        """Den gegebenen Style aus unserem System löschen."""
        with StyleMapper() as mapper:
            mapper.delete(style)


    """
    Outfit-spezifische Methoden
    """

    def create_outfit(self):
        """Ein Outfit anlegen."""
        outfit = Outfit()
        outfit.set_id(1)

        with OutfitMapper() as mapper:
            return mapper.insert(outfit)

    def get_outfit_by_id(self, number):
        """Das Outfit mit der gegebenen ID auslesen."""
        with OutfitMapper() as mapper:
            return mapper.find_by_id(number)

    def get_all_outfits(self):
        """Alle Outfits auslesen."""
        with OutfitMapper() as mapper:
            return mapper.find_all()

    def save_outfit(self, outfit):
        """Das gegebene Outfit speichern."""
        with OutfitMapper() as mapper:
            mapper.update(outfit)

    def delete_outfit(self, outfit):
        """Das gegebene Outfit aus unserem System löschen."""
        with OutfitMapper() as mapper:
            mapper.delete(outfit)


    """
    Kleidungsstueck-spezifische Methoden
    """

    def create_kleidungsstueck(self, name, typ):
        """Ein Kleidungsstück anlegen."""
        kleidungsstueck = Kleidungsstueck()
        kleidungsstueck.set_name(name)
        kleidungsstueck.set_typ(typ)
        kleidungsstueck.set_id(1)

        with KleidungsstueckMapper() as mapper:
            return mapper.insert(kleidungsstueck)

    def get_kleidungsstueck_by_id(self, number):
        """Das Kleidungsstück mit der gegebenen ID auslesen."""
        with KleidungsstueckMapper() as mapper:
            return mapper.find_by_id(number)

    def get_kleidungsstueck_by_name(self, name):
        """Das Kleidungsstück mit dem gegebenen Namen auslesen."""
        with KleidungsstueckMapper() as mapper:
            return mapper.find_by_name(name)

    def get_kleidungsstueck_by_typ(self, typ):
        """Alle Kleidungsstücke eines bestimmten Typs auslesen."""
        with KleidungsstueckMapper() as mapper:
            return mapper.find_by_typ(typ)

    def get_all_kleidungsstuecke(self):
        """Alle Kleidungsstücke auslesen."""
        with KleidungsstueckMapper() as mapper:
            return mapper.find_all()

    def save_kleidungsstueck(self, kleidungsstueck):
        """Das gegebene Kleidungsstück speichern."""
        with KleidungsstueckMapper() as mapper:
            mapper.update(kleidungsstueck)

    def delete_kleidungsstueck(self, kleidungsstueck):
        """Das gegebene Kleidungsstück aus unserem System löschen."""
        with KleidungsstueckMapper() as mapper:
            mapper.delete(kleidungsstueck)


    """
    Kleidungstyp-spezifische Methoden
    """

    def create_kleidungstyp(self, bezeichnung):
        """Einen Kleidungstyp anlegen."""
        kleidungstyp = Kleidungstyp()
        kleidungstyp.set_bezeichnung(bezeichnung)
        kleidungstyp.set_id(1)

        with KleidungstypMapper() as mapper:
            return mapper.insert(kleidungstyp)

    def get_kleidungstyp_by_id(self, number):
        """Den Kleidungstyp mit der gegebenen ID auslesen."""
        with KleidungstypMapper() as mapper:
            return mapper.find_by_id(number)

    def get_kleidungstyp_by_bezeichnung(self, bezeichnung):
        """Den Kleidungstyp mit der gegebenen Bezeichnung auslesen."""
        with KleidungstypMapper() as mapper:
            return mapper.find_by_bezeichnung(bezeichnung)

    def get_all_kleidungstypen(self):
        """Alle Kleidungstypen auslesen."""
        with KleidungstypMapper() as mapper:
            return mapper.find_all()

    def save_kleidungstyp(self, kleidungstyp):
        """Den gegebenen Kleidungstyp speichern."""
        with KleidungstypMapper() as mapper:
            mapper.update(kleidungstyp)

    def delete_kleidungstyp(self, kleidungstyp):
        """Den gegebenen Kleidungstyp aus unserem System löschen."""
        with KleidungstypMapper() as mapper:
            mapper.delete(kleidungstyp)


    """
    Validierung-spezifische Methoden
    """

    def check_outfit_constraints(self, outfit):
        """Prüft, ob ein Outfit die Constraints seines Styles einhält."""
        style = self.get_style_by_id(outfit.get_style_id())
        if not style:
            return False

        # Jede Constraint-Klasse handhabt ihre Prüfung selbst -> Polymorphie
        for constraint in style.get_constraints():
            if not constraint.check_constraint(outfit.get_bausteine()):
                return False

        return True

    def get_possible_outfits_for_style(self, style_id, kleiderschrank_id):
        """Findet mögliche Outfit-Kreationen für einen bestimmten Style."""
            moegliche_outfits = []

            # Hole den Style
            style = self.get_style_by_id(style_id)
            if not style:
                return []

            # Hole die Kleidungsstücke aus dem Kleiderschrank
            kleiderschrank = self.get_kleiderschrank_by_id(kleiderschrank_id)
            kleidungsstuecke = kleiderschrank.get_inhalt()

            # Erstelle Outfits, die dem Style entsprechen
            for kleidungsstueck in kleidungsstuecke:
                outfit = self.create_outfit()
                outfit.add_baustein(kleidungsstueck)

                if self.check_outfit_constraints(outfit):
                    moegliche_outfits.append(outfit)

            return moegliche_outfits

    def get_possible_outfit_completions(self, kleidungsstueck_id, style_id, kleiderschrank_id):
        """Findet Möglichkeiten, ein Outfit ausgehend von einem Kleidungsstück zu vervollständigen."""
        pass


