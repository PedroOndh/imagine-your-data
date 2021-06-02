"""Script to Query Google Analytics Data for a specific date range and client"""
from datetime import datetime
import sys
import mongo_scripts as mongo_scripts
import pandas as pd
import numpy as np


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
        "$project": {
            "_id": {
                "sessions": "$sessions",
                "transactions": "$transactions",
                "search_used": "$search_used",
                "device_category": "$device_category",
                "week_number": {"$week": "$date"}
            }
        }
    }, {
        "$group": {
            "_id": {
                "search_used": "$_id.search_used",
                "segment": "$_id.device_category",
                "week_number": "$_id.week_number"
            },
            "sessions": {
                "$sum": "$_id.sessions"
            },
            "transactions": {
                "$sum": "$_id.transactions"
            }
        }
    }]
}

print 'Querying Weekly Data...'
PROC = mongo_scripts.Processor()
COLL = PROC.get_db_and_collection(
    CLIENT, GA_SESSION_QUERY['name'])
DATA = COLL.aggregate(
    pipeline=GA_SESSION_QUERY['ga_search_sessions'],
    maxTimeMS=500000,
    useCursor=True,
    allowDiskUse=True
)
print 'Querying Weekly Data completed.'

print 'Converting Weekly Data...'
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
DEVICE_FRAME.loc[DEVICE_FRAME['segment'] == 'tablet', 'segment'] = 'Tablet'
DEVICE_FRAME.loc[DEVICE_FRAME['segment'] == 'mobile', 'segment'] = 'Mobile'
DEVICE_FRAME.loc[DEVICE_FRAME['segment'] == 'desktop', 'segment'] = 'Desktop'

DEVICE_FRAME['search_type'] = DEVICE_FRAME['search_used']
DEVICE_FRAME['visits'] = DEVICE_FRAME['sessions']

del DEVICE_FRAME['search_used']
del DEVICE_FRAME['sessions']

TOTAL_FRAME = DEVICE_FRAME.groupby([
    'search_type',
    'week_number'
])[
    'visits',
    'transactions'
].sum().reset_index()

TOTAL_FRAME['segment'] = 'All'

MERGED_FRAME = pd.concat([DEVICE_FRAME, TOTAL_FRAME])

MERGED_FRAME['conversion_rate'] = (MERGED_FRAME['transactions'] / MERGED_FRAME['visits']) * 100

del MERGED_FRAME['transactions']
del MERGED_FRAME['visits']

MERGED_FRAME = pd.DataFrame.pivot_table(
    MERGED_FRAME,
    values=['conversion_rate'],
    index=['week_number', 'segment'],
    columns=['search_type'],
    aggfunc=np.sum
).reset_index()

MERGED_FRAME.columns = MERGED_FRAME.columns.to_series().str.join('')

MERGED_FRAME = MERGED_FRAME.sort_values(by=['segment', 'week_number'], ascending=True)
# print MERGED_FRAME
MERGED_FRAME.to_csv('time_series_data.csv', encoding='utf-8')
print 'Converting Weekly Data completed.'
