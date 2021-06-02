'use strict';

// import * as echarts from 'echarts';

let currentXMetric = 'query';
let currentYMetric = '% of Total Queries';
let currentLanguage = 'es';

const xValuesQuery = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30+'];
const xValuesTerm = ['1', '2', '3', '4', '5+'];

const launchVis = (visData) => {
  let xValues = xValuesQuery;
  let xInterval = 2;
  let xMetricName = 'Characters';
  if (currentXMetric === 'term') {
    xValues = xValuesTerm;
    xInterval = 0;
    xMetricName = 'Word(s)';
  }
  myChart.setOption(getOption(visData.data, visData.maxValue, xValues, xInterval, xMetricName, currentYMetric), true);
};

const updateChartY = (metric) => {
  currentYMetric = metric;
  launchVis(formattedData[currentLanguage][currentXMetric][currentYMetric]);
}

const updateChartX = (metric) => {
  currentXMetric = metric;
  launchVis(formattedData[currentLanguage][currentXMetric][currentYMetric]);
}

const updateLanguage = (language) => {
  currentLanguage = language;
  launchVis(formattedData[currentLanguage][currentXMetric][currentYMetric]);
}

const chart = window.document.getElementById('chart');
const myChart = echarts.init(chart);
let formattedData = {
  all: {
    query: {},
    term: {}
  },
  en: {
    query: {},
    term: {}
  },
  es: {
    query: {},
    term: {}
  },
  fr: {
    query: {},
    term: {}
  },
  de: {
    query: {},
    term: {}
  }
};

readCsvFile('data/rand_data_es_query.csv', function(data) {
  formattedData.es.query = formatData(data);
  console.log(formattedData);
  launchVis(formattedData[currentLanguage][currentXMetric][currentYMetric]);
});

readCsvFile('data/rand_data_es_term.csv', function(data) {
  formattedData.es.term = formatData(data);
});

readCsvFile('data/rand_data_query.csv', function(data) {
  formattedData.all.query = formatData(data);
});

readCsvFile('data/rand_data_term.csv', function(data) {
  formattedData.all.term = formatData(data);
});

readCsvFile('data/rand_data_en_query.csv', function(data) {
  formattedData.en.query = formatData(data);
});

readCsvFile('data/rand_data_en_term.csv', function(data) {
  formattedData.en.term = formatData(data);
});

readCsvFile('data/rand_data_fr_query.csv', function(data) {
  formattedData.fr.query = formatData(data);
});

readCsvFile('data/rand_data_fr_term.csv', function(data) {
  formattedData.fr.term = formatData(data);
});

readCsvFile('data/rand_data_de_query.csv', function(data) {
  formattedData.de.query = formatData(data);
});

readCsvFile('data/rand_data_de_term.csv', function(data) {
  formattedData.de.term = formatData(data);
});

d3.select(window.frameElement).style('height', '550px');
