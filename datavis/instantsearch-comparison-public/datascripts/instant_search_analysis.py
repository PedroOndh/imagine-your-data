import mongo_helper as mongo_helper
from datetime import datetime
import pandas as pd

START_DATE_1 = datetime(2017, 8, 1, 0, 0, 0)
END_DATE_1 = datetime(2017, 11, 1, 0, 0, 0)
START_DATE_2 = datetime(2016, 7, 12, 0, 0, 0)
END_DATE_2 = datetime(2016, 7, 22, 0, 0, 0)

queriesByLanguageAndDevice = [
    {"$match": {"$or": [
        {"date": {"$gt": START_DATE_1, "$lt": END_DATE_1}},
        # {"date": {"$gt": START_DATE_2, "$lt": END_DATE_2}}
    ]}},
    # { "$match": { "lang": "en"} }, # set language filter here, comment out if you want numbers across all langauges
    {"$project": {"_id": {"query_count": "$query_count", "click_count": "$click_count", "first_page_count": "$first_page_count", "terms": "$terms", "scope": "$scope"}}},
    # {"$limit": 50000}
]

def getPercOfTotal(df, df_totals, scope, instant):
    total = df_totals.loc[(df_totals['scope'] == scope) & (df_totals['instant'] == instant)]['query_count']
    if total.tolist():
        df['perc_query_count'] = df.apply(lambda row: row['query_count']/float(total) if row['scope'] == scope and row['instant'] == instant else row['perc_query_count'], axis=1)
    return df

proc = mongo_helper.Processor()
coll = proc.get_db_and_collection('sb_mango', 'agg_term_success_daily_count_v3')

print 'Running Query...'
data = proc.gather_data(coll, queriesByLanguageAndDevice, 300000)
print 'Query completed.'

print 'Converting Data...'
data_list = list(data)
formatted_data = []
for row in data_list:
    my_data_row = row['_id']
    formatted_data.append(my_data_row)

print 'Creating DataFrame...'
df = pd.DataFrame(formatted_data)
df['instant'] = 'off'

print 'Calculating Search Query Metrics...'

# Switch below between term_length or term_count
METRIC_NAME = 'char_count'
# df[METRIC_NAME] = df.terms.str.len()
# df.loc[df[METRIC_NAME] > 30, METRIC_NAME] = 30

df[METRIC_NAME] = df.terms.apply(lambda x: len(x.split(' ')))
df.loc[df[METRIC_NAME] > 5, METRIC_NAME] = 5

print 'Cleaning Data...'
df.loc[df['scope'] == 'mobileappios', 'scope'] = 'mobile'
df.loc[df['scope'] == 'mobileweb', 'scope'] = 'mobile'
df.loc[df['scope'] == 'AppAND', 'scope'] = 'mobile'
df.loc[df['scope'] == 'AppIOS', 'scope'] = 'mobile'
df.loc[df['scope'] == 'mobileappandroid', 'scope'] = 'mobile'
df.loc[df['scope'] == 'tablet', 'scope'] = 'mobile'
df.loc[df['scope'] == 'app', 'scope'] = 'mobile'
df.loc[df['scope'] == 'app-O', 'scope'] = 'mobile'
df.loc[df['scope'] == 'app-S', 'scope'] = 'mobile'
df.loc[df['scope'] == 'mobile-O', 'scope'] = 'mobile'
df.loc[df['scope'] == 'mobile-S', 'scope'] = 'mobile'
df.loc[df['scope'] == 'tablet-O', 'scope'] = 'mobile'
df.loc[df['scope'] == 'tablet-S', 'scope'] = 'mobile'
df.loc[df['scope'] == 'default', 'scope'] = 'desktop'
df.loc[df['scope'] == 'O', 'scope'] = 'desktop'
df.loc[df['scope'] == 'S', 'scope'] = 'desktop'
del df['terms']

print 'Calculating Totals...'
df = df.groupby([METRIC_NAME,'scope','instant'])['query_count', 'first_page_count', 'click_count'].sum().reset_index()
df_totals = df.groupby(['scope','instant'])['query_count'].sum().reset_index()
df['perc_query_count'] = 0

print 'Calculating Percentages...'
df = getPercOfTotal(df, df_totals, 'desktop', 'off')
df = getPercOfTotal(df, df_totals, 'mobile', 'off')
df = getPercOfTotal(df, df_totals, 'desktop', 'on')
df = getPercOfTotal(df, df_totals, 'mobile', 'on')

df['perc_query_count'] = df['perc_query_count'] * 100


full_db = df
full_db = full_db.fillna(0)
full_db['findability'] = (full_db['first_page_count'] / full_db['query_count']) * 100
full_db['ctr'] = (full_db['click_count'] / full_db['query_count']) * 100
print 'Data Processing completed.'

print 'Writing Data to File...'
full_db.to_csv('out.csv', encoding='utf-8')
