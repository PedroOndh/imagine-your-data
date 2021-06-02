import {
  stack,
  nest
} from 'd3';
import {
  max
} from 'd3-array';

const dataIsValid = (data, metricName) => {
  if (data.length === 0 || !data[0].device_type || !data[0].search_type || !data[0][metricName]) {
    return false;
  }
  return true;
}

const parseDataForMetric = (data, metricName) => {

  if (!dataIsValid(data, metricName)) {
    return;
  }

  const nestedData = nest()
    .key((d) => d.device_type)
    .entries(data);

  const segments = nestedData.map(d => d.key);
  const keys = nestedData[0].values.map(row => row.search_type).sort();

  let rowTotals = [];
  const parsedData = nestedData.map(deviceRow => {
    let returnObj = {}
    let rowTotal = 0;
    deviceRow.values.forEach(row => {
      returnObj[row.search_type] = +row[metricName];
      returnObj[`${row.search_type}_yoy`] = +row[`${metricName}_yoy`];
      rowTotal += +row[metricName];
    });

    rowTotals.push(rowTotal);
    returnObj['device_type'] = deviceRow.key
    return returnObj;
  });

  const maxValue = max(rowTotals);
  const stackedData = stack().keys(keys)(parsedData);

  return {
    segments,
    maxValue,
    keys,
    stackedData,
    parsedData
  };
};

export {
  parseDataForMetric
};
