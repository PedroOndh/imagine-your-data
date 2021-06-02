set -e

if [ $# -lt 3 ]; then
    echo "Your command line sould contain $# arguments: start_time end_time client"
    exit 1
fi

echo "Pulling data from Mongo..."

cd python-scripts

python get_report_data_totals.py $1 $2 $3
python get_report_data_timeseries.py 2017-01-01 $2 $3

cd ..

echo "Building Web Report..."

npm install
npm run build

mv python-scripts/data.csv dist/assets/data.csv
mv python-scripts/time_series_data.csv dist/assets/time_series_data.csv

cp -r dist "my_report_$1_$2_$3"

echo "All complete."
