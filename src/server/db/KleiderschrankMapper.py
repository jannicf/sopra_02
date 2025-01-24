from server.bo.Kleiderschrank import Kleiderschrank
from server.db.Mapper import Mapper
from server.db.PersonMapper import PersonMapper
from server.db.KleidungsstueckMapper import KleidungsstueckMapper

class KleiderschrankMapper(Mapper):

    def insert(self, kleiderschrank):
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM kleiderschrank")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                kleiderschrank.set_id(maxid[0] + 1)
            else:
                kleiderschrank.set_id(1)

        command = "INSERT INTO kleiderschrank (id, eigentuemer_id, name) VALUES (%s,%s,%s)"
        data = (kleiderschrank.get_id(), kleiderschrank.get_eigentuemer().get_id(), kleiderschrank.get_name())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return kleiderschrank

    def update(self, kleiderschrank):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

                :param kleiderschrank das Objekt, das in die DB geschrieben werden soll
                """
        cursor = self._cnx.cursor()
        try:
            # Hauptdaten des Kleiderschranks aktualisieren, inklusive Eigentümer
            command = "UPDATE kleiderschrank SET name = %s, eigentuemer_id = %s WHERE id = %s"
            data = (kleiderschrank.get_name(),
                    kleiderschrank.get_eigentuemer().get_id(),
                    kleiderschrank.get_id())
            cursor.execute(command, data)

            self._cnx.commit()
            return kleiderschrank

        except Exception as e:
            print(f"Mapper: Fehler beim Update: {str(e)}")
            self._cnx.rollback()
            raise e

        finally:
            cursor.close()

    def delete(self, kleiderschrank):
        """Löschen der Daten eines Kleiderschrank-Objekts aus der Datenbank.

                :param kleiderschrank das aus der DB zu löschende "Objekt"
                """
        cursor = self._cnx.cursor()

        """
        Inhalte eines Kleiderschranks löschen:
        Alle Kleidungsstücke, die dem Kleiderschrank zugeordnet sind, werden aus der Datenbank entfernt."""
        with KleidungsstueckMapper() as kleidungsstueck_mapper:
            kleidungsstueck_mapper.delete_by_kleiderschrank_id(kleiderschrank.get_id())

        """Danach wird der Kleiderschrank selbst gelöscht. Dies stellt sicher, 
        dass keine verwaisten Kleidungsstücke ohne zugehörigen Kleiderschrank in der Datenbank verbleiben."""

        command = "DELETE FROM kleiderschrank WHERE id=%s"
        cursor.execute(command, (kleiderschrank.get_id(),))  # `kleiderschrank.get_id()` als Tupel übergeben

        self._cnx.commit()
        cursor.close()

    def find_by_id(self, kleiderschrank_id):
        """Suchen eines Kleiderschranks mit vorgegebener ID. Da diese eindeutig ist,
                wird genau ein Objekt zurückgegeben.

                :param kleiderschrank_id Primärschlüsselattribut (->DB)
                :return Kleiderschrank-Objekt, das dem übergebenen Schlüssel entspricht, None bei
                    nicht vorhandenem DB-Tupel.
                """

        result = None
        cursor = self._cnx.cursor()

        command = "SELECT k.id, k.name, k.eigentuemer_id, p.vorname, p.nachname, p.nickname, p.google_id FROM kleiderschrank k LEFT JOIN person p ON k.eigentuemer_id = p.id WHERE k.id=%s"
        cursor.execute(command, (kleiderschrank_id,))
        tuples = cursor.fetchall()

        try:
            (id, name, eigentuemer_id, vorname, nachname, nickname, google_id) = tuples[0]
            kleiderschrank = Kleiderschrank()
            kleiderschrank.set_id(id)
            kleiderschrank.set_name(name)

            if eigentuemer_id:
                from server.bo.Person import Person
                person = Person()
                person.set_id(eigentuemer_id)
                person.set_vorname(vorname)
                person.set_nachname(nachname)
                person.set_nickname(nickname)
                person.set_google_id(google_id)
                kleiderschrank.set_eigentuemer(person)

            result = kleiderschrank

        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_eigentuemer(self, eigentuemer):
        """Auslesen des Kleiderschranks anhand des zugeordneten Eigentuemers.

        :param eigentuemer Eigentuemer des zugehörigen Kleiderschranks.
        :return Das Kleiderschrank-Objekt, mit dem gewünschten Eigentuemer.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, eigentuemer_id, name FROM kleiderschrank WHERE eigentuemer_id=%s"
        cursor.execute(command, (eigentuemer.get_id(),))
        tuples = cursor.fetchall()

        try:
            # Versuchen, alle Ergebnisse zu iterieren
                (id, eigentuemer_id, name) = tuples[0]
                kleiderschrank = Kleiderschrank()
                kleiderschrank.set_id(id)
                kleiderschrank.set_name(name)

                # Der Eigentümer wird direkt aus dem Eingabeparameter gesetzt
                kleiderschrank.set_eigentuemer(eigentuemer)

                # Inhalte (Kleidungsstücke) laden
                with KleidungsstueckMapper() as kleidungsstueck_mapper:
                    kleidungsstuecke = kleidungsstueck_mapper.find_by_kleiderschrank_id(id)
                    for kleidungsstueck in kleidungsstuecke:
                        kleiderschrank.add_kstueck(kleidungsstueck)

                result = kleiderschrank

        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Kleiderschränke unseres Systems.

                :return Eine Sammlung mit Kleiderschrank-Objekten, die sämtliche Benutzer
                        des Systems repräsentieren.
                """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT id, eigentuemer_id, name from kleiderschrank")
        tuples = cursor.fetchall()

        for (id, eigentuemer_id, name) in tuples:
            kleiderschrank = Kleiderschrank()
            kleiderschrank.set_id(id)
            kleiderschrank.set_name(name)

            # Eigentümer anhand von eigentuemer_id laden
            with PersonMapper() as person_mapper:
                eigentuemer = person_mapper.find_by_id(eigentuemer_id)
                kleiderschrank.set_eigentuemer(eigentuemer)

            # Inhalte (Kleidungsstücke) laden
            with KleidungsstueckMapper() as kleidungsstueck_mapper:
                kleidungsstuecke = kleidungsstueck_mapper.find_by_kleiderschrank_id(id)
                for kleidungsstueck in kleidungsstuecke:
                    kleiderschrank.add_kstueck(kleidungsstueck)

            result.append(kleiderschrank)

        self._cnx.commit()
        cursor.close()

        return result