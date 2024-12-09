from src.server.db.Mapper import Mapper
from src.server.bo.Kleidungsstueck import Kleidungsstueck


class KleidungsstueckMapper(Mapper):
    def insert(self, kleidungsstueck):
        """Einfügen eines Kleidungsstück-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.
        :param kleidungsstueck das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID."""
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM kleidungsstueck ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Kleidungsstück-Objekt zu."""
                kleidungsstueck.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                kleidungsstueck.set_id(1)

        command = "INSERT INTO kleidungsstueck (id, name, typ_id, kleiderschrank_id) VALUES (%s,%s,%s,%s)"
        data = (kleidungsstueck.get_id(), kleidungsstueck.get_name(), kleidungsstueck.get_typ().get_id(),
                kleidungsstueck.get_kleiderschrank_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return kleidungsstueck

    def update(self, kleidungsstueck):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.

        :param kleidungsstueck das Objekt, das in die DB geschrieben werden soll"""
        cursor = self._cnx.cursor()

        command = "UPDATE kleidungsstueck SET name=%s, typ_id=%s WHERE id=%s"
        data = (kleidungsstueck.get_name(), kleidungsstueck.get_typ().get_id(), kleidungsstueck.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, kleidungsstueck):
        """Löschen der Daten eines Kleidungsstück-Objekts aus der Datenbank.

        :param kleidungsstueck das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM kleidungsstueck WHERE id={}".format(kleidungsstueck.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def delete_by_kleiderschrank_id(self, kleiderschrank_id):
        """Löscht alle Kleidungsstücke, die dem angegebenen Kleiderschrank zugeordnet sind.

        :param kleiderschrank_id: Die ID des Kleiderschranks, dessen zugeordnete Kleidungsstücke gelöscht werden sollen.
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM kleidungsstueck WHERE kleiderschrank_id = %s"
        cursor.execute(command, (kleiderschrank_id,))

        self._cnx.commit()
        cursor.close()

    def find_by_id(self, kleidungsstueck_id):
        """Suchen eines Kleidungsstücks mit vorgegebener Kleidungsstück ID. Da diese eindeutig ist,
                        wird genau ein Objekt zurückgegeben.
        :param kleidungsstueck_id Primärschlüsselattribut (->DB)
        :return Kleidungsstück-Objekt, das dem übergebenen Schlüssel entspricht, None bei nicht vorhandenem DB-Tupel."""

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, name, typ_id FROM kleidungsstueck WHERE id=%s"
        cursor.execute(command, (kleidungsstueck_id,))
        tuples = cursor.fetchall()

        try:
            (id, name, typ_id) = tuples[0]
            kleidungsstueck = Kleidungsstueck()
            kleidungsstueck.set_id(id)
            kleidungsstueck.set_name(name)
            kleidungsstueck.set_typ(typ_id)
            result = kleidungsstueck
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_name(self, name):
        """Auslesen aller Kleidungsstücke anhand der zugeordneten Name.

        :param name Name des zugehörigen Kleidungsstücks.
        :return Eine Sammlung mit Kleidungsstück-Objekten, die sämtliche Kleidungsstücke
            mit dem gewünschten Namen enthält.
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, name, typ_id FROM kleidungsstueck WHERE name=%s"
        cursor.execute(command, (name,))
        tuples = cursor.fetchall()


        for (id, name, typ_id) in tuples:
            kleidungsstueck = Kleidungsstueck()
            kleidungsstueck.set_id(id)
            kleidungsstueck.set_name(name)
            kleidungsstueck.set_typ(typ_id)
            result.append(kleidungsstueck)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_typ(self, typ):
        """Auslesen aller Kleidungsstücke anhand des zugeordneten Typs.

        :param typ Typ des zugehörigen Kleidungsstücks.
        :return Eine Sammlung mit Kleidungsstück-Objekten, die sämtliche Kleidungsstücke
            mit dem gewünschtem Typ enthält.
        """
        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, name, typ_id FROM kleidungsstueck WHERE typ_id=%s"
        cursor.execute(command, (typ.get_id(),))
        tuples = cursor.fetchall()

        try:
            (id, name, typ_id) = tuples[0]
            kleidungsstueck = Kleidungsstueck()
            kleidungsstueck.set_id(id)
            kleidungsstueck.set_name(name)
            kleidungsstueck.set_typ(typ_id)
            result = kleidungsstueck
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            pass

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Kleidungsstücke unseres Systems.

        :return Eine Sammlung mit Kleidungsstück-Objekten, die sämtliche Kleidungsstücke
        des Systems repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from kleidungsstueck")
        tuples = cursor.fetchall()

        for (id, name, typ_id, kleiderschrank_id) in tuples:
            kleidungsstueck = Kleidungsstueck()
            kleidungsstueck.set_id(id)
            kleidungsstueck.set_name(name)
            kleidungsstueck.set_typ(typ_id)
            kleidungsstueck.set_kleiderschrank_id(kleiderschrank_id)
            result.append(kleidungsstueck)

        self._cnx.commit()
        cursor.close()

        return result