'use strict';


// API ------------------------------------------------------------------------

function readJsonFile(jsonFile, callback) {
  d3.json(jsonFile, function(error, data) {
    if (error) {
      console.error(error);
    } else {
      callback(data);
    }
  });
}


// DATA FORMAT ----------------------------------------------------------------

var relativeDataPath = '.';


var dataVisualization;
function readDataVisualization() {
  readJsonFile(relativeDataPath + '/data/dailydist-pb-2017_06_26-2017_07_06-spain.json', function(dataRaw) {
    dataVisualization = formatData(dataRaw);
    launchVisualization();
  });
}

function formatData(dataRaw) {
  var dataFormatted = [];

  var queriesData = dataRaw.entity.data.queries_data;
  var clicksData = dataRaw.entity.data.clicks_data;
  var conversionData = dataRaw.entity.data.conversion_data;
  var clicks_count_acum = 0;
  var conversion_count_acum = 0;
  for (var period in queriesData) {
    var clicks_count_period = clicksData[period].value;
    clicks_count_acum += clicks_count_period;
    var conversion_count_period = conversionData[period].value;
    conversion_count_acum += conversion_count_period;
    dataFormatted.push({
      datetime: new Date(queriesData[period].datetime),
      query_count: queriesData[period].value,
      clicks_count: clicks_count_period,
      clicks_count_acum: clicks_count_acum,
      conversion_count: conversion_count_period,
      conversion_count_acum: conversion_count_acum
    });
  }

  return dataFormatted;
}


// VISUALIZATION --------------------------------------------------------------

function launchVisualization() {
  relaunchVisualization(false);
  generateLegend();
  generateTooltip();
}

function relaunchVisualization(showOverlappingChart) {
  updateNormalScale();
  setChartContainerHeight();
  updateOverlappingScales();
  updateChart(showOverlappingChart);
}

var x;
var marginItemsSerie = 10;
function updateNormalScale() {
  var maxRangeOfX = chartWidth;
  var maxAcumValueOfData = 0;
  if (dataVisualization.length > 0) {
    maxRangeOfX -= (marginItemsSerie * (dataVisualization.length - 1));
    var lastDataVisualizationItem = dataVisualization[dataVisualization.length - 1];
    var totalClicksCount = lastDataVisualizationItem.clicks_count_acum;
    var totalConversionCount = lastDataVisualizationItem.conversion_count_acum;
    maxAcumValueOfData = Math.max(totalClicksCount, totalConversionCount);
  }
  x = d3.scaleLinear()
    .range([0, maxRangeOfX])
    .domain([0, maxAcumValueOfData]);
}

var y;
var marginSeries = 32;
var xAxisItemHeight = 14;
function updateOverlappingScales() {
  var maxRangeOfY = (chartHeight - ((marginSeries / 2) + (xAxisItemHeight / 2)));
  var maxValueOfData = d3.max(dataVisualization, function(d) {
    return (Math.max(d.conversion_count, d.clicks_count) / d.clicks_count);
  });
  y = d3.scaleLinear()
    .range([maxRangeOfY, 0])
    .domain([0, (maxValueOfData || 1)]);
}

function updateChart(showOverlappingChart) {
  // --- JOIN ---
  var series = chart.selectAll('.serie')
    .data(dataVisualization, keyFunction);

  if (showOverlappingChart) {
    updateOverlappingChart(series);
  } else {
    updateNormalChart(series);
  }
}

var chartHeight;
var legendHeight = 50;
function setChartContainerHeight() {
  var clicksCountSerieHeight = d3.max(dataVisualization, function(d) {
    return x(d.clicks_count);
  });
  var conversionCountSerieHeight = d3.max(dataVisualization, function(d) {
    return x(d.conversion_count);
  });
  chartHeight = (clicksCountSerieHeight + marginSeries + conversionCountSerieHeight);
  var chartContainerHeight = (chartHeight + (chartContainerPaddings.top + chartContainerPaddings.bottom) + legendHeight);
  chartContainer.attr('height', chartContainerHeight);
}

function keyFunction(d) {
  return d.datetime;
}

