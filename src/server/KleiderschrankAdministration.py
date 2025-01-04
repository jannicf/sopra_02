from .bo.Kardinalitaet import Kardinalitaet
from .bo.Implikation import Implikation
from .bo.Mutex import Mutex
from .bo.Person import Person
from .bo.Kleiderschrank import Kleiderschrank
from .bo.Kleidungsstueck import Kleidungsstueck
from .bo.Style import Style
from .bo.Outfit import Outfit
from .bo.Kleidungstyp import Kleidungstyp

from .db.KardinalitaetMapper import KardinalitaetMapper
from .db.ImplikationMapper import ImplikationMapper
from .db.MutexMapper import MutexMapper
from .db.PersonMapper import PersonMapper
from .db.KleiderschrankMapper import KleiderschrankMapper
from .db.KleidungsstueckMapper import KleidungsstueckMapper
from .db.StyleMapper import StyleMapper
from .db.OutfitMapper import OutfitMapper
from .db.KleidungstypMapper import KleidungstypMapper

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

        style.add_constraint(kardinalitaet)

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

    def get_all_kardinalitaeten_by_style(self, style):
        """Alle Kardinalitäten eines bestimmten Styles auslesen"""
        with KardinalitaetMapper() as mapper:
            return mapper.find_all_style(style)

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

        style.add_constraint(mutex)

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

    def get_all_mutex_by_style(self, style):
        """Alle Mutex-Constraints eines bestimmten Styles auslesen"""
        with MutexMapper() as mapper:
            return mapper.find_all_style(style)

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

        style.add_constraint(implikation)

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

    def get_all_implikationen_by_style(self, style):
        """Alle Implikationen eines bestimmten Styles auslesen"""
        with ImplikationMapper() as mapper:
            return mapper.find_all_style(style)

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
        try:
            print(f"create_person aufgerufen mit:")
            print(f"Vorname: {vorname}")
            print(f"Nachname: {nachname}")
            print(f"Nickname: {nickname}")
            print(f"Google ID: {google_id}")

            person = Person()
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_nickname(nickname)
            person.set_google_id(google_id)

            print("Person-Objekt vor dem Speichern:")
            print(f"ID: {person.get_id()}")
            print(f"Vorname: {person.get_vorname()}")
            print(f"Nachname: {person.get_nachname()}")
            print(f"Nickname: {person.get_nickname()}")
            print(f"Google ID: {person.get_google_id()}")

            with PersonMapper() as mapper:
                result = mapper.insert(person)
                print("Person erfolgreich erstellt mit ID:", result.get_id())
                return result

        except Exception as e:
            print(f"ERROR in create_person: {str(e)}")
            raise e

    def get_person_by_id(self, number):
        """Die Person mit der gegebenen ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_id(number)

    def get_person_by_vorname(self, vorname):
        """Die Person mit dem gegebenen Vornamen auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_vorname(vorname)

    def get_person_by_nachname(self, nachname):
        """Die Person mit dem gegebenen Nachnamen auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_nachname(nachname)

    def get_person_by_nickname(self, nickname):
        """Die Person mit dem gegebenen Nickname auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_nickname(nickname)

    def get_person_by_google_id(self, id):
        """Die Person mit der gegebenen Google ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_google_id(id)

    def get_all_personen(self):
        """Alle Personen aus der Datenbank abrufen."""
        with PersonMapper() as mapper:
            return mapper.find_all()

    def save_person(self, person):
        """Die gegebene Person speichern."""
        with PersonMapper() as mapper:
            mapper.update(person)

    def delete_person(self, person):
        """Die gegebene Person und ihre zugehörigen Ressourcen (z. B. Kleiderschrank) aus unserem System löschen."""
        with KleiderschrankMapper() as kleiderschrank_mapper:
            # Kleiderschrank des Eigentümers löschen
            kleiderschrank = kleiderschrank_mapper.find_by_eigentuemer(person)
            if kleiderschrank is not None:
                kleiderschrank_mapper.delete(kleiderschrank)

        # Danach die Person löschen
        with PersonMapper() as person_mapper:
            person_mapper.delete(person)

    """
       Kleiderschrank-spezifische Methoden
       """

    def create_kleiderschrank(self, name, eigentuemer):
        """Einen Kleiderschrank anlegen."""
        try:
            print(f"create_kleiderschrank aufgerufen mit:")
            print(f"Name: {name}")
            print(f"Eigentuemer ID: {eigentuemer.get_id()}")

            kleiderschrank = Kleiderschrank()
            kleiderschrank.set_name(name)
            kleiderschrank.set_eigentuemer(eigentuemer)

            with KleiderschrankMapper() as mapper:
                result = mapper.insert(kleiderschrank)
                print(f"Kleiderschrank erstellt mit ID: {result.get_id()}")

                # Person mit Kleiderschrank aktualisieren
                eigentuemer.set_kleiderschrank(result)
                with PersonMapper() as person_mapper:
                    person_mapper.update(eigentuemer)
                    print(f"Person {eigentuemer.get_id()} mit Kleiderschrank {result.get_id()} aktualisiert")

                return result

        except Exception as e:
            print(f"ERROR in create_kleiderschrank: {str(e)}")
            raise e

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

    def get_style_by_name(self, name):
        """Den Style mit dem gegebenen Namen auslesen."""
        with StyleMapper() as mapper:
            return mapper.find_by_name(name)

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

    def create_outfit(self, style_id):
        """Ein Outfit anlegen."""
        outfit = Outfit()
        style = self.get_style_by_id(style_id)
        outfit.set_id(1)
        outfit.set_style(style)

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
        # Überprüfen, ob ein vollständiges Outfit-Objekt oder nur eine ID übergeben wurde
        if isinstance(outfit, int):  # Wenn nur die ID übergeben wurde
            outfit = self.get_outfit_by_id(outfit)  # Outfit anhand der ID laden

        if outfit is None:
            raise ValueError("Das zu löschende Outfit existiert nicht.")

        with OutfitMapper() as mapper:
            # Sicherstellen, dass die Bausteine geleert werden
            outfit.get_bausteine().clear()
            # Outfit über den Mapper löschen
            mapper.delete(outfit)

    """
    Kleidungsstueck-spezifische Methoden
    """

    def create_kleidungsstueck(self, name, typ, kleiderschrank_id):
        """Ein Kleidungsstück anlegen."""
        kleidungsstueck = Kleidungsstueck()
        kleidungsstueck.set_name(name)

        # Wenn typ nur eine ID ist, laden wir den vollständigen Typ
        if isinstance(typ, int):
            typ = self.get_kleidungstyp_by_id(typ)

        kleidungsstueck.set_typ(typ)
        kleidungsstueck.set_kleiderschrank_id(kleiderschrank_id)
        kleidungsstueck.set_id(1)

        # Erst das Kleidungsstück in die Datenbank einfügen
        with KleidungsstueckMapper() as mapper:
            result = mapper.insert(kleidungsstueck)

        # Wenn das Einfügen erfolgreich war, dem Kleiderschrank hinzufügen
        if result:
            kleiderschrank = self.get_kleiderschrank_by_id(kleiderschrank_id)
            if kleiderschrank:
                kleiderschrank.add_kstueck(result)
                with KleiderschrankMapper() as mapper:
                    mapper.update(kleiderschrank)

        return result

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

    def get_kleidungsstueck_by_kleiderschrank_id(self, kleiderschrank_id):
        """Alle Kleidungsstücke eines bestimmten Kleiderschranks auslesen."""
        with KleidungsstueckMapper() as mapper:
            return mapper.find_by_kleiderschrank_id(kleiderschrank_id)

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

            # Kleidungsstück direkt löschen ohne vorher die kleiderschrank_id zu ändern
            mapper.delete(kleidungsstueck)


    """
    Kleidungstyp-spezifische Methoden
    """

    def create_kleidungstyp(self, bezeichnung, verwendungen=None):
        """Einen Kleidungstyp anlegen."""
        kleidungstyp = Kleidungstyp()
        kleidungstyp.set_bezeichnung(bezeichnung)
        kleidungstyp.set_id(1)

        # Wenn Verwendungen übergeben wurden, diese hinzufügen
        if verwendungen:
            for verwendung_id in verwendungen:
                style = self.get_style_by_id(verwendung_id)
                if style:
                    kleidungstyp.add_verwendung(style)

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
        style = outfit.get_style()
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
        erlaubte_typen = style.get_features()

        for kleidungsstueck in kleidungsstuecke:
            if kleidungsstueck.get_typ() in erlaubte_typen:
                passende_kleidungsstuecke.append(kleidungsstueck)

        return passende_kleidungsstuecke

    def create_outfit_from_selection(self, kleidungsstuecke, style_id):
        """Erstellt ein Outfit aus einer Liste von Kleidungsstücken."""
        try:
            # Style laden
            style = self.get_style_by_id(style_id)
            if not style:
                return None

            # Prüfen ob die Auswahl den Style-Constraints entspricht
            for constraint in style.get_constraints():
                if not constraint.check_constraint(kleidungsstuecke):
                    return None

            # Neues Outfit erstellen
            outfit = self.create_outfit(style_id)

            # Kleidungsstücke hinzufügen
            for kleidungsstueck in kleidungsstuecke:
                outfit.add_baustein(kleidungsstueck)

            # Outfit speichern
            self.save_outfit(outfit)

            return outfit
        except Exception as e:
            print(f"Fehler beim Erstellen des Outfits: {str(e)}")
            return None

    def get_possible_outfit_completions(self, kleidungsstueck_id, style_id):
        basis_kleidungsstueck = self.get_kleidungsstueck_by_id(kleidungsstueck_id)
        style = self.get_style_by_id(style_id)

        if not basis_kleidungsstueck or not style:
            return []

        # Hole alle Kleidungsstücke aus dem gleichen Kleiderschrank
        alle_kleidungsstuecke = self.get_kleidungsstueck_by_kleiderschrank_id(
            basis_kleidungsstueck.get_kleiderschrank_id()
        )

        passende_kleidungsstuecke = []

        for kleidungsstueck in alle_kleidungsstuecke:
            # Überspringe das Basis-Kleidungsstück
            if kleidungsstueck.get_id() == kleidungsstueck_id:
                continue

            # Hole den vollständigen Typ mit allen Styles
            typ = self.get_kleidungstyp_by_id(kleidungsstueck.get_typ().get_id())
            kleidungsstueck.set_typ(typ)

            # Wenn der Style in den Verwendungen des Typs ist
            if any(verwendung.get_id() == style.get_id() for verwendung in typ.get_verwendungen()):
                passende_kleidungsstuecke.append(kleidungsstueck)

        return passende_kleidungsstuecke

    def create_outfit_from_base_item(self, basis_kleidungsstueck_id, ausgewaehlte_kleidungsstuecke, style_id):
        """Erstellt ein Outfit aus einer Liste von Kleidungsstücken, die zu einer bestimmten Basis gehört."""

        style = self.get_style_by_id(style_id)
        basis_kleidungsstueck = self.get_kleidungsstueck_by_id(basis_kleidungsstueck_id)
        if not basis_kleidungsstueck:
            return None

        # Komplette Auswahl zusammenstellen
        alle_kleidungsstuecke = [basis_kleidungsstueck] + ausgewaehlte_kleidungsstuecke

        # ZUERST prüfen, ob die Gesamtauswahl alle Constraints erfüllt
        for constraint in style.get_constraints():
            if not constraint.check_constraint(alle_kleidungsstuecke):
                return None  # Bei Constraint-Verletzung KEIN Outfit erstellen

        outfit = self.create_outfit(style_id)
        outfit.add_baustein(basis_kleidungsstueck)


        # Füge NUR die vom Nutzer ausgewählten Kleidungsstücke hinzu
        for kleidungsstueck in ausgewaehlte_kleidungsstuecke:
            if kleidungsstueck.get_typ() in style.get_features():
                outfit.add_baustein(kleidungsstueck)

        if self.check_outfit_constraints(outfit):
            return outfit
        else:
            return None





