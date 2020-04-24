'use strict';

// API ------------------------------------------------------------------------

function readJsonFile(jsonFile, callback) {
  d3.json(jsonFile, function (error, data) {
    if (error) {
      console.error(error);
    } else {
      callback(data);
    }
  });
}

// DATA FORMAT ----------------------------------------------------------------

var relativeDataPath = '/local-data-vis/2017-09-29-desktop-vs-mobile';

// TODO: es necesario fijar el UTCOffset del origen de datos manualmente
var hoursOffsetDataTimezone = 2;
function readData() {
  readJsonFile(relativeDataPath + '/data/pb-desktop-uk-2017-09.json', function (dataDesktopRaw) {
    readJsonFile(relativeDataPath + '/data/pb-mobile-uk-2017-09.json', function (dataMobileRaw) {
      var data = formatData(dataDesktopRaw, dataMobileRaw);
      launchVisualization(data);
    });
  });
}

function formatData(dataDesktopRaw, dataMobileRaw) {
  var dataFormatted = [];

  var queriesDataDesktop = formatQueriesData(dataDesktopRaw.entity.data.queries_data);
  var queriesDataMobile = formatQueriesData(dataMobileRaw.entity.data.queries_data);
  for (var hour in queriesDataDesktop) {
    var queriesDataDesktopHour = queriesDataDesktop[hour];
    var queriesDataMobileHour = queriesDataMobile[hour];
    dataFormatted.push({
      hour: hour,
      query_ratio_workdays: calculateQueryRatioWorkdays(queriesDataDesktopHour, queriesDataMobileHour),
      query_ratio_weekend: calculateQueryRatioWeekend(queriesDataDesktopHour, queriesDataMobileHour)
    });
  }

  return dataFormatted;
}

function formatQueriesData(queriesDataRaw) {
  var queriesDataFormatted = initializeQueriesDataFormatted();

  for (var index in queriesDataRaw) {
    var queriesDataRawPeriod = queriesDataRaw[index];
    var datetimePeriod = new Date(queriesDataRawPeriod.datetime);
    var queryCountPeriod = queriesDataRawPeriod.value;
    var hourPeriod = datetimePeriod.getUTCHours();
    var queriesDataHour = queriesDataFormatted[hourPeriod];
    if (!datetimeIsWeekend(datetimePeriod)) {
      queriesDataHour.query_count_workdays += queryCountPeriod;
    } else {
      queriesDataHour.query_count_weekend += queryCountPeriod;
    }
  }

  return queriesDataFormatted;
}

function initializeQueriesDataFormatted() {
  var queriesDataFormatted = {};

  for (var hourOfDay = 0; hourOfDay < 24; hourOfDay++) {
    queriesDataFormatted[hourOfDay] = {
      query_count_workdays: 0,
      query_count_weekend: 0
    };
  }

  return queriesDataFormatted;
}

function datetimeIsWeekend(datetime) {
  var offsetDataTimezone = hoursOffsetDataTimezone * 60 * 60000;
  var datetimeWithOffset = new Date(datetime.getTime() + offsetDataTimezone);

  return datetimeWithOffset.getDay() % 6 === 0;
}

function calculateQueryRatioWorkdays(queriesDataDesktopHour, queriesDataMobileHour) {
  var queryCountWorkdaysDesktop = queriesDataDesktopHour.query_count_workdays;
  var queryCountWorkdaysMobile = queriesDataMobileHour.query_count_workdays;
  var sumQueryCountWorkdays = queryCountWorkdaysDesktop + queryCountWorkdaysMobile;
  var queryRatioWorkdays = sumQueryCountWorkdays > 0 ? queryCountWorkdaysDesktop / sumQueryCountWorkdays : 0;

  return queryRatioWorkdays;
}

function calculateQueryRatioWeekend(queriesDataDesktopHour, queriesDataMobileHour) {
  var queryCountWeekendDesktop = queriesDataDesktopHour.query_count_weekend;
  var queryCountWeekendMobile = queriesDataMobileHour.query_count_weekend;
  var sumQueryCountWeekend = queryCountWeekendDesktop + queryCountWeekendMobile;
  var queryRatioWeekend = sumQueryCountWeekend > 0 ? queryCountWeekendDesktop / sumQueryCountWeekend : 0;

  return queryRatioWeekend;
}

