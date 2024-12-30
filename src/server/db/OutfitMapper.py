from server.db.Mapper import Mapper
from server.bo.Outfit import Outfit
from server.bo.Kleidungsstueck import Kleidungsstueck
from server.bo.Style import Style

class OutfitMapper(Mapper):
    def insert(self, outfit):
        """Ein Outfit-Objekt in die Datenbaknk einfügen,
            und den Primärschlüssel des übergebenen Objekts prüfen,
            und falls notwendig anpassen


                :param outfit das zu speichernde Objekt
                :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
                """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM outfit ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Bei dem Auffinden einer maximalen ID, 
                wird diese um 1 hoch gezählt und dieser Wert dem Outfit-Objekt zugewisen"""
                outfit.set_id(maxid[0] + 1)
            else:
                """Kann keine maximale ID gefunden werden, wird die ID 1 verwendet, da wir davon ausgehen
                das dei Tabelle leer ist."""
                outfit.set_id(1)

        command = "INSERT INTO outfit (id, style_id) VALUES (%s, %s)"
        data = (outfit.get_id(), outfit.get_style().get_id())
        cursor.execute(command, data)

        # Bausteine (Outfit) separat behandeln
        bausteine = outfit.get_bausteine()

        # Falls bausteine vorhanden sind
        if bausteine:
            # Für jeden baustein einen separaten Eintrag in einer Verknüpfungstabelle erstellen
            for baustein in bausteine:
                verknuepfung_command = "INSERT INTO outfit_kleidungsstueck (outfit_id, kleidungsstueck_id) VALUES (%s, %s)"
                verknuepfung_data = (outfit.get_id(), baustein.get_id())
                cursor.execute(verknuepfung_command, verknuepfung_data)

        self._cnx.commit()
        cursor.close()

        return outfit


    def update(self, outfit):
        """Wiederholtes Schreiben eines Objekts in die Datenbank."""
        cursor = self._cnx.cursor()

        # Hauptobjekt aktualisieren
        command = "UPDATE outfit SET style_id = %s WHERE id = %s"
        data = (outfit.get_style().get_id(), outfit.get_id())
        cursor.execute(command, data)

        # bestehende Verknüpfungen zu bausteinen löschen
        delete_command = "DELETE FROM outfit_kleidungsstueck WHERE outfit_id = %s"
        cursor.execute(delete_command, (outfit.get_id(),))

        # Neue Verknüpfungen zu bausteinen einfügen
        bausteine = outfit.get_bausteine()
        if bausteine:
            for baustein in bausteine:
                insert_command = """
                INSERT INTO outfit_kleidungsstueck (outfit_id, kleidungsstueck_id)
                VALUES (%s, %s)
                """
                insert_data = (outfit.get_id(), baustein.get_id())
                cursor.execute(insert_command, insert_data)

        self._cnx.commit()
        cursor.close()


    def delete(self, outfit):

        cursor = self._cnx.cursor()

        # Verknüpfungen zu Kleidungsstücken löschen
        delete_relations = "DELETE FROM outfit_kleidungsstueck WHERE outfit_id = %s"
        cursor.execute(delete_relations, (outfit.get_id(),))

        # Das Outfit selbst löschen
        delete_outfit = "DELETE FROM outfit WHERE id = %s"
        cursor.execute(delete_outfit, (outfit.get_id(),))

        self._cnx.commit()
        cursor.close()

    def find_by_id(self, outfit_id):
        """Suchen eines Outfits mit vorgegebener ID. Da diese eindeutig ist,
                wird genau ein Objekt zurückgegeben.

                :param outfit_id Primärschlüsselattribut (->DB)
                :return Outfit-Objekt, das dem übergebenen Schlüssel entspricht, None bei
                    nicht vorhandenem DB-Tupel.
                """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, style_id FROM outfit WHERE id=%s"
        cursor.execute(command, (outfit_id,))
        tuples = cursor.fetchall()

        try:
            (id, style_id) = tuples[0]
            outfit = Outfit()
            outfit.set_id(id)

            # Style-Objekt erstellen und setzen
            style = Style()
            style.set_id(style_id)
            outfit.set_style(style)

            # Zugehörige Bausteine laden
            bausteine_command = """
                SELECT kleidungsstueck_id 
                FROM outfit_kleidungsstueck 
                WHERE outfit_id=%s
            """
            cursor.execute(bausteine_command, (outfit.get_id(),))
            bausteine_tuples = cursor.fetchall()

            for (baustein_id,) in bausteine_tuples:
                baustein = Kleidungsstueck()
                baustein.set_id(baustein_id)
                outfit.add_baustein(baustein)

            result = outfit

        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Outfit-Objekte unseres Systems.

                :return Eine Sammlung mit Outfit-Objekten, die sämtliche Outfits
                        des Systems repräsentieren.
                """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT id, style_id FROM outfit")
        tuples = cursor.fetchall()

        for (id, style_id) in tuples:
            outfit = Outfit()
            outfit.set_id(id)

            # Style-Objekt erstellen und setzen
            style = Style()
            style.set_id(style_id)
            outfit.set_style(style)

            # Zugehörige Bausteine laden
            bausteine_command = """
                SELECT kleidungsstueck_id 
                FROM outfit_kleidungsstueck 
                WHERE outfit_id=%s
            """
            cursor.execute(bausteine_command, (id,))
            bausteine_tuples = cursor.fetchall()

            for (baustein_id,) in bausteine_tuples:
                baustein = Kleidungsstueck()
                baustein.set_id(baustein_id)
                outfit.add_baustein(baustein)

            result.append(outfit)

        self._cnx.commit()
        cursor.close()

        return result