var durationUpdateTransition = 600;
var durationEnterTransition = 800;
function updateNormalChart(series) {
  var clicksCountSerieHeight = d3.max(dataVisualization, function(d) {
    return x(d.clicks_count);
  });
  // --- UPDATE ---
  series.select('.serieitem.clickcountitem')
    .transition().duration(durationUpdateTransition)
      .attr('x', getNormalChartPositionX)
      .attr('y', function (d) {
        return (clicksCountSerieHeight - x(d.clicks_count));
      })
      .attr('width', function(d) {
        return x(d.clicks_count);
      })
      .attr('height', function(d) {
        return x(d.clicks_count);
      });
  series.select('.serieitem.xaxisitem')
    .transition().duration(durationUpdateTransition)
      .attr('x', getNormalChartPositionX)
      .attr('y', (clicksCountSerieHeight + ((marginSeries / 2) - (xAxisItemHeight / 2))))
      .attr('width', function(d, i) {
        return getWidthXAxisItem(i, x(d.clicks_count));
      })
      .attr('height', xAxisItemHeight);
  series.select('.serietext.xaxistext')
    .transition().duration(durationUpdateTransition)
      .attr('x', function(d, i) {
        return (getNormalChartPositionX(d, i) + 3);
      })
      .attr('y', function() {
        return (clicksCountSerieHeight + ((marginSeries / 2) - (xAxisItemHeight / 2)) + 11);
      });
  series.select('.serieitem.conversioncountitem')
    .transition().duration(durationUpdateTransition)
      .attr('x', getNormalChartPositionX)
      .attr('y', (clicksCountSerieHeight + marginSeries))
      .attr('width', function(d) {
        return x(d.conversion_count);
      })
      .attr('height', function(d) {
        return x(d.conversion_count);
      });

  // --- ENTER ---
  var enterSeries = series.enter().append('g')
      .attr('class', 'serie');
  enterSeries.append('rect')
      .attr('class', 'serieitem clickcountitem')
      .on('mouseover', functionMouseOverItem)
      .on('mouseout', functionMouseOutItem)
      .on('mousemove', functionMouseMoveItem)
      .attr('x', getNormalChartPositionX)
      .attr('y', clicksCountSerieHeight)
    .transition().duration(durationEnterTransition)
      .attr('y', function (d) {
        return (clicksCountSerieHeight - x(d.clicks_count));
      })
      .attr('width', function(d) {
        return x(d.clicks_count);
      })
      .attr('height', function(d) {
        return x(d.clicks_count);
      });
  enterSeries.append('rect')
      .attr('class', function(d) {
        var cls = 'serieitem xaxisitem';
        var lastDataVisualizationItem = dataVisualization[dataVisualization.length - 1];
        if (d.datetime.getMonth() === lastDataVisualizationItem.datetime.getMonth()) {
          cls += ' nextmonth';
        } else {
          cls += ' previousmonth';
        }
        return cls;
      })
      .attr('x', getNormalChartPositionX)
      .attr('y', (clicksCountSerieHeight + (marginSeries / 2)))
      .attr('width', function(d, i) {
        return getWidthXAxisItem(i, x(d.clicks_count));
      })
      .attr('height', 0)
    .transition().duration(durationEnterTransition)
      .attr('y', (clicksCountSerieHeight + ((marginSeries / 2) - (xAxisItemHeight / 2))))
      .attr('height', xAxisItemHeight);
  enterSeries.append('text')
      .attr('class', 'serietext xaxistext')
      .attr('x', function(d, i) {
        return (getNormalChartPositionX(d, i) + 3);
      })
      .attr('y', function() {
        return (clicksCountSerieHeight + ((marginSeries / 2) - (xAxisItemHeight / 2)) + 11);
      })
      .text(function(d) {
        return d.datetime.toLocaleDateString('en', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      })
      .style('display', 'none')
    .transition().delay(durationEnterTransition)
      .style('display', function(d) {
        var display = 'none';
        if (d.datetime.getDate() === 1) {
          display = 'block';
        }
        return display;
      });
  enterSeries.append('rect')
      .attr('class', 'serieitem conversioncountitem')
      .on('mouseover', functionMouseOverItem)
      .on('mouseout', functionMouseOutItem)
      .on('mousemove', functionMouseMoveItem)
      .attr('x', getNormalChartPositionX)
      .attr('y', (clicksCountSerieHeight + marginSeries))
    .transition().duration(durationEnterTransition)
      .attr('width', function(d) {
        return x(d.conversion_count);
      })
      .attr('height', function(d) {
        return x(d.conversion_count);
      });
}

function getNormalChartPositionX(d, i) {
  var maxAcumValueOfData = Math.max(d.clicks_count_acum, d.conversion_count_acum);
  var maxValueOfData = Math.max(d.clicks_count, d.conversion_count);

  return (x(maxAcumValueOfData - maxValueOfData) + (marginItemsSerie * i));
}

var durationHoverTransition = 400;
function functionMouseOverItem(d, i) {
  tooltip.style('display', 'block');
  tooltip.transition().duration(durationHoverTransition).style('opacity', '1');

  chart.selectAll('.serieitem.clickcountitem')
      .attr('class', function(dt, id) {
        var cls = 'serieitem clickcountitem';
        if (i === id) {
          cls += ' serieitemhover';
        }
        return cls;
      });
  chart.selectAll('.serieitem.conversioncountitem')
      .attr('class', function(dt, id) {
        var cls = 'serieitem conversioncountitem';
        if (i === id) {
          cls += ' serieitemhover';
        }
        return cls;
      });
}

function functionMouseOutItem() {
  tooltip.style('display', 'none');
  tooltip.style('opacity', '0');

  chart.selectAll('.serieitem.clickcountitem.serieitemhover')
      .attr('class', 'serieitem clickcountitem');
  chart.selectAll('.serieitem.conversioncountitem.serieitemhover')
      .attr('class', 'serieitem conversioncountitem');
}

function functionMouseMoveItem(d, i) {
  var positionX = d3.mouse(this)[0];
  var positionY = (d3.mouse(this)[1] + 20);
  if (i < (dataVisualization.length - 2)) {
    positionX += 45;
  } else {
    positionX -= 140;
  }
  tooltip.attr('transform', 'translate(' + positionX + ',' + positionY + ')');

  var tooltipCls = 'tooltipbody';
  var lastDataVisualizationItem = dataVisualization[dataVisualization.length - 1];
  if (d.datetime.getMonth() === lastDataVisualizationItem.datetime.getMonth()) {
    tooltipCls += ' nextmonth';
  } else {
    tooltipCls += ' previousmonth';
  }
  tooltip.select('.tooltipbody')
      .attr('class', tooltipCls);

  var tooltipText = '<tspan x="75" dy="1.3em">' + d.datetime.toLocaleDateString('en', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) + '</tspan>';
  tooltipText += '<tspan x="75" dy="1.3em">Products clicked: ' + d.clicks_count + '</tspan>';
  var conversionRatio = Math.round((d.conversion_count / d.clicks_count) * 100);
  tooltipText += '<tspan x="75" dy="1.3em">Added to cart: ' + d.conversion_count + ' (' + conversionRatio + '%)</tspan>';
  tooltip.select('.tooltiptext')
      .html(tooltipText);
}

function getWidthXAxisItem(i, serieItemWidth) {
  var widthXAxisItem = serieItemWidth;
  if (i !== (dataVisualization.length - 1)) {
    widthXAxisItem += (marginItemsSerie + 1);
  }
  return widthXAxisItem
}

function updateOverlappingChart(series) {
  // --- UPDATE ---
  series.select('.serieitem.clickcountitem')
    .transition().duration(durationUpdateTransition)
      .attr('x', getOverlappingChartPositionX)
      .attr('y', function(d) {
        return y(d.clicks_count / d.clicks_count);
      })
      .attr('width', getBarWidthOverlappingChart)
      .attr('height', function(d) {
        return (y(0) - y(d.clicks_count / d.clicks_count));
      });
  series.select('.serieitem.conversioncountitem')
    .transition().duration(durationUpdateTransition)
      .attr('x', getOverlappingChartPositionX)
      .attr('y', function(d) {
        return y(d.conversion_count / d.clicks_count);
      })
      .attr('width', getBarWidthOverlappingChart)
      .attr('height', function(d) {
        return (y(0) - y(d.conversion_count / d.clicks_count));
      });
  series.select('.serieitem.xaxisitem')
    .transition().duration(durationUpdateTransition)
      .attr('x', getOverlappingChartPositionX)
      .attr('y', function() {
        return (chartHeight - xAxisItemHeight);
      })
      .attr('width', function(d, i) {
        return getWidthXAxisItem(i, getBarWidthOverlappingChart());
      });
  series.select('.serietext.xaxistext')
    .transition().duration(durationUpdateTransition)
      .attr('x', function(d, i) {
        return (getOverlappingChartPositionX(d, i) + 3);
      })
      .attr('y', function() {
        return (chartHeight - xAxisItemHeight + 11);
      });
  series.select('.serieitem.xaxisitem')
    .transition().duration(durationUpdateTransition)
    .attr('x', getOverlappingChartPositionX)
    .attr('y', function() {
      return (chartHeight - xAxisItemHeight);
    })
    .attr('width', function(d, i) {
      return getWidthXAxisItem(i, getBarWidthOverlappingChart());
    });
}

function getOverlappingChartPositionX(d, i) {
  var barWidthOverlappingChart = getBarWidthOverlappingChart();
  return ((barWidthOverlappingChart * i) + (marginItemsSerie * i));
}

function getBarWidthOverlappingChart() {
  return ((chartWidth / dataVisualization.length)
    - (marginItemsSerie * ((dataVisualization.length - 1) / dataVisualization.length)));
}

function generateLegend() {
  var legendMargin = 20;
  var legendContainer = chartContainer.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + chartContainerPaddings.left + ','
        + (chartContainerPaddings.top + chartHeight + legendMargin) + ')');

  var legendItemWidth = 150;
  var legendItemMargin = 10;
  var legendItemPositionX = ((chartWidth / 2) - legendItemWidth - legendItemMargin);
  var legendItemHeight = 16;
  var legendItemTextPositionY = 14;

  var legendItem1 = legendContainer.append('g')
      .attr('class', 'legenditem')
      .attr('transform', 'translate(' + legendItemPositionX + ',' + legendItemMargin + ')');
  legendItem1.append('rect')
      .attr('class', 'legendcolor legendcolorclickscount')
      .attr('width', legendItemHeight)
      .attr('height', legendItemHeight);
  legendItem1.append('text')
      .attr('class', 'legendtext legendtextclickscount')
      .attr('y', legendItemTextPositionY)
      .attr('x', (legendItemHeight + (legendItemMargin / 2)))
      .text('Products clicked');

  legendItemPositionX = ((chartWidth / 2) + legendItemMargin);

  var legendItem2 = legendContainer.append('g')
      .attr('class', 'legenditem')
      .attr('transform', 'translate(' + legendItemPositionX + ',' + legendItemMargin + ')');
  legendItem2.append('rect')
      .attr('class', 'legendcolor legendcolorconversioncount')
      .attr('width', legendItemHeight)
      .attr('height', legendItemHeight);
  legendItem2.append('text')
      .attr('class', 'legendtext legendtextconversioncount')
      .attr('y', legendItemTextPositionY)
      .attr('x', (legendItemHeight + (legendItemMargin / 2)))
      .text('Added to cart');
}

var tooltip;
function generateTooltip() {
  tooltip = chartContainer.append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');

  tooltip.append('rect')
      .attr('class', 'tooltipbody')
      .attr('width', 150)
      .attr('height', 55);

  tooltip.append('text')
      .attr('class', 'tooltiptext');
}


// MAIN -----------------------------------------------------------------------

var form = d3.select('#clickvsconv-daily-form');
form.selectAll('input[name=showoverlappingchart]').on('change', function() {
  relaunchVisualization(this.checked);
});

var chartContainerWidth = 800;

var chartContainerPaddings = {
  top: 30,
  right: 30,
  bottom: 25,
  left: 30
};

var chartWidth = (chartContainerWidth - (chartContainerPaddings.left + chartContainerPaddings.right));

var chartContainer = d3.select('#clickvsconv-daily-chartcontainer')
    .attr('width', chartContainerWidth);

var chart = chartContainer.append('g')
    .attr('class', 'chart')
    .attr('transform', 'translate(' + chartContainerPaddings.left + ',' + chartContainerPaddings.top + ')');

readDataVisualization();
