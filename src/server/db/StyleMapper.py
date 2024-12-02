from src.server.db.ImplikationMapper import ImplikationMapper
from src.server.db.KardinalitaetMapper import KardinalitaetMapper
from src.server.db.KleidungstypMapper import KleidungstypMapper
from src.server.db.Mapper import Mapper
from src.server.bo.Style import Style
from src.server.db.MutexMapper import MutexMapper


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

        """Constraints von Style speichern, um sicherzustellen, 
            dass die einzelnen Constraints, die zu einem Style gehören, 
            ebenfalls korrekt in die Datenbank eingefügt werden.

        kardinalitaet_mapper = KardinalitaetMapper(self._cnx)
        for constraint in style.get_constraints():
            constraint.set_style_id(style.get_id())
            kardinalitaet_mapper.insert(constraint)

        mutex_mapper = MutexMapper(self._cnx)
        for constraint in style.get_constraints():
            constraint.set_style_id(style.get_id())
            mutex_mapper.insert(constraint)

        implikation_mapper = ImplikationMapper(self._cnx)
        for constraint in style.get_constraints():
            constraint.set_style_id(style.get_id())
            implikation_mapper.insert(constraint)

        Features von Style speichern, um sicherzustellen, 
        dass die einzelnen Features, die zu einem Style gehören, 
        ebenfalls korrekt in die Datenbank eingefügt werden.

        kleidungstyp_mapper = KleidungstypMapper(self._cnx)
        for feature in style.get_features():
            feature.set_style_id(style.get_id())
            kleidungstyp_mapper.insert(feature) """

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

        """
        kardinalitaet_mapper = KardinalitaetMapper(self._cnx)
        for constraint in style.get_constraints():
            constraint.set_style_id(style.get_id())
            kardinalitaet_mapper.insert(constraint)

        mutex_mapper = MutexMapper(self._cnx)
        for constraint in style.get_constraints():
            constraint.set_style_id(style.get_id())
            mutex_mapper.insert(constraint)

        implikation_mapper = ImplikationMapper(self._cnx)
        for constraint in style.get_constraints():
            constraint.set_style_id(style.get_id())
            implikation_mapper.insert(constraint)

        kleidungstyp_mapper = KleidungstypMapper(self._cnx)
        for feature in style.get_features():
            feature.set_style_id(style.get_id())
            kleidungstyp_mapper.insert(feature)
        """

        self._cnx.commit()
        cursor.close()

    def delete(self, style):
        """Löschen der Daten eines Style-Objekts aus der Datenbank.
        :param style das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM style WHERE id={}".format(style.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def find_by_id(self, style_id):
        """Suchen eines Benutzers mit vorgegebener Style ID. Da diese eindeutig ist,
            wird genau ein Objekt zurückgegeben.

            :param style_id Primärschlüsselattribut (->DB)
            :return Style-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, name FROM style WHERE id={}".format(style_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, name) = tuples[0]
            style = Style()
            style.set_id(id)
            style.set_name(name)
            result = style
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_name(self, name):
        """Auslesen aller Benutzer anhand des zugeordneten namen.

        :param name Name der zugehörigen Benutzer.
        :return Eine Sammlung mit Style-Objekten, die sämtliche Benutzer
            mit dem gewünschten Name enthält.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, name FROM style WHERE name={}".format(name)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, name) = tuples[0]
            style = Style()
            style.set_id(id)
            style.set_name(name)
            result = Style
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    """Wir müssen vorher die Constraint Tabelle definieren.


    def find_by_constraints(self, constraints):
        Auslesen aller Benutzer anhand den zugeordneten Constraints.

        :param constraints Constraints der zugehörigen Benutzer.
        :return Eine Sammlung mit Style-Objekten, die sämtliche Benutzer
            mit den gewünschten Constraints enthält.
        
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, name, constraints, features FROM style WHERE constraints={}".format(constraints)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, name, constraints, features) = tuples[0]
            style = Style()
            style.set_id(id)
            style.set_name(name)
            style.set_constraints(constraints)
            style.set_features(features)
            result = Style
        except IndexError:
            Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt.
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_features(self, features):
        Auslesen aller Benutzer anhand den zugeordneten Features.

        :param features Features der zugehörigen Benutzer.
        :return Eine Sammlung mit Style-Objekten, die sämtliche Benutzer
            mit den gewünschten Features enthält.
        
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, name, constraints, features FROM style WHERE features={}".format(features)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, name, constraints, features) = tuples[0]
            style = Style()
            style.set_id(id)
            style.set_name(name)
            style.set_constraints(constraints)
            style.set_features(features)
            result = Style
        except IndexError:
            Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt.
            result = None

        self._cnx.commit()
        cursor.close()

        return result
        
        """

    def find_all(self):
        """Auslesen aller Benutzer unseres Systems.

        :return Eine Sammlung mit Style-Objekten, die sämtliche Benutzer
        des Systems repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from style")
        tuples = cursor.fetchall()

        for (id, name) in tuples:
            style = Style()
            style.set_id(id)
            style.set_name(name)
            result.append(style)

        self._cnx.commit()
        cursor.close()

        return result