from src.server.db.Mapper import Mapper
from src.server.bo.Kleidungstyp import Kleidungstyp
from src.server.bo.Style import Style


class KleidungstypMapper(Mapper):

    def insert(self, kleidungstyp):
        """Einfügen eines Kleidungstyp-Objekts in die Datenbank.

            Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf. berichtigt.

            :param kleidungstyp das zu speichernde Objekt
            :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM kleidungstyp ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Kleidungstyp-Objekt zu."""
                kleidungstyp.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                kleidungstyp.set_id(1)

        command = "INSERT INTO kleidungstyp (id, bezeichnung, verwendung) VALUES (%s,%s,%s)"
        data = (kleidungstyp.get_id(), kleidungstyp.get_bezeichnung(), kleidungstyp.get_verwendung())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return kleidungstyp

    def update(self, kleidungstyp):
        """
            Wiederholtes Schreiben eines Kleidungstyp-Objekts in die Datenbank.

            :param kleidungstyp: Das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        # Hauptobjekt aktualisieren
        command = "UPDATE kleidungstyp" + "SET bezeichnung=%s, verwendung=%s WHERE id=%s"
        data = (kleidungstyp.get_bezeichnung(), kleidungstyp.get_verwendung(), kleidungstyp.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, kleidungstyp):
        """
            Löschen der Daten eines Kleidungstyp-Objekts aus der Datenbank.

            :param kleidungstyp: Das aus der DB zu löschende Objekt
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM person WHERE id={}".format(kleidungstyp.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def find_by_id(self, kleidungstyp_id):
        """
            Suchen eines Kleidungstyps mit vorgegebener ID.
            Da diese eindeutig ist, wird genau ein Objekt zurückgegeben.

            :param kleidungstyp_id: Primärschlüsselattribut (->DB)
            :return Kleidungstyp-Objekt, das dem übergebenen Schlüssel entspricht, None bei
                    nicht vorhandenem DB-Tupel.
        """
        result = None

        cursor = self._cnx.cursor()

        # Hauptabfrage für den Kleidungstyp
        command = "SELECT id, bezeichnung, verwendung FROM kleidungstyp WHERE id=%s".format(kleidungstyp_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, bezeichnung, verwendung) = tuples[0]
            kleidungstyp = Kleidungstyp()
            kleidungstyp.set_id(id)
            kleidungstyp.set_bezeichnung(bezeichnung)
            kleidungstyp.set_verwendung(verwendung)
            result = kleidungstyp

        except IndexError:
            """
            Der IndexError tritt auf, wenn keine Datensätze gefunden werden.
            In diesem Fall bleibt result None.
            """
            result = None

        cursor.close()

        return result

    def find_by_bezeichnung(self, bezeichnung):
        """
        Auslesen aller Kleidungstypen anhand der Bezeichnung.

        :param bezeichnung: Bezeichnung der zu suchenden Kleidungstypen
        :return: Eine Sammlung mit Kleidungstyp-Objekten, die der Bezeichnung entsprechen
        """
        result = None

        cursor = self._cnx.cursor()

        # Parameterisierte Abfrage für Sicherheit
        command = "SELECT id, bezeichnung, verwendung FROM kleidungstyp WHERE bezeichnung={}".format(bezeichnung)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, bezeichnung, verwendung) = tuples[0]
            kleidungstyp = Kleidungstyp()
            kleidungstyp.set_id(id)
            kleidungstyp.set_bezeichnung(bezeichnung)
            kleidungstyp.set_verwendung(verwendung)
            result = kleidungstyp

        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_verwendung(self, verwendung):
        """
        Auslesen aller Kleidungstypen anhand der Verwendung.

        :param verwendung: Verwendung der zu suchenden Kleidungstypen
        :return: Eine Liste mit Kleidungstyp-Objekten, die der Verwendung entsprechen
        """
        result = []

        cursor = self._cnx.cursor()

        # Parameterisierte Abfrage für Sicherheit
        command = "SELECT id, bezeichnung, verwendung FROM kleidungstyp WHERE bezeichnung={}".format(verwendung)
        cursor.execute(command)
        tuples = cursor.fetchall()


        for (id, bezeichnung, verwendung) in tuples[0]:
            kleidungstyp = Kleidungstyp()
            kleidungstyp.set_id(id)
            kleidungstyp.set_bezeichnung(bezeichnung)
            kleidungstyp.set_verwendung(verwendung)
            result.append(kleidungstyp)

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """
            Auslesen aller Kleidungstypen im System.

            :return: Eine Sammlung mit allen Kleidungstyp-Objekten
        """
        result = []
        cursor = self._cnx.cursor()

        # Hauptabfrage für Kleidungstypen
        cursor.execute("SELECT id, bezeichnung FROM kleidungstyp")
        tuples = cursor.fetchall()

        for (id, bezeichnung, verwendung) in tuples:
            kleidungstyp = Kleidungstyp()
            kleidungstyp.set_id(id)
            kleidungstyp.set_bezeichnung(bezeichnung)
            kleidungstyp.set_verwendung(verwendung)
            result.append(kleidungstyp)

        self._cnx.commit()
        cursor.close()

        return result