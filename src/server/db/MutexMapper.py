from src.server.db.Mapper import Mapper
from src.server.bo.Mutex import Mutex

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

        command = "INSERT INTO mutex (id, bezugsobjekt1, bezugsobjekt2) VALUES (%s,%s,%s)"
        data = (mutex.get_id(), mutex.get_bezugsobjekt1(), mutex.get_bezugsobjekt2())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return mutex

    def update(self, mutex):
        """Wiederholtes Schreiben eines Mutex-Objekts in die Datenbank.

                :param mutex das Objekt, das in die DB geschrieben werden soll
                """
        cursor = self._cnx.cursor()

        command = "UPDATE mutex " + "SET bezugsobjekt1=%s, bezugsobjekt2=%s WHERE id=%s"
        data = (mutex.get_bezugsobjekt1(), mutex.get_bezugsobjekt2(), mutex.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, mutex):
        """Löschen der Daten eines Mutex-Objekts aus der Datenbank.

                :param mutex das aus der DB zu löschende "Objekt"
                """
        cursor = self._cnx.cursor()

        command = "DELETE FROM mutex WHERE id={}".format(mutex.get_id())
        cursor.execute(command)

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
        command = "SELECT id, bezugsobjekt1, bezugsobjekt2 FROM mutex WHERE id={}".format(mutex_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, bezugsobjekt1, bezugsobjekt2) = tuples[0]
            mutex = Mutex()
            mutex.set_id(id)
            mutex.set_bezugsobjekt1(bezugsobjekt1)
            mutex.set_bezugsobjekt2(bezugsobjekt2)
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

        command = ("SELECT id, bezugsobjekt1, bezugsobjekt2 FROM mutex "
                   "WHERE bezugsobjekt1={} OR bezugsobjekt2={}").format(bezugsobjekt, bezugsobjekt)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, bezugsobjekt1, bezugsobjekt2) in tuples:
            mutex = Mutex()
            mutex.set_id(id)
            mutex.set_bezugsobjekt1(bezugsobjekt1)
            mutex.set_bezugsobjekt2(bezugsobjekt2)
            result.append(mutex)

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Mutex-Objekte unseres Systems.

                :return Eine Sammlung mit Mutex-Objekten, die sämtliche Mutex-Constraints
                        des Systems repräsentieren.
                """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from mutex")
        tuples = cursor.fetchall()

        for (id, bezugsobjekt1, bezugsobjekt2) in tuples:
            mutex = Mutex()
            mutex.set_id(id)
            mutex.set_bezugsobjekt1(bezugsobjekt1)
            mutex.set_bezugsobjekt2(bezugsobjekt2)
            result.append(mutex)

        self._cnx.commit()
        cursor.close()

        return result