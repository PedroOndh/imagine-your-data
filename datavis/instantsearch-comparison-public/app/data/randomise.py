import pandas as pd
import numpy as np
import os

METRIC_LIST = ['findability', 'ctr', 'perc_query_count']
last_mutliplier = 0

def getRandomMutiplier(x):
    global last_mutliplier
    std_dev = 0.05
    std_dev = np.interp(x, [0, 95], [0.2, 0.05])
    my_multiplier = np.random.normal(1, std_dev)
    my_multiplier = (my_multiplier + last_mutliplier) / 2
    last_mutliplier = my_multiplier
    return my_multiplier

def multiply_with_random_factor(x):
    return x * getRandomMutiplier(x)

def randomise_metric(data_frame, metric_name):
    data_frame[metric_name] = data_frame[metric_name].apply(
        multiply_with_random_factor
    )
    return data_frame

# for filename in os.listdir('.'):
#     if filename.endswith('.csv') & filename.startswith('rand_'):
#         os.remove(filename)

for filename in os.listdir('.'):
    if filename.endswith('.csv'):
        frame = pd.DataFrame.from_csv(filename)
        for metric in METRIC_LIST:
            frame = randomise_metric(frame, metric)
        frame.to_csv('rand_'+filename)
