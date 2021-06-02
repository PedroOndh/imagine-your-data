'use strict';

const width = 500;
const height = 200;
const axisAnchor = {
  x: 145,
  y: 45
};

d3.select(window.frameElement).style('height', '55vw');
d3.select(window.frameElement).style('max-height', '600px');

readCsvFile('./data/avg_keyword_data.csv', (dataRaw) => {
  displayLineChart(dataRaw);
});