// VISUALIZATION --------------------------------------------------------------

var originalData;
function launchVisualization(data) {
  originalData = data;

  generateAxis();

  updateChart(data, 0);
}

function generateAxis() {
  var xAxisHeight = 15;
  var xAxisPositionY = y(initialHourOfDay) + y.step();
  chart.append('rect').attr('class', 'axis xaxis fillrect').attr('width', chartWidth).attr('height', xAxisHeight).attr('transform', 'translate(0,' + xAxisPositionY + ')');

  var xAxisScale = d3.axisBottom(x).ticks(10).tickSize(xAxisHeight);
  chart.append('g').attr('class', 'axis xaxis scale').attr('transform', 'translate(0,' + xAxisPositionY + ')').call(xAxisScale);

  var xAxisTicksText = d3.axisBottom(x).ticks(1).tickFormat(d3.format('.0%')).tickPadding(0);
  chart.append('g').attr('class', 'axis xaxis tickstext').attr('transform', 'translate(0,' + xAxisPositionY + ')').call(xAxisTicksText).selectAll('text').attr('y', 4).attr('x', function (d, i) {
    var margin = 3;
    if (i === 0) {
      return margin;
    } else {
      return -margin;
    }
  }).style('text-anchor', function (d, i) {
    if (i === 0) {
      return 'start';
    }
    return 'end';
  });

  var yAxis = d3.axisLeft(y).tickFormat(function (d, i) {
    var tickValue = d + ':00';
    if (d < 10) {
      tickValue = '0' + tickValue;
    }
    return tickValue;
  }).tickPadding(0);
  var hoursPeriodYAxis = 6;
  chart.append('g').attr('class', 'axis yaxis').call(yAxis).selectAll('text').attr('class', function (d, i) {
    var tickTextCls = 'axis yaxis';
    if (i % hoursPeriodYAxis === 0 || i === 23) {
      tickTextCls += ' showtick';
    } else {
      tickTextCls += ' hidetick';
    }
    if (d % 12 === 0) {
      tickTextCls += ' daynighttick';
    }
    return tickTextCls;
  });
}

var durationTransition = 1000;
function updateChart(data, selectedChart) {
  // --- JOIN ---
  var band = chart.selectAll('.band').data(data, keyFunction);

  // --- REMOVE ---
  removeBand(band, selectedChart);

  // --- UPDATE ---
  updateBand(band, selectedChart);

  // --- ENTER ---
  enterBand(band, selectedChart);

  updateLegend(selectedChart);
}

function keyFunction(d) {
  return (+d.hour + hoursOffsetDataTimezone) % 24;
}

// TODO: mejorar las transiciones de 'remove'
function removeBand(band, selectedChart) {
  band.exit().remove();
}

var durationUpdateTransition = durationTransition;
function updateBand(band, selectedChart) {
  updateBarsBand(band, selectedChart);
  updatePointsBand(band, selectedChart);
}

function updateBarsBand(band, selectedChart) {
  band.select('.desktopbar').transition().duration(durationUpdateTransition).attr('width', function (d) {
    return getChartPositionX(selectedChart, d);
  });
  band.select('.mobilebar').transition().duration(durationUpdateTransition).attr('x', function (d) {
    return getChartPositionX(selectedChart, d);
  }).attr('width', function (d) {
    return chartWidth - getChartPositionX(selectedChart, d);
  });
}

function updatePointsBand(band, selectedChart) {
  band.select('.queryratioline').attr('class', getPointsChartLineClass).transition().duration(durationUpdateTransition).attr('x', getPointsChartLinePositionX).attr('width', getPointsChartLineWidth);
  band.select('.workdayspoint').transition().duration(durationUpdateTransition).attr('cx', function (d) {
    return x(d.query_ratio_workdays);
  });
  band.select('.weekendpoint').transition().duration(durationUpdateTransition).attr('cx', function (d) {
    return x(d.query_ratio_weekend);
  });
}

var durationEnterTransition = durationTransition;
function enterBand(band, selectedChart) {
  var bandEnter = band.enter().append('g').attr('class', 'band');
  switch (selectedChart) {
    case 0:
      enterBarsBand(bandEnter, selectedChart);
      break;
    case 1:
      enterBarsBand(bandEnter, selectedChart);
      break;
    case 2:
      enterPointsBand(bandEnter, selectedChart);
      break;
    default:
      enterBarsBand(bandEnter, selectedChart);
      break;
  }
}

