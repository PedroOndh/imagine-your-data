import './styles/style.scss';

import { select } from 'd3-selection';
import { descending } from 'd3-array';
import $ from 'jquery';
import 'select2';

import ContextualiseQueriesChart from './contextualiseQueriesChart.ts';
import { readCsvFile } from './utils/fileReader.ts';


const chartHeight = 600;
const chartWidth = chartHeight;

// TODO: fix responsive behaviour when using an iframe to display the chart (IYD)
window.onload = () => {
  if (window.frameElement) {
    const iframeHeight = ((window.frameElement.clientWidth < 600) ? '200vw' : '100vw');
    select(window.frameElement).style('height', iframeHeight);

    const iframeHaxHeight = ((window.frameElement.clientWidth < 600) ? (chartHeight * 2) : chartHeight);
    select(window.frameElement).style('max-height', `${iframeHaxHeight + 20}px`);
  }
};

const contextualisedQueriesChart =
  new ContextualiseQueriesChart(select('.chart--contextualised'), chartHeight, chartWidth, true);
const notContextualisedQueriesChart =
  new ContextualiseQueriesChart(select('.chart--not-contextualised'), chartHeight, chartWidth, false);

contextualisedQueriesChart.setContextualiseQueriesChartCouple(notContextualisedQueriesChart);
notContextualisedQueriesChart.setContextualiseQueriesChartCouple(contextualisedQueriesChart);

let dataLoaded;
readCsvFile('./data/data_iyd.csv', (data) => {
  data.sort((d1, d2) => {
    return descending((+d1.csu_queries + +d1.nocsu_queries), (+d2.csu_queries + +d2.nocsu_queries));
  });
  dataLoaded = formatContextualiseQueriesData(data);

  select('.queries-selector-container__inner')
    .append('input')
      .attr('type', 'search')
      .attr('placeholder', 'Filter by terms (blazer, jeans...)')
      .attr('class', 'queries-selector');

  let delay = (function(){
    let timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();
  $('.queries-selector').on('input', function() {
    let value = this.value;
    delay(function() {
      const dataFiltered = dataLoaded.filter(d => (d.terms.indexOf(value) >= 0));
      contextualisedQueriesChart.displayData(dataFiltered.slice());
      notContextualisedQueriesChart.displayData(dataFiltered.slice());
    }, 1000);
  });

  contextualisedQueriesChart.displayData(dataLoaded);
  notContextualisedQueriesChart.displayData(dataLoaded);
});

const formatContextualiseQueriesData = (data) => {
  let dataFormatted = [];
  data.forEach(d => {
    dataFormatted.push({
      terms: d.terms,
      queries_csu: +d.csu_queries,
      queries_not_csu: +d.nocsu_queries,
      ctr_csu: (+d.csu_ctr / +d.csu_queries),
      ctr_not_csu: (+d.nocsu_ctr / +d.nocsu_queries),
      findability_csu: (+d.csu_find / +d.csu_queries),
      findability_not_csu: (+d.nocsu_find / +d.nocsu_queries)
    });
  });
  return dataFormatted;
};
