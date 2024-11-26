from src.server.bo.Kleiderschrank import Kleiderschrank
from src.server.db.Mapper import Mapper
from src.server.db.PersonMapper import PersonMapper
from src.server.db.KleidungsstueckMapper import KleidungsstueckMapper

class KleiderschrankMapper(Mapper):
    def insert(self, kleiderschrank):
        """Einfügen eines Kleiderschrank-Objekts in die Datenbank.

                Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
                berichtigt.

                :param Kleiderschrank das zu speichernde Objekt
                :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
                """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM kleiderschrank ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Kleiderschrank-Objekt zu."""
                kleiderschrank.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                Kleiderschrank.set_id(1)

        command = "INSERT INTO kleiderschrank (id, eigentuemer, name) VALUES (%s,%s,%s)"
        data = (kleiderschrank.get_id(), kleiderschrank.get_eigentuemer(), kleiderschrank.get_name())
        cursor.execute(command, data)

        """Inhalte des Kleiderschranks speichern, um sicherzustellen, 
        dass die einzelnen Kleidungsstücke, die zu einem Kleiderschrank gehören, 
        ebenfalls korrekt in die Datenbank eingefügt werden."""
        kleidungsstueck_mapper = KleidungsstueckMapper(self._cnx)
        for kleidungsstueck in kleiderschrank.get_inhalt():
            kleidungsstueck.set_kleiderschrank_id(kleiderschrank.get_id())
            kleidungsstueck_mapper.insert(kleidungsstueck)

        self._cnx.commit()
        cursor.close()

        return kleiderschrank

    def update(self, kleiderschrank):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

                :param kleiderschrank das Objekt, das in die DB geschrieben werden soll
                """
        cursor = self._cnx.cursor()

        command = "UPDATE kleiderschrank " + "SET eigentümer=%s, name=%s WHERE id=%s"
        data = (kleiderschrank.get_eigentuemer(), kleiderschrank.get_name(), kleiderschrank.get_id())
        cursor.execute(command, data)

        """Inhalte des Kleiderschranks aktualisieren:
        Alle bestehenden Kleidungsstücke, die dem Kleiderschrank zugeordnet sind, werden aus der Datenbank gelöscht."""
        kleidungsstueck_mapper = KleidungsstueckMapper(self._cnx)
        kleidungsstueck_mapper.delete_by_kleiderschrank_id(kleiderschrank.get_id())

        """Die neuen Inhalte des Kleiderschranks werden eingefügt, indem die `kleiderschrank_id` für jedes 
        Kleidungsstück gesetzt und gespeichert wird."""
        for kleidungsstueck in kleiderschrank.get_inhalt():
            kleidungsstueck.set_kleiderschrank_id(kleiderschrank.get_id())
            kleidungsstueck_mapper.insert(kleidungsstueck)

        self._cnx.commit()
        cursor.close()



    def delete(self, kleiderschrank):
        """Löschen der Daten eines Kleiderschrank-Objekts aus der Datenbank.

                :param Kleiderschrank das aus der DB zu löschende "Objekt"
                """
        cursor = self._cnx.cursor()

        """
        Inhalte eines Kleiderschranks löschen:
        Alle Kleidungsstücke, die dem Kleiderschrank zugeordnet sind, werden aus der Datenbank entfernt."""
        kleidungsstueck_mapper = KleidungsstueckMapper(self._cnx)
        kleidungsstueck_mapper.delete_by_kleiderschrank_id(kleiderschrank.get_id())

        """Danach wird der Kleiderschrank selbst gelöscht. Dies stellt sicher, 
        dass keine verwaisten Kleidungsstücke ohne zugehörigen Kleiderschrank in der Datenbank verbleiben."""

        command = "DELETE FROM kleiderschrank WHERE id=%s"
        cursor.execute(command, (kleiderschrank.get_id(),))

        self._cnx.commit()
        cursor.close()


    def find_by_id(self, kleiderschrank_id):
        """Suchen eines Kleiderschranks mit vorgegebener ID. Da diese eindeutig ist,
                wird genau ein Objekt zurückgegeben.

                :param key Primärschlüsselattribut (->DB)
                :return Kleiderschrank-Objekt, das dem übergebenen Schlüssel entspricht, None bei
                    nicht vorhandenem DB-Tupel.
                """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, eigentuemer, name FROM kleiderschrank WHERE id={}".format(kleiderschrank_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, eigentuemer, name) = tuples[0]

            kleiderschrank = Kleiderschrank()
            kleiderschrank.set_id(id)
            kleiderschrank.set_name(name)

            person_mapper = PersonMapper(self._cnx)
            eigentuemer = person_mapper.find_by_id(person_id)
            kleiderschrank.set_eigentuemer(eigentuemer)

            kleidungsstueck_mapper = KleidungsstueckMapper(self._cnx)
            kleiderschrank.set_inhalt(kleidungsstueck_mapper.find_by_kleiderschrank_id(id))

            result = kleiderschrank

        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result


    def find_by_eigentuemer(self, eigentuemer):
        """Auslesen aller Kleiderschränke anhand des zugeordneten Eigentuemers.

        :param eigentuemer Eigentuemer des zugehörigen Kleiderschranks.
        :return Eine Sammlung mit Kleiderschrank-Objekten, die sämtliche Kleiderschränke
            mit dem gewünschten Eigentuemer enthält.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, eigentuemer, name FROM kleiderschrank WHERE eigentuemer={}".format(eigentuemer)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            # Versuchen, alle Ergebnisse zu iterieren
            for (id, name, eigentuemer_id) in tuples:
                kleiderschrank = Kleiderschrank()
                kleiderschrank.set_id(id)
                kleiderschrank.set_name(name)

                # Der Eigentümer wird direkt aus dem Eingabeparameter gesetzt
                kleiderschrank.set_eigentuemer(eigentuemer)

                # Inhalte (Kleidungsstücke) laden
                kleidungsstueck_mapper = KleidungsstueckMapper(self._cnx)
                kleiderschrank.set_inhalt(kleidungsstueck_mapper.find_by_kleiderschrank_id(id))

                result.append(kleiderschrank)

        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Benutzer unseres Systems.

                :return Eine Sammlung mit User-Objekten, die sämtliche Benutzer
                        des Systems repräsentieren.
                """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from kleiderschrank")
        tuples = cursor.fetchall()

        for (id, name, eigentuemer_id) in tuples:
            kleiderschrank = Kleiderschrank()
            kleiderschrank.set_id(id)
            kleiderschrank.set_name(name)

            # Eigentümer laden
            person_mapper = PersonMapper(self._cnx)
            eigentuemer = person_mapper.find_by_id(eigentuemer_id)
            kleiderschrank.set_eigentuemer(eigentuemer)

            # Inhalte (Kleidungsstücke) laden
            kleidungsstueck_mapper = KleidungsstueckMapper(self._cnx)
            kleiderschrank.set_inhalt(kleidungsstueck_mapper.find_by_kleiderschrank_id(id))

            result.append(kleiderschrank)

        self._cnx.commit()
        cursor.close()

        return result