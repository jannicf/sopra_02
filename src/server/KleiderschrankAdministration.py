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

    def create_kardinalitaet(self, min_anzahl, max_anzahl, bezugsobjekt, style):
        """Eine Kardinalität anlegen."""
        kardinalitaet = Kardinalitaet()
        kardinalitaet.set_min_anzahl(min_anzahl)
        kardinalitaet.set_max_anzahl(max_anzahl)
        kardinalitaet.set_bezugsobjekt(bezugsobjekt)
        kardinalitaet.set_style(style)
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

    def get_all_kardinalitaeten_by_bezugsobjekt(self, bezugsobjekt):
        """Alle Kardinalitäten mit bestimmtem Bezugsobjekt auslesen"""
        with KardinalitaetMapper() as mapper:
            return mapper.find_all_bezugsobjekt(bezugsobjekt)

    def save_kardinalitaet(self, kardinalitaet):
        """Die gegebene Kardinalität speichern."""
        with KardinalitaetMapper() as mapper:
            mapper.update(kardinalitaet)

    def delete_kardinalitaet(self, kardinalitaet):
        """Die gegebene Kardinalität aus unserem System löschen."""
        with KardinalitaetMapper() as mapper:
            mapper.delete(kardinalitaet)

    def create_mutex(self, bezugsobjekt1, bezugsobjekt2, style):
        """Eine Mutex-Beziehung anlegen."""
        mutex = Mutex()
        mutex.set_bezugsobjekt1(bezugsobjekt1)
        mutex.set_bezugsobjekt2(bezugsobjekt2)
        mutex.set_style(style)
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

    def get_all_mutex_by_bezugsobjekt(self, bezugsobjekt):
        """Alle Mutex mit bestimmtem Bezugsobjekt auslesen"""
        with MutexMapper() as mapper:
            return mapper.find_by_any_bezugsobjekt(bezugsobjekt)

    def save_mutex(self, mutex):
        """Die gegebene Mutex-Beziehung speichern."""
        with MutexMapper() as mapper:
            mapper.update(mutex)

    def delete_mutex(self, mutex):
        """Die gegebene Mutex-Beziehung aus unserem System löschen."""
        with MutexMapper() as mapper:
            mapper.delete(mutex)

    def create_implikation(self, bezugsobjekt1, bezugsobjekt2, style):
        """Eine Implikations-Beziehung anlegen."""
        implikation = Implikation()
        implikation.set_bezugsobjekt1(bezugsobjekt1)
        implikation.set_bezugsobjekt2(bezugsobjekt2)
        implikation.set_style(style)
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

    def get_all_implikationen_by_bezugsobjekt(self, bezugsobjekt):
        """Alle Implikationen mit bestimmtem Bezugsobjekt auslesen"""
        with ImplikationMapper() as mapper:
            return mapper.find_by_any_bezugsobjekt(bezugsobjekt)

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
                # Erst alle Kleidungsstücke aus dem Kleiderschrank löschen
                for kleidungsstueck in kleiderschrank.get_inhalt():
                    self.delete_kleidungsstueck(kleidungsstueck)
                # Dann den Kleiderschrank löschen
                self.delete_kleiderschrank(kleiderschrank)

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

    def get_all_kleiderschraenke(self):
        """Alle Kleiderschränke aus der Datenbank abrufen."""
        with KleiderschrankMapper() as mapper:
            return mapper.find_all()

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
            # Prüfen, ob Style die bestimmten Constraints besitzt und diese dann ggf. auch löschen
            for constraint in style.get_constraints():
                if isinstance(constraint, Kardinalitaet):
                    self.delete_kardinalitaet(constraint)
                elif isinstance(constraint, Mutex):
                    self.delete_mutex(constraint)
                elif isinstance(constraint, Implikation):
                    self.delete_implikation(constraint)
            # Verbindungen zu Kleidungstypen auflösen
            for kleidungstyp in style.get_features():
                kleidungstyp.delete_verwendung(style)
            # Schließlich den Style selbst löschen
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
            outfit.get_bausteine().clear()
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
            # Aus allen Outfits entfernen
            outfits = self.get_all_outfits()
            for outfit in outfits:
                outfit.remove_baustein(kleidungsstueck)
                self.save_outfit(outfit)
            # Aus dem Kleiderschrank entfernen
            if kleidungsstueck.get_kleiderschrank():
                kleidungsstueck.get_kleiderschrank().delete_kstueck(kleidungsstueck)
            # das Kleidungsstück selbst löschen
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
            # Erst alle abhängigen Kleidungsstücke löschen
            kleidungsstuecke = self.get_kleidungsstueck_by_typ(kleidungstyp)
            for kleidungsstueck in kleidungsstuecke:
                self.delete_kleidungsstueck(kleidungsstueck)

            # Alle verknüpften Constraints finden und löschen
            kardinalitaets_constraints = self.get_all_kardinalitaeten_by_bezugsobjekt(kleidungstyp)
            for kardinalitaet in kardinalitaets_constraints:
                self.delete_kardinalitaet(kardinalitaet)

            mutex_constraints = self.get_all_mutex_by_bezugsobjekt(kleidungstyp)
            for mutex in mutex_constraints:
                self.delete_mutex(mutex)

            implikation_constraints = self.get_all_implikationen_by_bezugsobjekt(kleidungstyp)
            for implikation in implikation_constraints:
                self.delete_implikation(implikation)

            # Style-Referenzen entfernen
            for style in kleidungstyp.get_verwendungen():
                style.remove_feature(kleidungstyp)

            # Schließlich den Kleidungstyp selbst löschen
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
        """Gibt alle Kleidungsstücke im Kleiderschrank zurück, die zu einem bestimmten Style gehören."""
        style = self.get_style_by_id(style_id)
        if not style:
            return []

        kleiderschrank = self.get_kleiderschrank_by_id(kleiderschrank_id)
        kleidungsstuecke = kleiderschrank.get_inhalt()

        passende_kleidungsstuecke = []

        for kleidungsstueck in kleidungsstuecke:
            kleidungstyp = kleidungsstueck.get_typ()
            if style in kleidungstyp.get_verwendungen():
                passende_kleidungsstuecke.append(kleidungsstueck)

        return passende_kleidungsstuecke


    def create_outfit_from_selection(self, passende_kleidungsstuecke, style_id):  #Der Parameter passende_kleidungsstuecke kommt aus der Liste mit Kleidungsstücken
        """Erstellt ein Outfit aus ausgewählten Style."""
        outfit = self.create_outfit()
        style = self.get_style_by_id(style_id)
        outfit.set_style(style)

        for kleidungsstueck in passende_kleidungsstuecke:
            kleidungsstueck = self.get_kleidungsstueck_by_id(kleidungsstueck)
            outfit.add_baustein(kleidungsstueck)

        return outfit if self.check_outfit_constraints(outfit) else None

    def get_possible_outfit_completions(self, kleidungsstueck_id, kleiderschrank_id):
        """Findet mögliche Kleidungsstücke, die das Outfit basierend auf einem gegebenen Kleidungsstück vervollständigen."""
        possible_clothing_items = []

        # Hole das Kleidungsstück
        clothing_item = self.get_kleidungsstueck_by_id(kleidungsstueck_id)

        # Hole den Style des Kleidungsstücks
        kleidungstyp = clothing_item.get_typ()
        style_liste = kleidungstyp.get_verwendungen()

        # Hole alle möglichen Kleidungsstücke für den Style aus dem Kleiderschrank
        for style in style_liste:
            kleiderschrank = self.get_kleiderschrank_by_id(kleiderschrank_id)
            for kleidungsstueck in kleiderschrank.get_inhalt():
                if kleidungsstueck.get_typ() in style.get_features():
                    possible_clothing_items.append(kleidungsstueck)

        # Gebe die Liste der passenden Kleidungsstücke zurück
        return possible_clothing_items

    def create_outfit_from_base_item(self, possible_clothing_items):
        """Erstellt ein Outfit aus einer Liste von Kleidungsstücken, die zu einer bestimmten Basis gehört."""
        # Wenn die Liste der Kleidungsstücke leer ist, gebe None zurück
        if not possible_clothing_items:
            return None

        # Erstelle ein neues Outfit
        outfit = self.create_outfit()

        # Füge alle passenden Kleidungsstücke aus der Liste zum Outfit hinzu
        for kleidungsstueck in possible_clothing_items:
            outfit.add_baustein(kleidungsstueck)

        # Überprüfe, ob das Outfit den Constraints entspricht
        return outfit if self.check_outfit_constraints(outfit) else None



