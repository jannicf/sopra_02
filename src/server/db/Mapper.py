from abc import ABC, abstractmethod

class Mapper(ABC):
    def __init__(self, db_connection):
        self.db_connection = db_connection

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