'use strict';


const chartWidth = 650;
const chartHeight = 630;

d3.select(window.frameElement).style('height', '100vw');
d3.select(window.frameElement).style('max-height', `${chartHeight + 20}px`);

const chartContainer = d3.select('#blackfriday-360-chartcontainer')
    .style('max-width', `${chartWidth}px`);

const chart = chartContainer.select('#blackfriday-360-chart');
const blackFriday360Chart = new TimeDistributionRadialChart(chart, chartWidth, chartHeight);

DatavisHelpers.readCsvFile('./data/bf_18.csv', d => {
  {
    const utcHoursOffsetData = 0;
    let datetime = new Date(d.datetime);
    datetime.setHours(datetime.getHours() + utcHoursOffsetData);
    let dataItem = {
      datetime: datetime,
      queries : +d.queries
    };
    if (+d.add2cart > 0) {
      dataItem.add2cart = +d.add2cart;
    }
    return dataItem;
  }
}, data => {
  let add2CartSum = d3.sum(data, d => d.add2cart);
  blackFriday360Chart.displayChart(data, (add2CartSum > 0));
});
