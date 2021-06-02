from pymongo import MongoClient, ReadPreference
from creds import get_creds

MY_CREDS = get_creds()
USERNAME = str(MY_CREDS['username'])
PASSWORD = str(MY_CREDS['password'])

class Processor:
    _mongodb = None

    def __init__(self):
        # self._mongodb = MongoClient('mongodb://pre-mongo1,pre-mongo2,pre-mongo3')
        # self._mongodb = MongoClient('mongodb://pro-mongo1,pro-mongo2,pro-mongo3')
        self._mongodb = MongoClient('mongodb://'+USERNAME+':'+PASSWORD+'@pro-mongo1-new,pro-mongo2-new,pro-mongo3-new')

    def get_db_and_collection(self, db_name, collection_name):
        if self._mongodb is not None:
            return self._mongodb.get_database(db_name).get_collection(
                collection_name,
                read_preference=ReadPreference.SECONDARY
            )
        else:
            raise ValueError('The DB object wasn\'t configured properly!')

    def gather_data(self, collection, query, max_time):
        return collection.aggregate(pipeline=query, maxTimeMS=max_time, useCursor=True)

    def data_processor(self, data):
        for item in data:
            print item
