from src.server.bo.Person import Person
from src.server.db.PersonMapper import PersonMapper

class WardrobeAdministration(object):
    """Diese Klasse aggregiert sämtliche Business Logik der Anwendung"""

    def __init__(self):
        pass

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
        """Die gegebene Person aus unserem System löschen."""
        with PersonMapper() as mapper:
            if person.get_kleiderschrank() is not None:
                self.delete_kleiderschrank(person.get_kleiderschrank())
            mapper.delete(person)
