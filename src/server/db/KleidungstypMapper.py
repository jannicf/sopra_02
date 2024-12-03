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

        command = "INSERT INTO kleidungstyp (id, bezeichnung) VALUES (%s,%s)"
        data = (kleidungstyp.get_id(), kleidungstyp.get_bezeichnung())
        cursor.execute(command, data)

        # Verwendungen (Styles) separat behandeln
        verwendungen = kleidungstyp.get_verwendungen()

        # Falls Verwendungen vorhanden sind
        if verwendungen:
            # Für jede Verwendung einen separaten Eintrag in einer Verknüpfungstabelle erstellen
            for verwendung in verwendungen:
                verknuepfung_command = "INSERT INTO style_kleidungstyp (kleidungstyp_id, style_id) VALUES (%s, %s)"
                verknuepfung_data = (kleidungstyp.get_id(), verwendung.get_id())
                cursor.execute(verknuepfung_command, verknuepfung_data)

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
        command = "UPDATE kleidungstyp" + "SET bezeichnung=%s WHERE id=%s"
        data = (kleidungstyp.get_bezeichnung(), kleidungstyp.get_id())
        cursor.execute(command, data)

        # Verwendungen (Styles) aktualisieren
        # Zuerst vorhandene Verknüpfungen löschen
        delete_command = "DELETE FROM style_kleidungstyp WHERE kleidungstyp_id=%s"
        cursor.execute(delete_command, (kleidungstyp.get_id(),))

        # Neue Verwendungen einfügen
        verwendungen = kleidungstyp.get_verwendungen()
        if verwendungen:
            for verwendung in verwendungen:
                verknuepfung_command = "INSERT INTO style_kleidungstyp (kleidungstyp_id, style_id) VALUES (%s, %s)"
                verknuepfung_data = (kleidungstyp.get_id(), verwendung.get_id())
                cursor.execute(verknuepfung_command, verknuepfung_data)

        self._cnx.commit()
        cursor.close()

    def delete(self, kleidungstyp):
        """
            Löschen der Daten eines Kleidungstyp-Objekts aus der Datenbank.

            :param kleidungstyp: Das aus der DB zu löschende Objekt
        """
        cursor = self._cnx.cursor()

        # Zuerst Verknüpfungen in der Zwischentabelle löschen
        verknuepfung_command = "DELETE FROM style_kleidungstyp WHERE kleidungstyp_id=%s"
        cursor.execute(verknuepfung_command, (kleidungstyp.get_id(),))

        # Dann den Kleidungstyp selbst löschen
        command = "DELETE FROM kleidungstyp WHERE id=%s"
        cursor.execute(command, (kleidungstyp.get_id(),))

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
        command = "SELECT id, bezeichnung FROM kleidungstyp WHERE id=%s".format(kleidungstyp_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, bezeichnung) = tuples[0]
            kleidungstyp = Kleidungstyp()
            kleidungstyp.set_id(id)
            kleidungstyp.set_bezeichnung(bezeichnung)

            # Abfrage der zugehörigen Verwendungen (Styles). Ohne diese Abfrage wäre die Verwendung leer.
            verwendung_command = """
                        SELECT style.id, style.name 
                        FROM style 
                        JOIN style_kleidungstyp ON style.id = style_kleidungstyp.style_id
                        WHERE style_kleidungstyp.kleidungstyp_id = %s
                    """
            cursor.execute(verwendung_command, (id,))
            verwendung_tuples = cursor.fetchall()

            # Styles dem Kleidungstyp hinzufügen
            for (style_id, style_name) in verwendung_tuples:
                style = Style()
                style.set_id(style_id)
                style.set_name(style_name)
                kleidungstyp.add_verwendung(style)

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
        result = []

        cursor = self._cnx.cursor()

        # Parameterisierte Abfrage für Sicherheit
        command = "SELECT id, bezeichnung FROM kleidungstyp WHERE bezeichnung={}".format(bezeichnung)
        cursor.execute(command)
        tuples = cursor.fetchall()

        # Durchlaufen aller gefundenen Datensätze
        for (id, bezeichnung) in tuples:
            kleidungstyp = Kleidungstyp()
            kleidungstyp.set_id(id)
            kleidungstyp.set_bezeichnung(bezeichnung)

            # Abfrage der zugehörigen Verwendungen (Styles). Ohne diese Abfrage wäre die Verwendung leer.
            verwendung_command = """
                        SELECT style.id, style.name 
                        FROM style 
                        JOIN style_kleidungstyp ON style.id = style_kleidungstyp.style_id
                        WHERE style_kleidungstyp.kleidungstyp_id = %s
                    """
            cursor.execute(verwendung_command, (id,))
            verwendung_tuples = cursor.fetchall()

            # Styles dem Kleidungstyp hinzufügen
            for (style_id, style_name) in verwendung_tuples:
                style_dict = {
                    'id': style_id,
                    'name': style_name
                }
                style = Style.from_dict(style_dict)
                kleidungstyp.add_verwendung(style)

            result.append(kleidungstyp)

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

        for (id, bezeichnung) in tuples:
            kleidungstyp = Kleidungstyp()
            kleidungstyp.set_id(id)
            kleidungstyp.set_bezeichnung(bezeichnung)

            # Abfrage der zugehörigen Verwendungen (Styles). Ohne diese Abfrage wäre die Verwendung leer.
            verwendung_command = """
                       SELECT style.id, style.name 
                       FROM style 
                       JOIN style_kleidungstyp ON style.id = style_kleidungstyp.style_id
                       WHERE style_kleidungstyp.kleidungstyp_id = %s
                   """
            cursor.execute(verwendung_command, (id,))
            verwendung_tuples = cursor.fetchall()

            # Styles dem Kleidungstyp hinzufügen
            for (style_id, style_name) in verwendung_tuples:
                style_dict = {
                    'id': style_id,
                    'name': style_name
                }
                style = Style.from_dict(style_dict)
                kleidungstyp.add_verwendung(style)

            result.append(kleidungstyp)

        cursor.close()

        return result