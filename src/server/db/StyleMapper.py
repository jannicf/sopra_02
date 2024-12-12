from src.server.db.Mapper import Mapper
from src.server.bo.Style import Style
from src.server.bo.Kardinalitaet import Kardinalitaet
from src.server.bo.Mutex import Mutex
from src.server.bo.Implikation import Implikation
from src.server.bo.Kleidungstyp import Kleidungstyp

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

        command = "INSERT INTO style (id, name) VALUES (%s,%s)"
        data = (style.get_id(), style.get_name())
        cursor.execute(command, data)

        features = style.get_features()
        if features:
            for feature in features:
                command = "INSERT INTO style_kleidungstyp (style_id, kleidungstyp_id) VALUES (%s, %s)"
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
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param style das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE style " + "SET name=%s WHERE id=%s"
        data = (style.get_name(), style.get_id())
        cursor.execute(command, data)

        # Features (Kleidungstypen) aktualisieren
        # Zuerst vorhandene Verknüpfungen löschen
        delete_command = "DELETE FROM style_kleidungstyp WHERE style_id=%s"
        cursor.execute(delete_command, (style.get_id(),))

        # Neue Features einfügen
        features = style.get_features()
        if features:
            for feature in features:
                feature_command = "INSERT INTO style_kleidungstyp (style_id, kleidungstyp_id) VALUES (%s, %s)"
                feature_data = (style.get_id(), feature.get_id())
                cursor.execute(feature_command, feature_data)

        # Constraints aktualisieren
        # Zuerst vorhandene Verknüpfungen löschen
        delete_command2 = "DELETE FROM kardinalitaet WHERE style_id=%s"
        cursor.execute(delete_command2, (style.get_id(),))
        delete_command3 = "DELETE FROM mutex WHERE style_id=%s"
        cursor.execute(delete_command3, (style.get_id(),))
        delete_command4 = "DELETE FROM implikation WHERE style_id=%s"
        cursor.execute(delete_command4, (style.get_id(),))

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
            :return Style-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """
        result = None
        cursor = self._cnx.cursor()

        # Style-Basisdaten laden
        command = "SELECT id, name FROM style WHERE id=%s"
        cursor.execute(command, (style_id,))
        tuples = cursor.fetchall()

        try:
            (id, name) = tuples[0]
            style = Style()
            style.set_id(id)
            style.set_name(name)

            # Kleidungstypen mit einem JOIN laden
            feature_command = """
                SELECT kleidungstyp.id, kleidungstyp.bezeichnung
                FROM kleidungstyp 
                JOIN style_kleidungstyp ON kleidungstyp.id = style_kleidungstyp.kleidungstyp_id
                WHERE style_kleidungstyp.style_id = %s
            """
            cursor.execute(feature_command, (id,))
            feature_tuples = cursor.fetchall()

            # Kleidungstypen direkt erstellen und zuweisen
            for (kleidungstyp_id, kleidungstyp_bezeichnung) in feature_tuples:
                kleidungstyp = Kleidungstyp()
                kleidungstyp.set_id(kleidungstyp_id)
                kleidungstyp.set_bezeichnung(kleidungstyp_bezeichnung)
                style.add_feature(kleidungstyp)

            # Kardinalitäten laden
            kardinalitaet_command = """
                SELECT kardinalitaet.id, kardinalitaet.min_anzahl, kardinalitaet.max_anzahl, 
                kardinalitaet.bezugsobjekt_id
                FROM kardinalitaet 
                WHERE kardinalitaet.style_id = %s
            """
            cursor.execute(kardinalitaet_command, (id,))
            kardinalitaet_tuples = cursor.fetchall()

            for (kardinalitaet_id, min_anzahl, max_anzahl, bezugsobjekt_id) in kardinalitaet_tuples:
                kardinalitaet = Kardinalitaet()
                kardinalitaet.set_id(kardinalitaet_id)
                kardinalitaet.set_min_anzahl(min_anzahl)
                kardinalitaet.set_max_anzahl(max_anzahl)
                # Bezugsobjekt setzen
                kleidungstyp = Kleidungstyp()
                kleidungstyp.set_id(bezugsobjekt_id)
                kardinalitaet.set_bezugsobjekt(kleidungstyp)
                kardinalitaet.set_style(style)
                style.add_constraint(kardinalitaet)

            # Mutex laden
            mutex_command = """
                SELECT mutex.id, mutex.bezugsobjekt1_id, mutex.bezugsobjekt2_id
                FROM mutex 
                WHERE mutex.style_id = %s
            """
            cursor.execute(mutex_command, (id,))
            mutex_tuples = cursor.fetchall()

            for (mutex_id, bezugsobjekt1_id, bezugsobjekt2_id) in mutex_tuples:
                mutex = Mutex()
                mutex.set_id(mutex_id)
                # Bezugsobjekte setzen
                bezugsobjekt1 = Kleidungstyp()
                bezugsobjekt1.set_id(bezugsobjekt1_id)
                bezugsobjekt2 = Kleidungstyp()
                bezugsobjekt2.set_id(bezugsobjekt2_id)
                mutex.set_bezugsobjekt1(bezugsobjekt1)
                mutex.set_bezugsobjekt2(bezugsobjekt2)
                mutex.set_style(style)
                style.add_constraint(mutex)

            # Implikationen laden
            implikation_command = """
                SELECT implikation.id, implikation.bezugsobjekt1_id, implikation.bezugsobjekt2_id
                FROM implikation 
                WHERE implikation.style_id = %s
            """
            cursor.execute(implikation_command, (id,))
            implikation_tuples = cursor.fetchall()

            for (implikation_id, bezugsobjekt1_id, bezugsobjekt2_id) in implikation_tuples:
                implikation = Implikation()
                implikation.set_id(implikation_id)
                # Bezugsobjekte setzen
                bezugsobjekt1 = Kleidungstyp()
                bezugsobjekt1.set_id(bezugsobjekt1_id)
                bezugsobjekt2 = Kleidungstyp()
                bezugsobjekt2.set_id(bezugsobjekt2_id)
                implikation.set_bezugsobjekt1(bezugsobjekt1)
                implikation.set_bezugsobjekt2(bezugsobjekt2)
                implikation.set_style(style)
                style.add_constraint(implikation)

            result = style

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