from server.db.Mapper import Mapper
from server.bo.Person import Person

class PersonMapper(Mapper):
    def insert(self, person):
        try:
            cursor = self._cnx.cursor()
            print(f"1. Starte Person-Erstellung für Google ID: {person.get_google_id()}")
            print(f"2. Person-Daten: {person.get_vorname()} {person.get_nachname()}")
            print(f"2a. Kleiderschrank vorhanden? {person.get_kleiderschrank() is not None}")  # Debug-Print
            if person.get_kleiderschrank():
                print(f"2b. Kleiderschrank Name: {person.get_kleiderschrank().get_name()}")  # Debug-Print

            # ID generieren
            cursor.execute("SELECT MAX(id) AS maxid FROM person")
            tuples = cursor.fetchall()

            for (maxid) in tuples:
                if maxid[0] is not None:
                    person.set_id(maxid[0] + 1)
                else:
                    person.set_id(1)

            print(f"3. Generierte Person-ID: {person.get_id()}")

            # Person in DB einfügen
            command = "INSERT INTO person (id, vorname, nachname, nickname, google_id) VALUES (%s,%s,%s,%s,%s)"
            data = (person.get_id(), person.get_vorname(), person.get_nachname(),
                    person.get_nickname(), person.get_google_id())
            cursor.execute(command, data)
            print("4. Person in Datenbank eingefügt")

            # Kleiderschrank erstellen wenn vorhanden
            if person.get_kleiderschrank():
                print("5. Starte Kleiderschrank-Erstellung")
                from src.server.db.KleiderschrankMapper import KleiderschrankMapper

                kleiderschrank = person.get_kleiderschrank()
                kleiderschrank.set_eigentuemer(person)
                print(f"6. Eigentuemer (Person ID: {person.get_id()}) für Kleiderschrank gesetzt")

                with KleiderschrankMapper() as kleiderschrank_mapper:
                    saved_kleiderschrank = kleiderschrank_mapper.insert(kleiderschrank)
                    person.set_kleiderschrank(saved_kleiderschrank)
                    print(f"7. Kleiderschrank (ID: {saved_kleiderschrank.get_id()}) erstellt und Person zugewiesen")

            self._cnx.commit()
            cursor.close()
            print("8. Transaktion erfolgreich abgeschlossen")
            print(
                f"9. Final-Check - Person hat Kleiderschrank? {person.get_kleiderschrank() is not None}")  # Debug-Print
            return person

        except Exception as e:
            print(f"FEHLER bei Person-Erstellung: {str(e)}")
            self._cnx.rollback()
            cursor.close()
            raise e

    def update(self, person):
        """Wiederholtes Schreiben eines Person-Objekts in die Datenbank.

        :param person das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        # Hauptdaten der Person aktualisieren
        command = "UPDATE person SET vorname=%s, nachname=%s, nickname=%s, google_id=%s WHERE id=%s"
        data = (person.get_vorname(), person.get_nachname(), person.get_nickname(),
                person.get_google_id(), person.get_id())
        cursor.execute(command, data)

        # Kleiderschrank-Beziehung aktualisieren
        if person.get_kleiderschrank():
            kleiderschrank_command = "UPDATE kleiderschrank SET eigentuemer_id=%s WHERE id=%s"
            kleiderschrank_data = (person.get_id(), person.get_kleiderschrank().get_id())
            cursor.execute(kleiderschrank_command, kleiderschrank_data)

        self._cnx.commit()
        cursor.close()

    def delete(self, person):
        """Löschen der Daten eines Person-Objekts aus der Datenbank.

                :param person das aus der DB zu löschende "Objekt"
                """
        cursor = self._cnx.cursor()

        command = "DELETE FROM person WHERE id=%s"
        cursor.execute(command, (person.get_id(),))

        self._cnx.commit()
        cursor.close()

    def find_by_id(self, person_id):
        """Suchen einer Person mit vorgegebener Person ID. Da diese eindeutig ist,
                wird genau ein Objekt zurückgegeben.

                :param person_id Primärschlüsselattribut (->DB)
                :return Person-Objekt, das dem übergebenen Schlüssel entspricht, None bei
                    nicht vorhandenem DB-Tupel.
                """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, vorname, nachname, nickname, google_id FROM person WHERE id=%s"
        cursor.execute(command, (person_id,))
        tuples = cursor.fetchall()

        """ Hier wird bewusst auf das Attribut des Kleiderschranks in der Person-Klasse verzichtet, da diese Beziehung
                    schon durch die Kleiderschrank- bzw. die KleiderschrankMapper-Klasse gehandhabt wird"""
        try:
            (id, vorname, nachname, nickname, google_id) = tuples[0]
            person = Person()
            person.set_id(id)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_nickname(nickname)
            person.set_google_id(google_id)
            result = person
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_vorname(self, vorname):
        """Auslesen aller Personen anhand der zugeordneten Vorname.

        :param vorname Vorname der zugehörigen Person.
        :return Eine Sammlung mit Person-Objekten, die sämtliche Personen
            mit dem gewünschten Vornamen enthält.
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, vorname, nachname, nickname, google_id FROM person WHERE vorname=%s"
        cursor.execute(command, (vorname,))
        tuples = cursor.fetchall()


        for (id, vorname, nachname, nickname, google_id) in tuples:
            person = Person()
            person.set_id(id)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_nickname(nickname)
            person.set_google_id(google_id)
            result.append(person)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_nachname(self, nachname):
        """Auslesen aller Personen anhand der zugeordneten Nachname.

        :param nachname Nachname der zugehörigen Person.
        :return Eine Sammlung mit Person-Objekten, die sämtliche Personen
            mit dem gewünschten Nachnamen enthält.
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, vorname, nachname, nickname, google_id FROM person WHERE nachname=%s"
        cursor.execute(command, (nachname,))
        tuples = cursor.fetchall()


        for (id, vorname, nachname, nickname, google_id) in tuples:
            person = Person()
            person.set_id(id)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_nickname(nickname)
            person.set_google_id(google_id)
            result.append(person)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_nickname(self, nickname):
        """Auslesen aller Personen anhand der zugeordneten Nickname.

        :param nickname Nickname der zugehörigen Person.
        :return Eine Sammlung mit Person-Objekten, die sämtliche Personen
            mit dem gewünschten Nickname enthält.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, vorname, nachname, nickname, google_id FROM person WHERE nickname=%s"
        cursor.execute(command, (nickname,))
        tuples = cursor.fetchall()

        try:
            (id, vorname, nachname, nickname, google_id) = tuples[0]
            person = Person()
            person.set_id(id)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_nickname(nickname)
            person.set_google_id(google_id)
            result = person
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_google_id(self, google_id):
        """Auslesen einer Person anhand der Google ID."""
        print(f"PersonMapper: Suche Person mit Google ID {google_id}")
        result = None

        cursor = self._cnx.cursor()
        # Zuerst die Person-Daten laden
        command = "SELECT id, vorname, nachname, nickname, google_id FROM person WHERE google_id=%s"
        cursor.execute(command, (google_id,))
        tuples = cursor.fetchall()

        try:
            (id, vorname, nachname, nickname, google_id) = tuples[0]
            person = Person()
            person.set_id(id)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_nickname(nickname)
            person.set_google_id(google_id)

            print(f"PersonMapper: Person mit ID {id} gefunden")

            # Dann den zugehörigen Kleiderschrank suchen
            command = "SELECT id, name FROM kleiderschrank WHERE eigentuemer_id=%s"
            cursor.execute(command, (id,))
            kleiderschrank_tuples = cursor.fetchall()

            # Im PersonMapper, find_by_google_id Methode:
            if kleiderschrank_tuples:
                from server.db.KleiderschrankMapper import KleiderschrankMapper
                # Verwende den KleiderschrankMapper um den vollständigen Kleiderschrank zu laden
                with KleiderschrankMapper() as kleiderschrank_mapper:
                    kleiderschrank = kleiderschrank_mapper.find_by_id(kleiderschrank_tuples[0][0])
                    if kleiderschrank:
                        person.set_kleiderschrank(kleiderschrank)
                        kleiderschrank.set_eigentuemer(person)  # Wichtig: Beidseitige Beziehung setzen
                        print(f"PersonMapper: Kleiderschrank {kleiderschrank.get_name()} gefunden und zugewiesen")
                    else:
                        print("PersonMapper: Kleiderschrank konnte nicht vollständig geladen werden")
            else:
                print("PersonMapper: Kein Kleiderschrank für diese Person gefunden")

            result = person

        except IndexError:
            print("PersonMapper: Keine Person gefunden")
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Personen unseres Systems.

                :return Eine Sammlung mit Person-Objekten, die sämtliche Personen
                        des Systems repräsentieren.
                """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from person")
        tuples = cursor.fetchall()

        for (id, vorname, nachname, nickname, google_id) in tuples:
            person = Person()
            person.set_id(id)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_nickname(nickname)
            person.set_google_id(google_id)
            result.append(person)

        self._cnx.commit()
        cursor.close()

        return result