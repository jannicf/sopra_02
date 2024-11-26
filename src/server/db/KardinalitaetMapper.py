from src.server.bo.Kardinalitaet import Kardinalitaet
from src.server.db.Mapper import Mapper


class KardinalitaetMapper(Mapper):

    def insert(self, kardinalitaet):
        """Einfügen eines Kardinalitaets-Objekts in die Datenbank.

                Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
                berichtigt.

                :param kardinalitaet das zu speichernde Objekt
                :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
                """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM kardinalitaet ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                kardinalitaet.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                kardinalitaet.set_id(1)

        command = "INSERT INTO kardinalitaet (id, min_anzahl, max_anzahl, bezugsobjekt) VALUES (%s,%s,%s,%s)"
        data = (kardinalitaet.get_id(), kardinalitaet.get_min_anzahl(), kardinalitaet.get_max_anzahl(), kardinalitaet.get_bezugsobjekt())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return kardinalitaet

    def update(self, kardinalitaet):
        """Wiederholtes Schreiben eines Kardinalitaets-Objekts in die Datenbank.

                :param kardinalitaet das Objekt, das in die DB geschrieben werden soll
                """
        cursor = self._cnx.cursor()

        command = "UPDATE kardinalitaet " + "SET min_anzahl=%s, max_anzahl=%s, bezugsobjekt=%s WHERE id=%s"
        data = (kardinalitaet.get_min_anzahl(), kardinalitaet.get_max_anzahl(), kardinalitaet.get_bezugsobjekt(), kardinalitaet.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, kardinalitaet):
        """Löschen der Daten eines Kardinalitaets-Objekts aus der Datenbank.

                :param kardinalitaet das aus der DB zu löschende "Objekt"
                """
        cursor = self._cnx.cursor()

        command = "DELETE FROM kardinalitaet WHERE id={}".format(kardinalitaet.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def find_by_id(self, kardinalitaet_id):
        """Suchen einer Kardinalitaet mit vorgegebener ID. Da diese eindeutig ist,
                wird genau ein Objekt zurückgegeben.

                :param kardinalitaet_id Primärschlüsselattribut (->DB)
                :return Kardinalitaets-Objekt, das dem übergebenen Schlüssel entspricht, None bei
                    nicht vorhandenem DB-Tupel.
                """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, min_anzahl, max_anzahl, bezugsobjekt FROM kardinalitaet WHERE id={}".format(kardinalitaet_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, min_anzahl, max_anzahl, bezugsobjekt) = tuples[0]
            kardinalitaet = Kardinalitaet()
            kardinalitaet.set_id(id)
            kardinalitaet.set_min_anzahl(min_anzahl)
            kardinalitaet.set_max_anzahl(max_anzahl)
            kardinalitaet.set_bezugsobjekt(bezugsobjekt)
            result = kardinalitaet
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result


    def find_all_bezugsobjekt(self, bezugsobjekt):
        """Suchen aller Kardinalitäten mit einem bestimmten Bezugsobjekt.

            :param bezugsobjekt: Das Bezugsobjekt nach dem gesucht werden soll
            :return Eine Liste mit Kardinalitaets-Objekten, die dem übergebenen Bezugsobjekt
                    zugeordnet sind.
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, min_anzahl, max_anzahl, bezugsobjekt FROM kardinalitaet WHERE bezugsobjekt={}".format(
            bezugsobjekt)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, min_anzahl, max_anzahl, bezugsobjekt) in tuples:
            kardinalitaet = Kardinalitaet()
            kardinalitaet.set_id(id)
            kardinalitaet.set_min_anzahl(min_anzahl)
            kardinalitaet.set_max_anzahl(max_anzahl)
            kardinalitaet.set_bezugsobjekt(bezugsobjekt)
            result.append(kardinalitaet)

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Kardinalitaets-Objekte unseres Systems.

                :return Eine Sammlung mit Kardinalitaets-Objekten, die sämtliche Kardinalitaets-Constraints
                        des Systems repräsentieren.
                """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from kardinalitaet")
        tuples = cursor.fetchall()

        for (id, min_anzahl, max_anzahl, bezugsobjekt) in tuples:
            kardinalitaet = Kardinalitaet()
            kardinalitaet.set_id(id)
            kardinalitaet.set_min_anzahl(min_anzahl)
            kardinalitaet.set_max_anzahl(max_anzahl)
            kardinalitaet.set_bezugsobjekt(bezugsobjekt)
            result.append(kardinalitaet)

        self._cnx.commit()
        cursor.close()

        return result