function enterBarsBand(bandEnter, selectedChart) {
  var bandWidth = getBandWidth();
  bandEnter.append('rect').attr('class', 'queryratiobar desktopbar').attr('y', function (d) {
    return getChartPositionY(selectedChart, d);
  }).attr('height', bandWidth).attr('width', function (d) {
    return getChartInitialPositionX(selectedChart, d);
  }).transition().duration(durationEnterTransition).attr('width', function (d) {
    return getChartPositionX(selectedChart, d);
  });
  bandEnter.append('rect').attr('class', 'queryratiobar mobilebar').attr('y', function (d) {
    return getChartPositionY(selectedChart, d);
  }).attr('height', bandWidth).attr('x', function (d) {
    return getChartInitialPositionX(selectedChart, d);
  }).attr('width', function (d) {
    return getChartInitialPositionX(selectedChart, d);
  }).transition().duration(durationEnterTransition).attr('x', function (d) {
    return getChartPositionX(selectedChart, d);
  }).attr('width', function (d) {
    return chartWidth - getChartPositionX(selectedChart, d);
  });
}

function getBandWidth() {
  return y.bandwidth() + 1;
}

function getChartPositionY(selectedChart, d) {
  return y(keyFunction(d));
}

function getChartInitialPositionX(selectedChart, d) {
  return x(1 / 2);
}

function getChartPositionX(selectedChart, d) {
  if (selectedChart === 1) {
    return x(d.query_ratio_weekend);
  }
  return x(d.query_ratio_workdays);
}

function enterPointsBand(bandEnter, selectedChart) {
  var bandWidth = getBandWidth();
  var circleRadius = 4;
  bandEnter.append('rect').attr('class', getPointsChartLineClass).attr('y', function (d) {
    var lineYOffset = bandWidth / 2 - circleRadius / 2;
    return getChartPositionY(selectedChart, d) + lineYOffset;
  }).attr('height', circleRadius).attr('x', function (d) {
    return getChartInitialPositionX(selectedChart, d);
  }).transition().duration(durationEnterTransition).attr('x', getPointsChartLinePositionX).attr('width', getPointsChartLineWidth);
  bandEnter.append('circle').attr('class', 'queryratiopoint workdayspoint').attr('cy', function (d) {
    return getPointsChartPointPositionY(selectedChart, d);
  }).attr('r', bandWidth / 4).attr('cx', function (d) {
    return getChartInitialPositionX(selectedChart, d);
  }).transition().duration(durationEnterTransition).attr('cx', function (d) {
    return x(d.query_ratio_workdays);
  });
  bandEnter.append('circle').attr('class', 'queryratiopoint weekendpoint').attr('cy', function (d) {
    return getPointsChartPointPositionY(selectedChart, d);
  }).attr('r', bandWidth / 4).attr('cx', function (d) {
    return getChartInitialPositionX(selectedChart, d);
  }).transition().duration(durationEnterTransition).attr('cx', function (d) {
    return x(d.query_ratio_weekend);
  });
}

function getPointsChartLineClass(d) {
  var lineCls = 'queryratioline';
  if (d.query_ratio_workdays > d.query_ratio_weekend) {
    lineCls += ' queryratioworkdaysline';
  } else {
    lineCls += ' queryratioweekendline';
  }
  return lineCls;
}

function getPointsChartLinePositionX(d) {
  return Math.min(x(d.query_ratio_workdays), x(d.query_ratio_weekend));
}

function getPointsChartLineWidth(d) {
  return Math.abs(x(d.query_ratio_workdays) - x(d.query_ratio_weekend));
}

function getPointsChartPointPositionY(selectedChart, d) {
  var bandWidth = getBandWidth();
  var pointYOffset = bandWidth / 2;
  return getChartPositionY(selectedChart, d) + pointYOffset;
}

