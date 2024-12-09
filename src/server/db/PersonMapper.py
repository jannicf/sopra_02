from src.server.db.Mapper import Mapper
from src.server.bo.Person import Person

class PersonMapper(Mapper):
    def insert(self, person):
        """Einfügen eines Person-Objekts in die Datenbank.

                Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
                berichtigt.

                :param person das zu speichernde Objekt
                :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
                """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM person ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Person-Objekt zu."""
                person.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                person.set_id(1)

        command = "INSERT INTO person (id, vorname, nachname, nickname, google_id) VALUES (%s,%s,%s,%s,%s)"
        data = (person.get_id(), person.get_vorname(), person.get_nachname(), person.get_nickname(),
                person.get_google_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return person

    def update(self, person):
        """Wiederholtes Schreiben eines Person-Objekts in die Datenbank.

                :param person das Objekt, das in die DB geschrieben werden soll
                """
        cursor = self._cnx.cursor()

        command = "UPDATE person " + "SET vorname=%s, nachname=%s, nickname=%s, google_id=%s WHERE id=%s"
        data = (person.get_vorname(), person.get_nachname(), person.get_nickname(),
                person.get_google_id(), person.get_id())
        cursor.execute(command, data)

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
            mit der gewünschten Vorname enthält.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, vorname, nachname, nickname, google_id FROM person WHERE vorname=%s"
        cursor.execute(command, (vorname,))
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

    def find_by_nachname(self, nachname):
        """Auslesen aller Personen anhand der zugeordneten Nachname.

        :param nachname Nachname der zugehörigen Person.
        :return Eine Sammlung mit Person-Objekten, die sämtliche Personen
            mit der gewünschten Nachname enthält.
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, vorname, nachname, nickname, google_id FROM person WHERE nachname=%s"
        cursor.execute(command, (nachname,))
        tuples = cursor.fetchall()


        for (id, vorname, nachname, nickname, google_id, kleiderschrank) in tuples[0]:
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
            mit der gewünschten Nickname enthält.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, vorname, nachname, nickname, google_id, kleiderschrank FROM person WHERE nickname=%s"
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
        """Auslesen aller Personen anhand der zugeordneten google_id.

        :param google_id Google_ID der zugehörigen Person.
        :return Eine Sammlung mit Person-Objekten, die sämtliche Personen
            mit der gewünschten Google_ID enthält.
        """
        result = None

        cursor = self._cnx.cursor()
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
            result = person
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
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