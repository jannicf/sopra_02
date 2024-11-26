from src.server.db.Mapper import Mapper
from src.server.bo.Outfit import Outfit
from src.server.bo.Kleidungsstueck import Kleidungsstueck

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

        command = "INSERT INTO outfit (id) VALUES (%s)"
        data = (outfit.get_id())
        cursor.execute(command, data)

        # Bausteine (Outfit) separat behandeln
        bausteine = outfit.get_bausteine()

        # Falls bausteine vorhanden sind
        if bausteine:
            # Für jeden baustein einen separaten Eintrag in einer Verknüpfungstabelle erstellen
            for baustein in bausteine:
                # Annahme: Es gibt eine Verknüpfungstabelle namens 'outfit_kleidungsstueck'
                verknuepfung_command = "INSERT INTO outfit_kleidungsstueck (outfit_id, kleidungsstueck_id) VALUES (%s, %s)"
                verknuepfung_data = (outfit.get_id(), baustein.get_id())
                cursor.execute(verknuepfung_command, verknuepfung_data)

        self._cnx.commit()
        cursor.close()

        return outfit


    def update(self, outfit):
        """Wiederholtes Schreiben eines Objekts in die Datenbank."""
        cursor = self._cnx.cursor()

        # Zuerst bestehende Verknüpfungen zu bausteinen löschen
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
                cursor.execute(insert_command, (outfit.get_id(), baustein.get_id()))

        self._cnx.commit()
        cursor.close()


    def delete(self, outfit):
        cursor = self._cnx.cursor()

        try:
            # Verknüpfungen zu Kleidungsstücken löschen
            delete_relations = "DELETE FROM outfit_kleidungsstueck WHERE outfit_id = %s"
            cursor.execute(delete_relations, (outfit.get_id(),))

            # Das Outfit selbst löschen
            delete_outfit = "DELETE FROM outfit WHERE id = %s"
            cursor.execute(delete_outfit, (outfit.get_id(),))

            self._cnx.commit()

        except Exception as e:
            self._cnx.rollback()
            print(f"Fehler beim Löschen des Outfits: {e}")
            raise e

        finally:
            cursor.close()


    def find_by_id(self, outfit_id):
        """Suchen eines Outfits mit seinen zugehörigen Bausteinen anhand der Outfit-ID.

        Args:
            outfit_id: Die ID des zu suchenden Outfits

        Returns:
            Outfit: Ein Outfit-Objekt mit allen zugehörigen Bausteinen,
                    None wenn kein Outfit gefunden wurde
        """
        result = None
        cursor = self._cnx.cursor()

        try:
            # Outfit-Daten aus der Datenbank laden
            command = "SELECT id FROM outfit WHERE id=%s"
            cursor.execute(command, (outfit_id,))
            tuples = cursor.fetchall()

            if tuples:
                # Outfit-Objekt erstellen
                result = Outfit()
                result.set_id(tuples[0][0])  # ID setzen

                # Zugehörige Bausteine (Kleidungsstücke) laden
                bausteine_command = """
                    SELECT kleidungsstueck_id 
                    FROM outfit_kleidungsstueck 
                    WHERE outfit_id=%s
                """
                cursor.execute(bausteine_command, (outfit_id,))
                bausteine_tuples = cursor.fetchall()

                # Liste für Bausteine erstellen
                bausteine = []

                # Für jeden gefundenen Baustein ein Kleidungsstück-Objekt erstellen
                for (baustein_id,) in bausteine_tuples:
                    baustein = Kleidungsstueck()
                    baustein.set_id(baustein_id)
                    bausteine.append(baustein)

                # Bausteine dem Outfit hinzufügen
                for baustein in bausteine:
                    result.add_baustein(baustein)

        except Exception as e:
            result = None
            print(f"Fehler bei der Outfit-Suche: {e}")

        finally:
            cursor.close()

        return result


    def find_all(self):
        """Liest alle Outfits mit ihren zugehörigen Bausteinen aus der Datenbank aus.

        Returns:
            list[Outfit]: Eine Liste von Outfit-Objekten mit allen zugehörigen Bausteinen
        """
        result = []
        cursor = self._cnx.cursor()

        try:
            # Alle Outfits laden
            cursor.execute("SELECT id FROM outfit")
            outfit_tuples = cursor.fetchall()

            for (outfit_id,) in outfit_tuples:
                # Outfit-Objekt erstellen
                outfit = Outfit()
                outfit.set_id(outfit_id)

                # Bausteine für dieses Outfit laden
                cursor.execute("""
                    SELECT kleidungsstueck_id 
                    FROM outfit_kleidungsstueck 
                    WHERE outfit_id=%s
                """, (outfit_id,))
                bausteine_tuples = cursor.fetchall()

                # Bausteine für dieses Outfit erstellen und hinzufügen
                for (baustein_id,) in bausteine_tuples:
                    baustein = Kleidungsstueck()
                    baustein.set_id(baustein_id)
                    outfit.add_baustein(baustein)  # Nutzt die gleiche Methode wie in find_by_id

                result.append(outfit)

        except Exception as e:
            print(f"Fehler beim Laden aller Outfits: {e}")
            result = []

        finally:
            cursor.close()

        return result