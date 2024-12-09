from src.server.bo.Kleiderschrank import Kleiderschrank
from src.server.db.Mapper import Mapper
from src.server.db.PersonMapper import PersonMapper
from src.server.db.KleidungsstueckMapper import KleidungsstueckMapper

class KleiderschrankMapper(Mapper):
    def insert(self, kleiderschrank):
        """Einfügen eines kleiderschrank-Objekts in die Datenbank.

                Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
                berichtigt.

                :param kleiderschrank das zu speichernde Objekt
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
                kleiderschrank.set_id(1)

        command = "INSERT INTO kleiderschrank (id, eigentuemer_id, name) VALUES (%s,%s,%s)"
        data = (kleiderschrank.get_id(), kleiderschrank.get_eigentuemer().get_id(), kleiderschrank.get_name())
        cursor.execute(command, data)

        """Inhalte des Kleiderschranks speichern, um sicherzustellen, 
        dass die einzelnen Kleidungsstücke, die zu einem Kleiderschrank gehören, 
        ebenfalls korrekt in die Datenbank eingefügt werden."""
        kleidungsstueck_mapper = KleidungsstueckMapper()
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

        command = "UPDATE kleiderschrank SET eigentuemer_id=%s, name=%s WHERE id=%s"
        data = (kleiderschrank.get_eigentuemer().get_id(), kleiderschrank.get_name(), kleiderschrank.get_id())
        cursor.execute(command, data)

        # Alle bestehenden Zuordnungen auf NULL setzen
        delete_command = """UPDATE kleidungsstueck 
                           SET kleiderschrank_id=NULL 
                           WHERE kleiderschrank_id=%s"""
        cursor.execute(delete_command, (kleiderschrank.get_id(),))

        # Neue Zuordnungen erstellen
        for kleidungsstueck in kleiderschrank.get_inhalt():
            update_command = """UPDATE kleidungsstueck 
                               SET kleiderschrank_id=%s 
                               WHERE id=%s"""
            cursor.execute(update_command,
                          (kleiderschrank.get_id(),
                           kleidungsstueck.get_id()))

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
        command = "SELECT id, eigentuemer_id, name FROM kleiderschrank WHERE id={}".format(kleiderschrank_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, eigentuemer_id, name) = tuples[0]

            kleiderschrank = Kleiderschrank()
            kleiderschrank.set_id(id)
            kleiderschrank.set_name(name)

            with PersonMapper() as person_mapper:
                eigentuemer = person_mapper.find_by_id(eigentuemer_id)
                kleiderschrank.set_eigentuemer(eigentuemer)

            with KleidungsstueckMapper() as kleidungsstueck_mapper:
                command = "SELECT id FROM kleidungsstueck WHERE kleiderschrank_id=%s"
                cursor.execute(command, (id,))
                kleidungsstueck_tuples = cursor.fetchall()

                for (kleidungsstueck_id,) in kleidungsstueck_tuples:
                    kleidungsstueck = kleidungsstueck_mapper.find_by_id(kleidungsstueck_id)
                    if kleidungsstueck:
                        kleiderschrank.add_kstueck(kleidungsstueck)

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
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, eigentuemer_id, name FROM kleiderschrank WHERE eigentuemer_id=%s"
        cursor.execute(command, (eigentuemer.get_id(),))
        tuples = cursor.fetchall()

        try:
            # Versuchen, alle Ergebnisse zu iterieren
            for (id, eigentuemer_id, name) in tuples:
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

                result.append(kleiderschrank)

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