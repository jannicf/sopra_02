from src.server.db.Mapper import Mapper
from src.server.bo.Mutex import Mutex
from src.server.db.KleidungstypMapper import KleidungstypMapper
from src.server.db.StyleMapper import StyleMapper
from src.server.bo.Kleidungstyp import Kleidungstyp
from src.server.bo.Style import Style

class MutexMapper(Mapper):

    def insert(self, mutex):
        """Einfügen eines Mutex-Objekts in die Datenbank.

                Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
                berichtigt.

                :param mutex das zu speichernde Objekt
                :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
                """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM mutex ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Mutex-Objekt zu."""
                mutex.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                mutex.set_id(1)

        command = "INSERT INTO mutex (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) VALUES (%s,%s,%s,%s)"
        data = (mutex.get_id(), mutex.get_bezugsobjekt1().get_id(), mutex.get_bezugsobjekt2().get_id(),
                mutex.get_style().get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return mutex

    def update(self, mutex):
        """Wiederholtes Schreiben eines Mutex-Objekts in die Datenbank.

                :param mutex das Objekt, das in die DB geschrieben werden soll
                """
        cursor = self._cnx.cursor()

        command = "UPDATE mutex SET bezugsobjekt1_id=%s, bezugsobjekt2_id=%s, style_id=%s WHERE id=%s"
        data = (mutex.get_bezugsobjekt1().get_id(), mutex.get_bezugsobjekt2().get_id(), mutex.get_style().get_id(),
                mutex.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, mutex):
        """Löschen der Daten eines Mutex-Objekts aus der Datenbank.

                :param mutex das aus der DB zu löschende "Objekt"
                """
        cursor = self._cnx.cursor()

        command = "DELETE FROM mutex WHERE id=%s"
        cursor.execute(command, (mutex.get_id(),))

        self._cnx.commit()
        cursor.close()

    def find_by_id(self, mutex_id):
        """Suchen einer Mutex mit vorgegebener ID. Da diese eindeutig ist,
                wird genau ein Objekt zurückgegeben.

                :param mutex_id Primärschlüsselattribut (->DB)
                :return Mutex-Objekt, das dem übergebenen Schlüssel entspricht, None bei
                    nicht vorhandenem DB-Tupel.
                """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, bezugsobjekt1_id, bezugsobjekt2_id, style_id FROM mutex WHERE id=%s"
        cursor.execute(command, (mutex_id,))
        tuples = cursor.fetchall()

        try:
            (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) = tuples[0]
            mutex = Mutex()
            mutex.set_id(id)
            # Lade die zugehörigen Kleidungstyp-Objekte separat aus der Datenbank
            with KleidungstypMapper() as kleidungstyp_mapper:
                bezugsobjekt1 = kleidungstyp_mapper.find_by_id(bezugsobjekt1_id)
                bezugsobjekt2 = kleidungstyp_mapper.find_by_id(bezugsobjekt2_id)
            mutex.set_bezugsobjekt1(bezugsobjekt1)
            mutex.set_bezugsobjekt2(bezugsobjekt2)

            # Lade das zugehörige Style-Objekt separat aus der Datenbank
            with StyleMapper() as style_mapper:
                style = style_mapper.find_by_id(style_id)
            mutex.set_style(style)
            result = mutex
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_any_bezugsobjekt(self, bezugsobjekt):
        """Suchen aller Mutex-Objekte, die ein bestimmtes Bezugsobjekt enthalten.

        :param bezugsobjekt: Das Bezugsobjekt nach dem gesucht werden soll
        :return: Eine Liste mit Mutex-Objekten
        """
        result = []
        cursor = self._cnx.cursor()

        command = ("SELECT id, bezugsobjekt1_id, bezugsobjekt2_id, style_id FROM mutex "
                   "WHERE bezugsobjekt1_id=%s OR bezugsobjekt2_id=%s")
        cursor.execute(command, (bezugsobjekt.get_id(), bezugsobjekt.get_id()))
        tuples = cursor.fetchall()

        for (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) in tuples:
            mutex = Mutex()
            mutex.set_id(id)
            # Lade die zugehörigen Kleidungstyp-Objekte separat aus der Datenbank
            with KleidungstypMapper() as kleidungstyp_mapper:
                bezugsobjekt1 = kleidungstyp_mapper.find_by_id(bezugsobjekt1_id)
                bezugsobjekt2 = kleidungstyp_mapper.find_by_id(bezugsobjekt2_id)
            mutex.set_bezugsobjekt1(bezugsobjekt1)
            mutex.set_bezugsobjekt2(bezugsobjekt2)

            # Lade das zugehörige Style-Objekt separat aus der Datenbank
            with StyleMapper() as style_mapper:
                style = style_mapper.find_by_id(style_id)
            mutex.set_style(style)
            result.append(mutex)

        self._cnx.commit()
        cursor.close()

        return result

    def find_all_style(self, style):
        """Suchen aller Mutex-Constraints, die einem bestimmten Style zugeordnet sind.

        :param style: Das Style-Objekt, nach dessen Mutex-Constraints gesucht werden soll
        :return Eine Liste mit Mutex-Objekten, die dem übergebenen Style
                zugeordnet sind.
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, bezugsobjekt1_id, bezugsobjekt2_id, style_id FROM mutex WHERE style_id=%s"
        cursor.execute(command, (style.get_id(),))
        tuples = cursor.fetchall()

        for (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) in tuples:
            mutex = Mutex()
            mutex.set_id(id)

            # Lade die zugehörigen Kleidungstyp-Objekte separat
            with KleidungstypMapper() as kleidungstyp_mapper:
                bezugsobjekt1 = kleidungstyp_mapper.find_by_id(bezugsobjekt1_id)
                bezugsobjekt2 = kleidungstyp_mapper.find_by_id(bezugsobjekt2_id)
            mutex.set_bezugsobjekt1(bezugsobjekt1)
            mutex.set_bezugsobjekt2(bezugsobjekt2)

            # Style setzen
            mutex.set_style(style)

            result.append(mutex)

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, bezugsobjekt1_id, bezugsobjekt2_id, style_id FROM mutex"
        cursor.execute(command)

        tuples = cursor.fetchall()
        for (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) in tuples:
            mutex = Mutex()
            mutex.set_id(id)

            # Wandelt bezugsobjekt1 in Kleidungstyp um
            bezugsobjekt1 = Kleidungstyp()
            bezugsobjekt1.set_id(bezugsobjekt1_id)
            mutex.set_bezugsobjekt1(bezugsobjekt1)

            # Wandelt bezugsobjekt2 in Kleidungstyp um
            bezugsobjekt2 = Kleidungstyp()
            bezugsobjekt2.set_id(bezugsobjekt2_id)
            mutex.set_bezugsobjekt2(bezugsobjekt2)

            # Wandelt style in Style um
            style = Style()
            style.set_id(style_id)
            mutex.set_style(style)

            result.append(mutex)

        self._cnx.commit()
        cursor.close()
        return result