function updateLegend(selectedChart) {
  container.select('.legend').remove();

  var legendContainer = container.append('g').attr('class', 'legend').attr('transform', 'translate(' + margin.left + ',' + (margin.top + chartHeight + 20) + ')');

  var legendItemWidth = 130;
  var legendItemMargin = 10;
  var legendItemPositionX = chartWidth / 2 - legendItemWidth - legendItemMargin;
  var legendItemHeight = 16;
  var legendItemTextPositionY = 14;

  var legendItem1 = legendContainer.append('g').attr('class', 'legenditem').attr('transform', 'translate(' + legendItemPositionX + ',' + legendItemMargin + ')');
  if (selectedChart === 2) {
    legendItem1.append('circle').attr('class', 'legendcolor ' + (selectedChart === 2 ? 'legendcolorworkdays' : 'legendcolordesktop')).attr('cx', legendItemHeight / 2).attr('cy', legendItemHeight / 2).attr('r', legendItemHeight / 2);
  } else {
    legendItem1.append('rect').attr('class', 'legendcolor ' + (selectedChart === 2 ? 'legendcolorworkdays' : 'legendcolordesktop')).attr('width', legendItemHeight).attr('height', legendItemHeight);
  }
  legendItem1.append('text').attr('class', 'legendtext ' + (selectedChart === 2 ? 'legendtextworkdays' : 'legendtextdesktop')).attr('y', legendItemTextPositionY).attr('x', legendItemHeight + legendItemMargin / 2).text(selectedChart === 2 ? 'Workdays' : 'Desktop');

  legendItemPositionX = chartWidth / 2 + legendItemMargin;
  var legendItem2 = legendContainer.append('g').attr('class', 'legenditem').attr('transform', 'translate(' + legendItemPositionX + ',' + legendItemMargin + ')');
  if (selectedChart === 2) {
    legendItem2.append('circle').attr('class', 'legendcolor ' + (selectedChart === 2 ? 'legendcolorweekend' : 'legendcolormobile')).attr('cx', legendItemHeight / 2).attr('cy', legendItemHeight / 2).attr('r', legendItemHeight / 2);
  } else {
    legendItem2.append('rect').attr('class', 'legendcolor ' + (selectedChart === 2 ? 'legendcolorweekend' : 'legendcolormobile')).attr('width', legendItemHeight).attr('height', legendItemHeight);
  }
  legendItem2.append('text').attr('class', 'legendtext ' + (selectedChart === 2 ? 'legendtextweekend' : 'legendtextmobile')).attr('y', legendItemTextPositionY).attr('x', legendItemHeight + legendItemMargin / 2).text(selectedChart === 2 ? 'Weekend' : 'Mobile');
}

// MAIN -----------------------------------------------------------------------

var form = d3.select('#deskvsmob-queries-weekdaysdist-form');
var selectedChartInputValue = 0;
form.selectAll('input').on('change', function () {
  var value = +this.value;
  if (value === 2 || selectedChartInputValue === 2) {
    updateChart([], this.value);
  }
  updateChart(originalData, value);
  selectedChartInputValue = value;
});

var containerWidth = 800;
var containerHeight = 500;

var margin = {
  top: 10,
  right: 30,
  bottom: 45,
  left: 85
};

var legendHeight = 50;

var chartWidth = containerWidth - margin.left - margin.right;
var chartHeight = containerHeight - margin.top - margin.bottom - legendHeight;

var container = d3.select('#deskvsmob-queries-weekdaysdist').attr('width', containerWidth).attr('height', containerHeight);

var chart = container.append('g').attr('class', 'chart').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var x = d3.scaleLinear().rangeRound([0, chartWidth]).domain([0, 1]);

var yDomain = [];
var initialHourOfDay = 6;
for (var hourOfDay = 0; hourOfDay < 24; hourOfDay++) {
  yDomain.push((initialHourOfDay + hourOfDay) % 24);
}
var y = d3.scaleBand().rangeRound([chartHeight, 0]).domain(yDomain);

var imageSize = getBandWidth() * 1.5;
chart.append('image').attr('xlink:href', relativeDataPath + '/images/day.png').attr('x', -(margin.left - imageSize)).attr('y', y(12) - imageSize / 4).attr('width', imageSize).attr('height', imageSize);
chart.append('image').attr('xlink:href', relativeDataPath + '/images/night.png').attr('x', -(margin.left - imageSize)).attr('y', y(0) - imageSize / 4).attr('width', imageSize).attr('height', imageSize);

readData();
