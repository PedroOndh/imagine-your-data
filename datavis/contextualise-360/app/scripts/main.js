'use strict';


const chartHeight = 550;
const chartMaxHeight = chartHeight + 20;
const chartWidth = 550;

d3.select(window.frameElement)
    .style('height', `${(chartHeight / chartWidth) * 100}vw`)
    .style('max-height', `${chartMaxHeight}px`)
    .style('margin-top', '10px')
    .style('margin-bottom', '10px');

const chartContainer = d3.select('#rotate-360-chartcontainer')
    .style('max-width', `${chartWidth}px`);

const chart = chartContainer.select('#rotate-360-chart');
const rotate360Chart = new Rotate360Chart(chart, chartWidth, chartHeight);

DatavisHelpers.readCsvFile('./data/dataset-iyd.csv', d => {
  {
    let datetime = new Date(d.datetime);
    let dataItem = {
      id: +d.id,
      datetime: datetime,
      event_type: +d.event_type
    };
    return dataItem;
  }
}, data => {
  const datetimeStart = d3.min(data, d => d.datetime);
  const datetimeEnd = d3.max(data, d => d.datetime);
  let datetimePeriod = new Date(datetimeStart.getTime());
  const filterDataPeriod = d => {
    if (d.datetime.getTime() >= datetimePeriod) {
      const datetimePeriodEnd = new Date(datetimePeriod.getTime());
      datetimePeriodEnd.setUTCHours(datetimePeriodEnd.getUTCHours() + 1);
      if (d.datetime.getTime() < datetimePeriodEnd) {
        return true;
      }
    }
    return false;
  };
  let dataFiltered = data.filter(filterDataPeriod);
  rotate360Chart.displayChartData(dataFiltered);
  setInterval(() => {
    datetimePeriod.setUTCHours(datetimePeriod.getUTCHours() + 1);
    if (datetimePeriod.getTime() > datetimeEnd.getTime()) {
      datetimePeriod = new Date(datetimeStart.getTime());
    }
    dataFiltered = data.filter(filterDataPeriod);
    rotate360Chart.displayChartData(dataFiltered);
  }, 3000);
});
