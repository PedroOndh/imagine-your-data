"""Script to Query Google Analytics Data for a specific date range and client"""
import sys
from datetime import datetime
import mongo_scripts as mongo_scripts
import pandas as pd

START_DATE = datetime.strptime(sys.argv[1], "%Y-%m-%d")
END_DATE = datetime.strptime(sys.argv[2], "%Y-%m-%d")
CLIENT = sys.argv[3]



GA_SESSION_QUERY = {
    "name": 'ga_search_sessions',
    "ga_search_sessions": [{
        "$match": {
            "date": {
                "$gt": START_DATE,
                "$lt": END_DATE
            }
        }
    }, {
        "$group": {
            "_id": {
                "search_used": "$search_used",
                "device_category": "$device_category"
            },
            "sessions": {
                "$sum": "$sessions"
            },
            "transactions": {
                "$sum": "$transactions"
            }
        }
    }]
}

print 'Querying Data Totals...'
PROC = mongo_scripts.Processor()
COLL = PROC.get_db_and_collection(
    CLIENT, GA_SESSION_QUERY['name'])
DATA = COLL.aggregate(
    pipeline=GA_SESSION_QUERY['ga_search_sessions'],
    maxTimeMS=480000,
    useCursor=True,
    allowDiskUse=True
)
print 'Querying Data Totals completed.'

print 'Formatting Data Totals...'
FORMATTED_DATA_SESSIONS = []
FORMATTED_DATA_TRANSACTIONS = []
FORMATTED_DATA_CONTEXT = []

for row in list(DATA):
    FORMATTED_DATA_SESSIONS.append(row['sessions'])
    FORMATTED_DATA_TRANSACTIONS.append(row['transactions'])
    FORMATTED_DATA_CONTEXT.append(row['_id'])


DEVICE_FRAME = pd.DataFrame(FORMATTED_DATA_CONTEXT)
DEVICE_FRAME['sessions'] = pd.DataFrame(FORMATTED_DATA_SESSIONS)[0]
DEVICE_FRAME['transactions'] = pd.DataFrame(FORMATTED_DATA_TRANSACTIONS)[0]

DEVICE_FRAME.loc[DEVICE_FRAME['search_used'] == 'Visits With Site Search', 'search_used'] = 'with'
DEVICE_FRAME.loc[
    DEVICE_FRAME['search_used'] == 'Visits Without Site Search',
    'search_used'
] = 'without'
DEVICE_FRAME.loc[DEVICE_FRAME['device_category'] == 'tablet', 'device_category'] = 'Tablet'
DEVICE_FRAME.loc[DEVICE_FRAME['device_category'] == 'mobile', 'device_category'] = 'Mobile'
DEVICE_FRAME.loc[DEVICE_FRAME['device_category'] == 'desktop', 'device_category'] = 'Desktop'

DEVICE_FRAME['search_type'] = DEVICE_FRAME['search_used']
DEVICE_FRAME['device_type'] = DEVICE_FRAME['device_category']
DEVICE_FRAME['visits'] = DEVICE_FRAME['sessions']

del DEVICE_FRAME['search_used']
del DEVICE_FRAME['device_category']
del DEVICE_FRAME['sessions']

TOTAL_FRAME = DEVICE_FRAME.groupby(['search_type'])['visits', 'transactions'].sum().reset_index()
TOTAL_FRAME['device_type'] = 'All'

MERGED_FRAME = pd.concat([DEVICE_FRAME, TOTAL_FRAME])

MERGED_FRAME['conversion_rate'] = (MERGED_FRAME['transactions'] / MERGED_FRAME['visits']) * 100
MERGED_FRAME = MERGED_FRAME.sort_values(by=['visits'], ascending=False)

# print MERGED_FRAME
MERGED_FRAME.to_csv('data.csv', encoding='utf-8')
print "Converting Data Totals completed."
