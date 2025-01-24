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
        try:
            # ID generieren
            cursor.execute("SELECT MAX(id) AS maxid FROM kleidungstyp")
            tuples = cursor.fetchall()
            maxid = tuples[0][0]
            kleidungstyp.set_id(maxid + 1 if maxid is not None else 1)

            # Kleidungstyp einfügen
            command = "INSERT INTO kleidungstyp (id, bezeichnung, kleiderschrank_id) VALUES (%s, %s, %s)"
            data = (kleidungstyp.get_id(), kleidungstyp.get_bezeichnung(), kleidungstyp.get_kleiderschrank_id())
            cursor.execute(command, data)

            # Verwendungen einfügen
            verwendungen = kleidungstyp.get_verwendungen()
            for style_obj in verwendungen:
                style_id = style_obj.get_id()
                command = "INSERT INTO style_kleidungstyp (style_id, kleidungstyp_id) VALUES (%s, %s)"
                cursor.execute(command, (style_id, kleidungstyp.get_id()))

            self._cnx.commit()
            return kleidungstyp

        except Exception as e:
            print(f"Error in KleidungstypMapper.insert: {str(e)}")
            self._cnx.rollback()
            raise e
        finally:
            cursor.close()

    def update(self, kleidungstyp):
        """
        Wiederholtes Schreiben eines Kleidungstyp-Objekts in die Datenbank.

        :param kleidungstyp: Das Objekt, das in die DB geschrieben werden soll
        :return: Das aktualisierte Kleidungstyp-Objekt
        :raises: Exception wenn ein Datenbankfehler auftritt
        """
        cursor = self._cnx.cursor()
        try:

            # Hauptobjekt aktualisieren
            command = "UPDATE kleidungstyp SET bezeichnung=%s, kleiderschrank_id=%s WHERE id=%s"
            data = (kleidungstyp.get_bezeichnung(),
                    kleidungstyp.get_kleiderschrank_id(),
                    kleidungstyp.get_id())
            cursor.execute(command, data)
            print(f"Hauptdaten aktualisiert")

            # Vorhandene Style-Verknüpfungen laden
            cursor.execute("""
                    SELECT style_id 
                    FROM style_kleidungstyp 
                    WHERE kleidungstyp_id = %s
                """, (kleidungstyp.get_id(),))
            existing_style_ids = {row[0] for row in cursor.fetchall()}
            print(f"Vorhandene Style-IDs: {existing_style_ids}")

            # Neue Style-IDs aus dem Kleidungstyp-Objekt
            new_style_ids = {verwendung.get_id() for verwendung in kleidungstyp.get_verwendungen()}
            print(f"Neue Style-IDs: {new_style_ids}")

            # Zu löschende Styles (in existing aber nicht in new)
            styles_to_delete = existing_style_ids - new_style_ids
            # Neu hinzuzufügende Styles (in new aber nicht in existing)
            styles_to_add = new_style_ids - existing_style_ids

            # Nicht mehr benötigte Verknüpfungen löschen
            if styles_to_delete:
                delete_command = """
                        DELETE FROM style_kleidungstyp 
                        WHERE kleidungstyp_id = %s AND style_id IN ({})
                    """.format(','.join(['%s'] * len(styles_to_delete)))
                cursor.execute(delete_command, (kleidungstyp.get_id(), *styles_to_delete))
                print(f"Gelöschte Style-Verknüpfungen: {styles_to_delete}")

            # Neue Verknüpfungen hinzufügen
            for style_id in styles_to_add:
                cursor.execute("""
                        INSERT INTO style_kleidungstyp (kleidungstyp_id, style_id) 
                        VALUES (%s, %s)
                    """, (kleidungstyp.get_id(), style_id))
                print(f"Neue Style-Verknüpfung hinzugefügt: {style_id}")

            self._cnx.commit()
            print(f"Update erfolgreich abgeschlossen")
            return kleidungstyp

        except Exception as e:
            print(f"Fehler beim Update des Kleidungstyps: {str(e)}")
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

        try:
            # Hauptabfrage für den Kleidungstyp
            command = "SELECT id, bezeichnung, kleiderschrank_id FROM kleidungstyp WHERE id=%s"
            cursor.execute(command, (kleidungstyp_id,))
            tuples = cursor.fetchall()

            if tuples:
                (id, bezeichnung, kleiderschrank_id) = tuples[0]
                kleidungstyp = Kleidungstyp()
                kleidungstyp.set_id(id)
                kleidungstyp.set_bezeichnung(bezeichnung)
                kleidungstyp.set_kleiderschrank_id(kleiderschrank_id)

                # Hier die Verwendungen (Styles) laden
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

        except Exception as e:
            print(f"Fehler in find_by_id: {str(e)}")
            raise e
        finally:
            cursor.close()

        return result


    def find_by_bezeichnung(self, bezeichnung):
        """Suchen eines Kleidungstyps anhand seiner Bezeichnung.

        :param bezeichnung: Bezeichnung des gesuchten Kleidungstyps
        :return Kleidungstyp-Objekt oder None
        """
        result = None
        cursor = self._cnx.cursor()

        try:
            # Nur die ID abfragen
            command = "SELECT id FROM kleidungstyp WHERE bezeichnung=%s"
            cursor.execute(command, (bezeichnung,))
            tuples = cursor.fetchall()

            if tuples:
                (id,) = tuples[0]
                # Vollständiges Objekt über find_by_id laden
                result = self.find_by_id(id)

        except Exception as e:
            raise e
        finally:
            cursor.close()

        return result


    def find_by_kleiderschrank_id(self, kleiderschrank_id):
        """
        Sucht alle Kleidungstypen eines bestimmten Kleiderschranks.

        :param kleiderschrank_id: ID des Kleiderschranks
        :return: Liste von Kleidungstyp-Objekten
        """
        result = []
        cursor = self._cnx.cursor()

        try:
            # Basis-Daten der Kleidungstypen laden
            cursor.execute("""
                    SELECT id, bezeichnung, kleiderschrank_id 
                    FROM kleidungstyp 
                    WHERE kleiderschrank_id = %s
                """, (kleiderschrank_id,))

            tuples = cursor.fetchall()

            for (id, bezeichnung, k_id) in tuples:
                kleidungstyp = Kleidungstyp()
                kleidungstyp.set_id(id)
                kleidungstyp.set_bezeichnung(bezeichnung)
                kleidungstyp.set_kleiderschrank_id(k_id)

                # Styles/Verwendungen für diesen Kleidungstyp laden
                cursor.execute("""
                        SELECT s.id, s.name 
                        FROM style s
                        JOIN style_kleidungstyp sk ON s.id = sk.style_id
                        WHERE sk.kleidungstyp_id = %s
                    """, (id,))

                style_tuples = cursor.fetchall()

                for (style_id, style_name) in style_tuples:
                    style = Style()
                    style.set_id(style_id)
                    style.set_name(style_name)
                    kleidungstyp.add_verwendung(style)

                result.append(kleidungstyp)

        except Exception as e:
            print(f"Fehler in find_by_kleiderschrank_id: {str(e)}")
            raise e
        finally:
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