from server.db.Mapper import Mapper
from server.bo.Style import Style
from server.bo.Kardinalitaet import Kardinalitaet
from server.bo.Mutex import Mutex
from server.bo.Implikation import Implikation
from server.bo.Kleidungstyp import Kleidungstyp

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
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Style-Objekt zu."""
                style.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                style.set_id(1)

        command = "INSERT INTO style (id, name, kleiderschrank_id) VALUES (%s,%s)"
        data = (style.get_id(), style.get_name(), style.get_kleiderschrank_id())
        cursor.execute(command, data)

        features = style.get_features()
        if features:
            for feature in style.get_features():
                command = "INSERT INTO style_kleidungstyp (style_id, kleidungstyp_id) VALUES (%s,%s)"
                data = (style.get_id(), feature.get_id())
                cursor.execute(command, data)

        # Constraints einfügen
        constraints = style.get_constraints()
        if constraints:
            for constraint in constraints:
                constraint.set_style(style)
                if isinstance(constraint, Kardinalitaet):
                    command = """INSERT INTO kardinalitaet 
                        (id, min_anzahl, max_anzahl, bezugsobjekt_id, style_id) 
                        VALUES (%s, %s, %s, %s, %s)"""
                    data = (constraint.get_id(), constraint.get_min_anzahl(),
                            constraint.get_max_anzahl(), constraint.get_bezugsobjekt().get_id(),
                            style.get_id())
                    cursor.execute(command, data)

                elif isinstance(constraint, Mutex):
                    command = """INSERT INTO mutex 
                        (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) 
                        VALUES (%s, %s, %s, %s)"""
                    data = (constraint.get_id(), constraint.get_bezugsobjekt1().get_id(),
                            constraint.get_bezugsobjekt2().get_id(), style.get_id())
                    cursor.execute(command, data)

                elif isinstance(constraint, Implikation):
                    command = """INSERT INTO implikation 
                        (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) 
                        VALUES (%s, %s, %s, %s)"""
                    data = (constraint.get_id(), constraint.get_bezugsobjekt1().get_id(),
                            constraint.get_bezugsobjekt2().get_id(), style.get_id())
                    cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return style

    def update(self, style):
        """Wiederholtes Schreiben eines Style-Objekts in die Datenbank.
        :param style das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE style " + "SET name=%s, kleiderschrank_id=%s WHERE id=%s"
        data = (style.get_name(), style.get_id(), style.get_kleiderschrank_id())
        cursor.execute(command, data)

        # Alte Feature löschen
        delete_command = "DELETE FROM style_kleidungstyp WHERE style_id=%s"
        cursor.execute(delete_command, (style.get_id(),))

        # Neue Feature erstellen
        for feature in style.get_features():
            insert_command = "INSERT INTO style_kleidungstyp (style_id, kleidungstyp_id) VALUES (%s, %s)"
            cursor.execute(insert_command, (style.get_id(), feature.get_id()))

        # Alte Constraints löschen
        cursor.execute("DELETE FROM kardinalitaet WHERE style_id=%s", (style.get_id(),))
        cursor.execute("DELETE FROM mutex WHERE style_id=%s", (style.get_id(),))
        cursor.execute("DELETE FROM implikation WHERE style_id=%s", (style.get_id(),))

        # Neue Constraints einfügen
        for constraint in style.get_constraints():
            if isinstance(constraint, Kardinalitaet):
                command = """INSERT INTO kardinalitaet 
                    (id, min_anzahl, max_anzahl, bezugsobjekt_id, style_id) 
                    VALUES (%s, %s, %s, %s, %s)"""
                data = (constraint.get_id(), constraint.get_min_anzahl(),
                        constraint.get_max_anzahl(), constraint.get_bezugsobjekt().get_id(),
                        style.get_id())
                cursor.execute(command, data)

            elif isinstance(constraint, Mutex):
                command = """INSERT INTO mutex 
                    (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) 
                    VALUES (%s, %s, %s, %s)"""
                data = (constraint.get_id(), constraint.get_bezugsobjekt1().get_id(),
                        constraint.get_bezugsobjekt2().get_id(), style.get_id())
                cursor.execute(command, data)

            elif isinstance(constraint, Implikation):
                command = """INSERT INTO implikation 
                    (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) 
                    VALUES (%s, %s, %s, %s)"""
                data = (constraint.get_id(), constraint.get_bezugsobjekt1().get_id(),
                        constraint.get_bezugsobjekt2().get_id(), style.get_id())
                cursor.execute(command, data)

        self._cnx.commit()
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

    def find_by_id(self, style_id):
        """Suchen eines Styles mit vorgegebener ID. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param style_id Primärschlüsselattribut (->DB)
        :return Style-Objekt, das dem übergebenen Schlüssel entspricht
        """
        result = None
        cursor = self._cnx.cursor()

        # Style-Basisdaten laden
        command = "SELECT id, name, kleiderschrank_id FROM style WHERE id=%s"
        cursor.execute(command, (style_id,))
        tuples = cursor.fetchall()

        try:
            (id, name, kleiderschrank_id) = tuples[0]
            style = Style()
            style.set_id(id)
            style.set_name(name)
            style.set_kleiderschrank_id(kleiderschrank_id)

            # Features (Kleidungstypen) laden
            cursor.execute("""
                        SELECT kt.id, kt.bezeichnung 
                        FROM kleidungstyp kt
                        JOIN style_kleidungstyp sk ON kt.id = sk.kleidungstyp_id
                        WHERE sk.style_id = %s
                    """, (id,))

            for (kt_id, bezeichnung) in cursor.fetchall():
                kleidungstyp = Kleidungstyp()
                kleidungstyp.set_id(kt_id)
                kleidungstyp.set_bezeichnung(bezeichnung)
                style.add_feature(kleidungstyp)

            # Kardinalitäten laden
            cursor.execute("""
                        SELECT k.id, k.min_anzahl, k.max_anzahl, kt.id, kt.bezeichnung
                        FROM kardinalitaet k
                        JOIN kleidungstyp kt ON k.bezugsobjekt_id = kt.id
                        WHERE k.style_id = %s
                    """, (id,))

            for (k_id, min_anzahl, max_anzahl, bezugsobjekt_id, bezeichnung) in cursor.fetchall():
                kard = Kardinalitaet()
                kard.set_id(k_id)
                kard.set_min_anzahl(min_anzahl)
                kard.set_max_anzahl(max_anzahl)

                bezugsobjekt = Kleidungstyp()
                bezugsobjekt.set_id(bezugsobjekt_id)
                bezugsobjekt.set_bezeichnung(bezeichnung)
                kard.set_bezugsobjekt(bezugsobjekt)
                kard.set_style(style)
                style.add_constraint(kard)

            # Mutex laden
            cursor.execute("""
                        SELECT m.id, 
                               kt1.id as kt1_id, kt1.bezeichnung as kt1_bez,
                               kt2.id as kt2_id, kt2.bezeichnung as kt2_bez
                        FROM mutex m
                        JOIN kleidungstyp kt1 ON m.bezugsobjekt1_id = kt1.id
                        JOIN kleidungstyp kt2 ON m.bezugsobjekt2_id = kt2.id
                        WHERE m.style_id = %s
                    """, (id,))

            for (m_id, kt1_id, kt1_bez, kt2_id, kt2_bez) in cursor.fetchall():
                mutex = Mutex()
                mutex.set_id(m_id)

                bezugsobjekt1 = Kleidungstyp()
                bezugsobjekt1.set_id(kt1_id)
                bezugsobjekt1.set_bezeichnung(kt1_bez)
                mutex.set_bezugsobjekt1(bezugsobjekt1)

                bezugsobjekt2 = Kleidungstyp()
                bezugsobjekt2.set_id(kt2_id)
                bezugsobjekt2.set_bezeichnung(kt2_bez)
                mutex.set_bezugsobjekt2(bezugsobjekt2)

                mutex.set_style(style)
                style.add_constraint(mutex)

            # Implikationen laden
            cursor.execute("""
                        SELECT i.id,
                               kt1.id as kt1_id, kt1.bezeichnung as kt1_bez,
                               kt2.id as kt2_id, kt2.bezeichnung as kt2_bez
                        FROM implikation i
                        JOIN kleidungstyp kt1 ON i.bezugsobjekt1_id = kt1.id
                        JOIN kleidungstyp kt2 ON i.bezugsobjekt2_id = kt2.id
                        WHERE i.style_id = %s
                    """, (id,))

            for (i_id, kt1_id, kt1_bez, kt2_id, kt2_bez) in cursor.fetchall():
                impl = Implikation()
                impl.set_id(i_id)

                bezugsobjekt1 = Kleidungstyp()
                bezugsobjekt1.set_id(kt1_id)
                bezugsobjekt1.set_bezeichnung(kt1_bez)
                impl.set_bezugsobjekt1(bezugsobjekt1)

                bezugsobjekt2 = Kleidungstyp()
                bezugsobjekt2.set_id(kt2_id)
                bezugsobjekt2.set_bezeichnung(kt2_bez)
                impl.set_bezugsobjekt2(bezugsobjekt2)

                impl.set_style(style)
                style.add_constraint(impl)

            result = style

            return result

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()
        return result

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