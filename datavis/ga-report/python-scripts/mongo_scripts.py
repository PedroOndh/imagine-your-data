"""Mongo Helper Sripts"""
from pymongo import MongoClient, ReadPreference


class Processor:
    """Processer Class with Scripts to establish a connection to a specific Mongo Cluster"""
    _mongodb = None

    def __init__(self):
        self._mongodb = MongoClient('mongodb://pre-mongo1,pre-mongo2,pre-mongo3')

    def get_db_and_collection(self, db_name, collection_name):
        """gets specific database and collection"""
        if self._mongodb is not None:
            return self._mongodb.get_database(db_name).get_collection(
                collection_name,
                read_preference=ReadPreference.SECONDARY
            )
        else:
            raise ValueError('The DB object wasn\'t configured properly!')
