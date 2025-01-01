from abc import ABC, abstractmethod
import mysql.connector as connector
from contextlib import AbstractContextManager
import os

class Mapper(AbstractContextManager, ABC):
    def __init__(self):
        self.__cnx = None # cnx steht für unsere aufgebaute Verbindung zur Datenbank

    def __enter__(self):

        if os.getenv('GAE_ENV', '').startswith('standard'):
            """Landen wir in diesem Zweig, so haben wir festgestellt, dass der Code in der Cloud abläuft.
            Die App befindet sich somit im **Production Mode** und zwar im *Standard Environment*.
            Hierbei handelt es sich also um die Verbindung zwischen Google App Engine und Cloud SQL."""

            self._cnx = connector.connect(user='root', password='peterthies',
                                          unix_socket='/cloudsql/civil-array-440815-m3:europe-west3:sopra-db-instanz',
                                          database='sopra_db')
        else:
            """Wenn wir hier ankommen, dann handelt sich offenbar um die Ausführung des Codes in einer lokalen Umgebung,
            also auf einem Local Development Server. Hierbei stellen wir eine einfache Verbindung zu einer lokal
            installierten mySQL-Datenbank her."""

            self._cnx = connector.connect(host='localhost', user='root', password='peterthies',
                                          database='sopra_db')

        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._cnx.close()


    @abstractmethod
    def insert(self, obj):
        pass

    @abstractmethod
    def update(self, obj):
        pass

    @abstractmethod
    def delete(self, obj):
        pass

    @abstractmethod
    def find_by_id(self, obj_id):
        pass

    @abstractmethod
    def find_all(self):
        pass