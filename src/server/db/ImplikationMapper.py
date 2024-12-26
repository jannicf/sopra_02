from src.server.db.Mapper import Mapper
from src.server.bo.Implikation import Implikation
from src.server.db.KleidungstypMapper import KleidungstypMapper
from src.server.db.StyleMapper import StyleMapper

class ImplikationMapper(Mapper):

    def insert(self, implikation):
        """Einfügen eines Implikations-Objekts in die Datenbank.

                Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
                berichtigt.

                :param implikation das zu speichernde Objekt
                :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
                """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM implikation ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem Implikations-Objekt zu."""
                implikation.set_id(maxid[0] + 1)
            else:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                implikation.set_id(1)

        command = "INSERT INTO implikation (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) VALUES (%s,%s,%s,%s)"
        data = (implikation.get_id(), implikation.get_bezugsobjekt1().get_id(), implikation.get_bezugsobjekt2().get_id(),
                implikation.get_style().get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return implikation

    def update(self, implikation):
        """Wiederholtes Schreiben eines Implikations-Objekts in die Datenbank.

                :param implikation das Objekt, das in die DB geschrieben werden soll
                """
        cursor = self._cnx.cursor()

        command = "UPDATE implikation SET bezugsobjekt1_id=%s, bezugsobjekt2_id=%s, style_id=%s WHERE id=%s"
        data = (implikation.get_bezugsobjekt1().get_id(), implikation.get_bezugsobjekt2().get_id(),
                implikation.get_style().get_id(), implikation.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, implikation):
        """Löschen der Daten eines Implikations-Objekts aus der Datenbank.

                :param implikation das aus der DB zu löschende "Objekt"
                """
        cursor = self._cnx.cursor()

        command = "DELETE FROM implikation WHERE id=%s"
        cursor.execute(command, (implikation.get_id(),))

        self._cnx.commit()
        cursor.close()

    def find_by_id(self, implikation_id):
        """Suchen einer Implikation mit vorgegebener ID. Da diese eindeutig ist,
                wird genau ein Objekt zurückgegeben.

                :param implikation_id Primärschlüsselattribut (->DB)
                :return Implikations-Objekt, das dem übergebenen Schlüssel entspricht, None bei
                    nicht vorhandenem DB-Tupel.
                """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, bezugsobjekt1_id, bezugsobjekt2_id, style_id FROM implikation WHERE id=%s"
        cursor.execute(command, (implikation_id,))
        tuples = cursor.fetchall()

        try:
            (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) = tuples[0]
            implikation = Implikation()
            implikation.set_id(id)
            # Lade die zugehörigen Kleidungstyp-Objekte separat aus der Datenbank
            with KleidungstypMapper() as kleidungstyp_mapper:
                bezugsobjekt1 = kleidungstyp_mapper.find_by_id(bezugsobjekt1_id)
                bezugsobjekt2 = kleidungstyp_mapper.find_by_id(bezugsobjekt2_id)
            implikation.set_bezugsobjekt1(bezugsobjekt1)
            implikation.set_bezugsobjekt2(bezugsobjekt2)

            # Lade das zugehörige Style-Objekt separat aus der Datenbank
            with StyleMapper() as style_mapper:
                style = style_mapper.find_by_id(style_id)
            implikation.set_style(style)
            result = implikation
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_any_bezugsobjekt(self, bezugsobjekt):
        """Suchen aller Implikations-Objekte, die ein bestimmtes Bezugsobjekt enthalten.

        :param bezugsobjekt: Das Bezugsobjekt nach dem gesucht werden soll
        :return: Eine Liste mit Implikations-Objekten
        """
        result = []
        cursor = self._cnx.cursor()

        command = ("SELECT id, bezugsobjekt1_id, bezugsobjekt2_id, style_id FROM implikation "
                   "WHERE bezugsobjekt1_id=%s OR bezugsobjekt2_id=%s")
        cursor.execute(command, (bezugsobjekt.get_id(), bezugsobjekt.get_id()))
        tuples = cursor.fetchall()

        for (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) in tuples:
            implikation = Implikation()
            implikation.set_id(id)
            # Lade die zugehörigen Kleidungstyp-Objekte separat aus der Datenbank
            with KleidungstypMapper() as kleidungstyp_mapper:
                bezugsobjekt1 = kleidungstyp_mapper.find_by_id(bezugsobjekt1_id)
                bezugsobjekt2 = kleidungstyp_mapper.find_by_id(bezugsobjekt2_id)
            implikation.set_bezugsobjekt1(bezugsobjekt1)
            implikation.set_bezugsobjekt2(bezugsobjekt2)

            # Lade das zugehörige Style-Objekt separat aus der Datenbank
            with StyleMapper() as style_mapper:
                style = style_mapper.find_by_id(style_id)
            implikation.set_style(style)
            result.append(implikation)

        self._cnx.commit()
        cursor.close()

        return result

    def find_all_style(self, style):
        """Suchen aller Implikations-Constraints, die einem bestimmten Style zugeordnet sind.

        :param style: Das Style-Objekt, nach dessen Implikations-Constraints gesucht werden soll
        :return Eine Liste mit Implikations-Objekten, die dem übergebenen Style
                zugeordnet sind.
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, bezugsobjekt1_id, bezugsobjekt2_id, style_id FROM implikation WHERE style_id=%s"
        cursor.execute(command, (style.get_id(),))
        tuples = cursor.fetchall()

        for (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) in tuples:
            implikation = Implikation()
            implikation.set_id(id)

            # Lade die zugehörigen Kleidungstyp-Objekte separat
            with KleidungstypMapper() as kleidungstyp_mapper:
                bezugsobjekt1 = kleidungstyp_mapper.find_by_id(bezugsobjekt1_id)
                bezugsobjekt2 = kleidungstyp_mapper.find_by_id(bezugsobjekt2_id)
            implikation.set_bezugsobjekt1(bezugsobjekt1)
            implikation.set_bezugsobjekt2(bezugsobjekt2)

            # Style setzen
            implikation.set_style(style)

            result.append(implikation)

        self._cnx.commit()
        cursor.close()

        return result

    def find_all(self):
        """Auslesen aller Implikations-Objekte unseres Systems.

                :return Eine Sammlung mit Implikations-Objekten, die sämtliche Implikations-Constraints
                        des Systems repräsentieren.
                """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from implikation")
        tuples = cursor.fetchall()

        for (id, bezugsobjekt1_id, bezugsobjekt2_id, style_id) in tuples:
            implikation = Implikation()
            implikation.set_id(id)
            # Lade die zugehörigen Kleidungstyp-Objekte separat aus der Datenbank
            with KleidungstypMapper() as kleidungstyp_mapper:
                bezugsobjekt1 = kleidungstyp_mapper.find_by_id(bezugsobjekt1_id)
                bezugsobjekt2 = kleidungstyp_mapper.find_by_id(bezugsobjekt2_id)
            implikation.set_bezugsobjekt1(bezugsobjekt1)
            implikation.set_bezugsobjekt2(bezugsobjekt2)

            # Lade das zugehörige Style-Objekt separat aus der Datenbank
            if style_id:
                with StyleMapper() as style_mapper:
                    style = style_mapper.find_by_id(style_id)
                    if style:
                        implikation.set_style(style)
            implikation.set_style(style)
            result.append(implikation)

        self._cnx.commit()
        cursor.close()

        return result