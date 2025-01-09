from server.db.Mapper import Mapper
from server.bo.Style import Style
from server.bo.Kardinalitaet import Kardinalitaet
from server.bo.Mutex import Mutex
from server.bo.Implikation import Implikation
from server.bo.Kleidungstyp import Kleidungstyp
from server.db.KleidungstypMapper import KleidungstypMapper

"""In dieser Klasse könnte man durch die Nutzung von with-statements die jeweils benötigten Mapper
direkt aufrufen, um die benötigten Daten zu laden bzw. zu verändern. Da dies jedoch zu einem
Verbindungsfehler der Datenbank führt, da die Mapper sich immer wieder selbst aufrufen, wurden der Aufruf 
der Mapper durch eine ausführlichere Implementierung mit SQL-Statements ersetzt, was zwar aufwendiger
daherkommt, aber das Problem der zu vielen aufgebauten Datenbankverbindungen umgeht."""

class StyleMapper(Mapper):
    def insert(self, style):
        """Einfügen eines Style-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.

        :param style das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM style ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                style.set_id(maxid[0] + 1)
            else:
                style.set_id(1)

        # Erst den Style selbst einfügen
        command = "INSERT INTO style (id, name) VALUES (%s,%s)"
        data = (style.get_id(), style.get_name())
        cursor.execute(command, data)

        # Features einfügen falls vorhanden
        features = style.get_features()
        if features:
            for feature in features:
                command = "INSERT INTO style_kleidungstyp (style_id, kleidungstyp_id) VALUES (%s,%s)"
                data = (style.get_id(), feature)
                cursor.execute(command, data)

        # Constraints NACH dem Einfügen des Styles verarbeiten
        constraints = style.get_constraints()
        if isinstance(constraints, dict):  # Prüfen ob constraints ein Dictionary ist
            # Kardinalitäten
            if 'kardinalitaeten' in constraints and constraints['kardinalitaeten']:
                for k in constraints['kardinalitaeten']:
                    command = """INSERT INTO kardinalitaet 
                            (id, min_anzahl, max_anzahl, bezugsobjekt_id, style_id) 
                            VALUES (%s, %s, %s, %s, %s)"""
                    data = (k.get('id', None), k.get('minAnzahl'), k.get('maxAnzahl'),
                            k.get('bezugsobjekt_id'), style.get_id())
                    cursor.execute(command, data)

            # Mutexe
            if 'mutexe' in constraints and constraints['mutexe']:
                for m in constraints['mutexe']:
                    command = """INSERT INTO mutex 
                            (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) 
                            VALUES (%s, %s, %s, %s)"""
                    data = (m.get('id', None), m.get('bezugsobjekt1_id'),
                            m.get('bezugsobjekt2_id'), style.get_id())
                    cursor.execute(command, data)

            # Implikationen
            if 'implikationen' in constraints and constraints['implikationen']:
                for i in constraints['implikationen']:
                    command = """INSERT INTO implikation 
                            (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) 
                            VALUES (%s, %s, %s, %s)"""
                    data = (i.get('id', None), i.get('bezugsobjekt1_id'),
                            i.get('bezugsobjekt2_id'), style.get_id())
                    cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return style

    def update(self, style):
        cursor = self._cnx.cursor()
        try:
            constraints = style.get_constraints()

            # Style Basis-Update
            cursor.execute("UPDATE style SET name=%s WHERE id=%s",
                           (style.get_name(), style.get_id()))

            # Features Update
            cursor.execute("DELETE FROM style_kleidungstyp WHERE style_id=%s",
                           (style.get_id(),))

            for feature_id in style.get_features():
                cursor.execute("""
                    INSERT INTO style_kleidungstyp (style_id, kleidungstyp_id) 
                    VALUES (%s, %s)
                """, (style.get_id(), feature_id))

            # Alte Constraints löschen
            cursor.execute("DELETE FROM kardinalitaet WHERE style_id=%s", (style.get_id(),))
            cursor.execute("DELETE FROM mutex WHERE style_id=%s", (style.get_id(),))
            cursor.execute("DELETE FROM implikation WHERE style_id=%s", (style.get_id(),))

            # Neue IDs für Constraints generieren
            cursor.execute("SELECT MAX(id) FROM kardinalitaet")
            max_kard_id = cursor.fetchone()[0] or 0

            cursor.execute("SELECT MAX(id) FROM mutex")
            max_mutex_id = cursor.fetchone()[0] or 0

            cursor.execute("SELECT MAX(id) FROM implikation")
            max_impl_id = cursor.fetchone()[0] or 0

            # Kardinalitäten speichern
            for k in constraints['kardinalitaeten']:
                max_kard_id += 1
                cursor.execute("""
                    INSERT INTO kardinalitaet (id, min_anzahl, max_anzahl, bezugsobjekt_id, style_id)
                    VALUES (%s, %s, %s, %s, %s)
                """, (max_kard_id, k.get('minAnzahl'), k.get('maxAnzahl'), k.get('bezugsobjekt_id'), style.get_id()))

            # Mutexe speichern
            for m in constraints['mutexe']:
                max_mutex_id += 1
                cursor.execute("""
                    INSERT INTO mutex (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id)
                    VALUES (%s, %s, %s, %s)
                """, (max_mutex_id, m.get('bezugsobjekt1_id'), m.get('bezugsobjekt2_id'), style.get_id()))

            # Implikationen speichern
            for i in constraints['implikationen']:
                max_impl_id += 1
                cursor.execute("""
                    INSERT INTO implikation (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id)
                    VALUES (%s, %s, %s, %s)
                """, (max_impl_id, i.get('bezugsobjekt1_id'), i.get('bezugsobjekt2_id'), style.get_id()))

            self._cnx.commit()

        finally:
            cursor.close()

    def delete(self, style):
        """Löschen der Daten eines Style-Objekts aus der Datenbank.
        :param style das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        """umgekehrte Reihenfolge der Löschungen um Abhängigkeiten nicht zu verletzen"""

        # Constraints löschen
        delete_command2 = "DELETE FROM kardinalitaet WHERE style_id=%s"
        cursor.execute(delete_command2, (style.get_id(),))
        delete_command3 = "DELETE FROM mutex WHERE style_id=%s"
        cursor.execute(delete_command3, (style.get_id(),))
        delete_command4 = "DELETE FROM implikation WHERE style_id=%s"
        cursor.execute(delete_command4, (style.get_id(),))
        # Features löschen
        delete_command = "DELETE FROM style_kleidungstyp WHERE style_id=%s"
        cursor.execute(delete_command, (style.get_id(),))
        #dann erst den Style löschen
        command = "DELETE FROM style WHERE id=%s"
        cursor.execute(command, (style.get_id(),))

        self._cnx.commit()
        cursor.close()

    def find_by_id(self, id):
        """Suchen eines Styles mit vorgegebener ID."""
        cursor = self._cnx.cursor()
        try:
            cursor.execute("SELECT id, name FROM style WHERE id=%s", (id,))
            data = cursor.fetchone()

            if data:
                style = Style()
                style.set_id(data[0])
                style.set_name(data[1])

                # Constraints laden
                # Kardinalitäten
                cursor.execute("SELECT min_anzahl, max_anzahl, bezugsobjekt_id FROM kardinalitaet WHERE style_id=%s",
                               (id,))
                for k_data in cursor.fetchall():
                    style.add_constraint({
                        'type': 'kardinalitaet',
                        'minAnzahl': k_data[0],
                        'maxAnzahl': k_data[1],
                        'bezugsobjekt_id': k_data[2]
                    })

                # Mutexe
                cursor.execute("SELECT bezugsobjekt1_id, bezugsobjekt2_id FROM mutex WHERE style_id=%s", (id,))
                for m_data in cursor.fetchall():
                    style.add_constraint({
                        'type': 'mutex',
                        'bezugsobjekt1_id': m_data[0],
                        'bezugsobjekt2_id': m_data[1]
                    })

                # Implikationen
                cursor.execute("SELECT bezugsobjekt1_id, bezugsobjekt2_id FROM implikation WHERE style_id=%s", (id,))
                for i_data in cursor.fetchall():
                    style.add_constraint({
                        'type': 'implikation',
                        'bezugsobjekt1_id': i_data[0],
                        'bezugsobjekt2_id': i_data[1]
                    })

                # Features laden
                cursor.execute("""
                    SELECT kt.id, kt.bezeichnung 
                    FROM kleidungstyp kt
                    JOIN style_kleidungstyp sk ON kt.id = sk.kleidungstyp_id
                    WHERE sk.style_id = %s
                """, (id,))

                for feature_data in cursor.fetchall():
                    kleidungstyp = Kleidungstyp()
                    kleidungstyp.set_id(feature_data[0])
                    kleidungstyp.set_bezeichnung(feature_data[1])
                    style.add_feature(kleidungstyp)

                return style

            return None

        finally:
            cursor.close()

    def find_by_name(self, name):
        """Auslesen eines Styles anhand des zugeordneten Namens.

        :param name Name des Styles.
        :return Style-Objekt mit dem gesuchten Namen, None wenn nicht gefunden.
        """
        result = None
        cursor = self._cnx.cursor()

        # Zunächst finden wir nur die ID des Styles mit dem gesuchten Namen
        command = "SELECT id FROM style WHERE name=%s"
        cursor.execute(command, (name,))
        tuples = cursor.fetchall()

        try:
            (id,) = tuples[0]
            # Dann nutzen wir find_by_id, um ein vollständiges Objekt zu laden
            result = self.find_by_id(id)
        except IndexError:
            result = None

        cursor.close()
        return result

    def find_all(self):
        """Auslesen aller Styles unseres Systems.

        :return Eine Liste mit Style-Objekten, die sämtliche Styles
                des Systems repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()

        # Wir holen uns nur die IDs aller Styles
        cursor.execute("SELECT id FROM style")
        tuples = cursor.fetchall()

        for (id,) in tuples:
            # Für jede ID laden wir das vollständige Objekt über find_by_id
            style = self.find_by_id(id)
            if style:
                result.append(style)

        cursor.close()
        return result