from server.db.Mapper import Mapper
from server.bo.Kleidungstyp import Kleidungstyp
from server.bo.Style import Style

"""In dieser Klasse könnte man durch die Nutzung von with-statements die jeweiligen Mapper der Attribute
direkt aufrufen, um die benötigten Daten zu laden bzw. zu verändern. Da dies jedoch zu einem
Verbindungsfehler der Datenbank führt, weil die Mapper sich immer wieder selbst aufrufen, wurde der Aufruf 
der Mapper durch eine ausführlichere Implementierung mit SQL-Statements ersetzt, was zwar aufwendiger
daherkommt, aber das Problem der zu vielen aufgebauten Datenbankverbindungen umgeht."""

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

        command = "INSERT INTO kleidungstyp (id, bezeichnung, kleiderschrank_id) VALUES (%s,%s,%s)"
        data = (kleidungstyp.get_id(), kleidungstyp.get_bezeichnung(), kleidungstyp.get_kleiderschrank_id())
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
        :return: Das aktualisierte Kleidungstyp-Objekt
        :raises: Exception wenn ein Datenbankfehler auftritt
        """
        cursor = self._cnx.cursor()
        try:
            # Prüfen ob Kleiderschrank existiert
            cursor.execute("SELECT id FROM kleiderschrank WHERE id=%s",
                           (kleidungstyp.get_kleiderschrank_id(),))
            if not cursor.fetchone():
                raise ValueError(f"Kleiderschrank mit ID {kleidungstyp.get_kleiderschrank_id()} existiert nicht")

            # Hauptobjekt aktualisieren
            command = "UPDATE kleidungstyp SET bezeichnung=%s, kleiderschrank_id=%s WHERE id=%s"
            data = (kleidungstyp.get_bezeichnung(), kleidungstyp.get_kleiderschrank_id(), kleidungstyp.get_id())
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
            return kleidungstyp

        except Exception as e:
            self._cnx.rollback()
            raise e
        finally:
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
        command = "SELECT id, bezeichnung, kleiderschrank_id FROM kleidungstyp WHERE id=%s"
        cursor.execute(command, (kleidungstyp_id,))
        tuples = cursor.fetchall()

        try:
            (id, bezeichnung, kleiderschrank_id) = tuples[0]
            kleidungstyp = Kleidungstyp()
            kleidungstyp.set_id(id)
            kleidungstyp.set_bezeichnung(bezeichnung)
            kleidungstyp.set_kleiderschrank_id(kleiderschrank_id)

            # Abfrage der zugehörigen Verwendungen (Styles)
            verwendung_command = """
                        SELECT style.id, style.name
                        FROM style 
                        JOIN style_kleidungstyp ON style.id = style_kleidungstyp.style_id
                        WHERE style_kleidungstyp.kleidungstyp_id = %s
                    """
            cursor.execute(verwendung_command, (id,))
            verwendung_tuples = cursor.fetchall()

            # Styles dem Kleidungstyp direkt hinzufügen
            for (style_id, style_name) in verwendung_tuples:
                style = Style()
                style.set_id(style_id)
                style.set_name(style_name)
                kleidungstyp.add_verwendung(style)

            result = kleidungstyp

        except IndexError:
            result = None

        cursor.close()
        return result

    def find_by_bezeichnung(self, bezeichnung):
        """Suchen eines Kleidungstyps anhand seiner Bezeichnung.

        :param bezeichnung: Bezeichnung des gesuchten Kleidungstyps
        :return Kleidungstyp-Objekt oder None
        """
        result = None
        cursor = self._cnx.cursor()

        # Nur die ID abfragen
        command = "SELECT id FROM kleidungstyp WHERE bezeichnung=%s"
        cursor.execute(command, (bezeichnung,))
        tuples = cursor.fetchall()

        try:
            (id,) = tuples[0]
            # Vollständiges Objekt über find_by_id laden
            result = self.find_by_id(id)
        except IndexError:
            result = None

        cursor.close()
        return result

    def find_by_kleiderschrank_id(self, kleiderschrank_id):
        result = []
        cursor = self._cnx.cursor()

        # Dann die eigentliche Abfrage
        command = "SELECT id FROM kleidungstyp WHERE kleiderschrank_id=%s"
        cursor.execute(command, (kleiderschrank_id,))
        tuples = cursor.fetchall()

        for (id,) in tuples:
            kleidungstyp = self.find_by_id(id)
            if kleidungstyp is not None:
                result.append(kleidungstyp)

        cursor.close()
        return result
    def find_all(self):
        """Auslesen aller Kleidungstypen.

        :return Eine Liste mit allen Kleidungstyp-Objekten
        """
        result = []
        cursor = self._cnx.cursor()

        cursor.execute("SELECT id FROM kleidungstyp")
        tuples = cursor.fetchall()

        for (id,) in tuples:
            # Vollständige Objekte über find_by_id laden
            kleidungstyp = self.find_by_id(id)
            if kleidungstyp:
                result.append(kleidungstyp)

        cursor.close()
        return result