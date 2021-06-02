require('./styles/style.scss');
require('echarts-gl');
const events = require('./events.js')
const fileReader = require('./utils/fileReader.ts');
const echarts = require('echarts');
const chartOptions = require('./chartOption.js');
const myChart = echarts.init(document.getElementById('chart'));

const showPage = () => {
  document.getElementById('mainPage').style.visibility = 'visible';
  document.getElementById('chart').oncontextmenu = function (e) {
    e.preventDefault();
};
}

fileReader.readCsvFile('./data/data.csv', (data) => {
  const dataArray = data.map((row, index) => {
    return [
      +row.total_queries,
      +row.ctr,
      +row.zero_resulto_rate,
      +row.keywords.length,
      row.keywords,
      row.lang
    ];
  });

  chartOptions.defaultOption.series[0].data = dataArray;
  myChart.setOption(chartOptions.defaultOption);
  events.enableEvents(myChart);
  showPage();
});
