// import * as d3 from 'd3';

const readCsvFile = (csvFile, callback) => {
  d3.csv(csvFile, (error, data) => {
    if (error) {
      console.error(error);
    } else {
      callback(data);
    }
  });
};

const getMaxValueFromArrays = (dataArray) => {
  let valueArray = [];
  dataArray.forEach(function(array) {
    valueArray = valueArray.concat(array);
  });
  let val = parseInt(Math.max.apply(null, valueArray));
  val = parseInt((val/10)+1)*10;
  return val;
};

const roundValue = (value) => {
  return (Math.round(value*10))/10

}

const formatData = (rawData) => {

  let offDesktopQueryCount = [];
  let onDesktopQueryCount = [];
  let offDesktopFindability = [];
  let onDesktopFindability = [];
  let offDesktopCtr = [];
  let onDesktopCtr = [];
  let offMobileQueryCount = [];
  let onMobileQueryCount = [];
  let offMobileFindability = [];
  let onMobileFindability = [];
  let offMobileCtr = [];
  let onMobileCtr = [];

  rawData.forEach(function(row){
    if(row.scope === 'desktop') {
      if(row.year === '2016') {
        offDesktopQueryCount.push(roundValue(row['perc_query_count']));
        offDesktopFindability.push(roundValue(row['findability']));
        offDesktopCtr.push(roundValue(row['ctr']));
      }
      if(row.year === '2017') {
        onDesktopQueryCount.push(roundValue(row['perc_query_count']));
        onDesktopFindability.push(roundValue(row['findability']));
        onDesktopCtr.push(roundValue(row['ctr']));
      }
    }
    if(row.scope === 'mobile') {
      if(row.year === '2016') {
        offMobileQueryCount.push(roundValue(row['perc_query_count']));
        offMobileFindability.push(roundValue(row['findability']));
        offMobileCtr.push(roundValue(row['ctr']));
      }
      if(row.year === '2017') {
        onMobileQueryCount.push(roundValue(row['perc_query_count']));
        onMobileFindability.push(roundValue(row['findability']));
        onMobileCtr.push(roundValue(row['ctr']));
      }
    }
  });

  const queryCountData = {
    data: [
      onDesktopQueryCount,
      offDesktopQueryCount,
      onMobileQueryCount,
      offMobileQueryCount
    ]
  };
  const findabilityData = {
    data: [
      onDesktopFindability,
      offDesktopFindability,
      onMobileFindability,
      offMobileFindability
    ]
  };
  const ctrData = {
    data: [
      onDesktopCtr,
      offDesktopCtr,
      onMobileCtr,
      offMobileCtr
    ]
  };

  queryCountData.maxValue = getMaxValueFromArrays(queryCountData.data);
  findabilityData.maxValue = getMaxValueFromArrays(findabilityData.data);
  ctrData.maxValue = getMaxValueFromArrays(ctrData.data);
  return {
    '% of Total Queries': queryCountData,
    'Findability': findabilityData,
    'CTR': ctrData
  };
};
