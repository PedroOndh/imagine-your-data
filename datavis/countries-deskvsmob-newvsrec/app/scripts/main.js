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

var relativeResourcesPath = '.';

var dataQueriesVisualization, dataClicksVisualization, dataConversionVisualization;
function readDataVisualization(callbackSuccess) {
  var jsonFileName = '/data/query_count.json';
  readJsonFile(relativeResourcesPath + jsonFileName, function(dataRaw) {
    dataQueriesVisualization = formatDataVisualization(dataRaw);
    jsonFileName = '/data/click_count.json';
    readJsonFile(relativeResourcesPath + jsonFileName, function(dataRaw) {
      dataClicksVisualization = formatDataVisualization(dataRaw);
      jsonFileName = '/data/conversion_count.json';
      readJsonFile(relativeResourcesPath + jsonFileName, function(dataRaw) {
        dataConversionVisualization = formatDataVisualization(dataRaw);
        callbackSuccess();
      });
    });
  });
}


function formatDataVisualization(dataRaw) {
  var dataFormatted = [];

  var data = dataRaw.data;

  for (var index in data) {
    var dataItem = data[index];
    var countDesktop = dataItem.count_desktop;
    var countMobile = dataItem.count_mobile;
    var countTotal = (countDesktop + countMobile);
    var countNew = dataItem.count_new;
    var countRecurrent = dataItem.count_recurrent;
    dataFormatted.push({
      country: dataItem.country,
      count_desktop: countDesktop,
      count_desktop_ratio: calculateCountFilterRatio(countDesktop, countTotal),
      count_mobile: countMobile,
      count_mobile_ratio: calculateCountFilterRatio(countMobile, countTotal),
      count_new: countNew,
      count_new_ratio: calculateCountFilterRatio(countNew, countTotal),
      count_recurrent: countRecurrent,
      count_recurrent_ratio: calculateCountFilterRatio(countRecurrent, countTotal)
    });
  }

  return dataFormatted;
}

function calculateCountFilterRatio(countFilter, countTotal) {
  return ((countTotal > 0) ? (countFilter/ countTotal) : 0);
}


// VISUALIZATION --------------------------------------------------------------

function launchVisualization () {
  readDataVisualization(updateVisualization);
}

var dataVisualization;
function updateVisualization() {
  switch(valueToCompareInChart) {
    case valuesToCompare.QUERY_COUNT:
      dataVisualization = dataQueriesVisualization;
      break;
    case valuesToCompare.CLICK_COUNT:
      dataVisualization = dataClicksVisualization;
      break;
    case valuesToCompare.CONVERSION_COUNT:
      dataVisualization = dataConversionVisualization;
      break;
    default:
      dataVisualization = dataQueriesVisualization;
      break;
  }
  updateScales();
  updateChart();
}

var y, fs;
function updateScales() {
  var maxValueOfYDomain = d3.max(dataVisualization, function(d) {
    if (filterToCompareInChart === filtersToCompare.SCOPE) {
      return (d.count_desktop_ratio + d.count_mobile_ratio);
    } else {
      return (d.count_new_ratio + d.count_recurrent_ratio);
    }
  });
  y = d3.scaleLinear()
    .range([0, chartHeight])
    .domain([0, maxValueOfYDomain]);

  fs = d3.scaleLinear()
    .range([14, 10])
    .domain([1, 6]);
}

var durationUpdateTransition = 800;
var durationEnterTransition = 400;
function updateChart() {
  // --- JOIN ---
  var series = chart.selectAll('.serie')
    .data(dataVisualization, keyFunction);

  // --- REMOVE ---
  series.exit().remove();

  var firstItemSerieCls = getFirstItemSerieCls();
  var itemSerieWidth = getItemSerieWidth();
  var firstItemSerieFill = getFirstItemSerieFill();
  var firstItemTextCls = getFirstItemTextCls();
  var textColor = getTextColor();
  var itemTextFontSize = getItemTextFontSize();
  var secondItemSerieCls = getSecondItemSerieCls();
  var secondItemSerieFill = getSecondItemSerieFill();
  var secondItemTextCls = getSecondItemTextCls();
  var countryTextPositionY = getCountryTextPositionY();
  var countryTextFontSize = getCountryTextFontSize();
  var countryImagePositionY = getCountryImagePositionY();
  // --- UPDATE ---
  series.select('.firstitemserie')
    .transition().duration(durationUpdateTransition)
      .attr('class', firstItemSerieCls)
      .attr('x', getItemSeriePositionX)
      .attr('width', itemSerieWidth)
      .attr('height', getFirstItemSerieHeight)
      .style('fill', firstItemSerieFill);
  series.select('.firstitemtext')
    .transition().duration(durationUpdateTransition)
      .attr('class', firstItemTextCls)
      .attr('x', getItemTextPositionX)
      .attr('y', getFirstItemTextPositionY)
      .style('fill', textColor)
      .style('font-size', itemTextFontSize)
      .tween('animateFirstItemTextValue', function(d) {
        return animateFirstItemTextValue(d, this);
      });
  series.select('.seconditemserie')
    .transition().duration(durationUpdateTransition)
      .attr('class', secondItemSerieCls)
      .attr('x', getItemSeriePositionX)
      .attr('y', getSecondItemSeriePositionY)
      .attr('width', itemSerieWidth)
      .attr('height', getSecondItemSerieHeight)
      .style('fill', secondItemSerieFill);
  series.select('.seconditemtext')
    .transition().duration(durationUpdateTransition)
      .attr('class', secondItemTextCls)
      .attr('x', getItemTextPositionX)
      .attr('y', getSecondItemTextPositionY)
      .style('fill', textColor)
      .style('font-size', itemTextFontSize)
      .tween('animateSecondItemTextValue', function(d) {
        return animateSecondItemTextValue(d, this);
      });
  series.select('.countrytext')
    .transition().duration(durationUpdateTransition)
      .attr('x', getCountryTextPositionX)
      .attr('y', countryTextPositionY)
      .style('fill', textColor)
      .style('font-size', countryTextFontSize);
  series.select('.countryimage')
      .attr('x', getCountryImagePositionX)
      .attr('y', countryImagePositionY)
      .attr('height', countryTextFontSize);

  // --- ENTER ---
  var itemSerieOpacity = 0.85;
  var enterSeries = series.enter().append('g')
      .attr('class', 'serie');
  enterSeries.append('rect')
      .attr('class', firstItemSerieCls)
      .attr('x', getItemSeriePositionX)
      .attr('width', itemSerieWidth)
      .attr('height', getFirstItemSerieHeight)
      .style('fill', firstItemSerieFill)
      .style('opacity', 0)
    .transition().duration(durationEnterTransition)
      .style('opacity', itemSerieOpacity);
  enterSeries.append('text')
      .attr('class', firstItemTextCls)
      .attr('x', getItemTextPositionX)
      .attr('y', getFirstItemTextPositionY)
      .style('fill', textColor)
      .style('font-size', itemTextFontSize)
      .text(getFirstItemTextValue);
  enterSeries.append('rect')
      .attr('class', secondItemSerieCls)
      .attr('x', getItemSeriePositionX)
      .attr('y', getSecondItemSeriePositionY)
      .attr('width', itemSerieWidth)
      .attr('height', getSecondItemSerieHeight)
      .style('fill', secondItemSerieFill)
      .style('opacity', 0)
    .transition().duration(durationEnterTransition)
      .style('opacity', itemSerieOpacity);
  enterSeries.append('text')
      .attr('class', secondItemTextCls)
      .attr('x', getItemTextPositionX)
      .attr('y', getSecondItemTextPositionY)
      .text(getSecondItemTextValue)
      .style('fill', textColor)
      .style('font-size', itemTextFontSize);
  enterSeries.append('text')
      .attr('class', 'countrytext')
      .attr('x', getCountryTextPositionX)
      .attr('y', countryTextPositionY)
      .style('fill', textColor)
      .style('font-size', countryTextFontSize)
      .text(getCountryTextValue);
  enterSeries.append('image')
      .attr('class', 'countryimage')
      .attr('x', getCountryImagePositionX)
      .attr('y', countryImagePositionY)
      .attr('width', countryImageWidth)
      .attr('xlink:href', getCountryImageHref);
}

function keyFunction(d) {
  return d.country;
}

function getFirstItemSerieCls() {
  var cls = 'firstitemserie';
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    cls += ' scopeitemseriedesktop';
  } else {
    cls += ' usertypeitemserienew';
  }
  return cls;
}

var marginSeries = 1;
function getItemSeriePositionX(d, i) {
  var itemSerieWidth = getItemSerieWidth();
  return ((itemSerieWidth + marginSeries) * i);
}

function getItemSerieWidth() {
  return ((chartWidth / dataVisualization.length) - marginSeries);
}

var marginItemsSerie = 1;
function getFirstItemSerieHeight(d) {
  var firstItemHeight;
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    firstItemHeight = y(d.count_desktop_ratio);
  } else {
    firstItemHeight = y(d.count_new_ratio);
  }
  firstItemHeight -= marginItemsSerie;
  return firstItemHeight;
}

function getFirstItemSerieFill() {
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    return '#BD0B49';
  } else {
    return '#B6C630';
  }
}

function getFirstItemTextCls() {
  var cls = 'firstitemtext';
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    cls += ' scopeitemtextdesktop';
  } else {
    cls += ' usertypeitemtextnew';
  }
  return cls;
}

var marginTextsSerieHorizontal = 5;
function getItemTextPositionX(d, i) {
  return (getItemSeriePositionX(d, i) + marginTextsSerieHorizontal);
}

var marginTextsSerieVertical = 5;
function getFirstItemTextPositionY(d) {
  return (getFirstItemSerieHeight(d) - marginTextsSerieVertical);
}

function getTextColor() {
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    return '#FFF';
  } else {
    return '#414649';
  }
}

function getItemTextFontSize() {
  return (fs(dataVisualization.length) + 'px');
}

function animateFirstItemTextValue(d, domElement) {
  var svgElement = d3.select(domElement);
  var start = ((parseFloat(svgElement.text()
    .replace(/Desktop \(/g, '')
    .replace(/New visit \(/g, '')
    .replace(/%\)/g, '')) || 0)  / 100);
  var countFilterRatio;
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    countFilterRatio = d.count_desktop_ratio;
  } else {
    countFilterRatio = d.count_new_ratio;
  }
  var itp = d3.interpolate(start, countFilterRatio);
  return function(tr) {
    svgElement.text(formatFirstItemTextValue(itp(tr)));
  };
}

function formatFirstItemTextValue(countFilterRatio) {
  var text;
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    text = 'Desktop';
  } else {
    text = 'New visit';
  }
  text += (' (' + (countFilterRatio * 100).toFixed(2) + '%)');
  return text;
}

function getFirstItemTextValue(d) {
  var countFilterRatio;
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    countFilterRatio = d.count_desktop_ratio;
  } else {
    countFilterRatio = d.count_new_ratio;
  }
  return formatFirstItemTextValue(countFilterRatio);
}

function getSecondItemSerieCls() {
  var cls = 'seconditemserie';
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    cls += ' scopeitemseriemobile';
  } else {
    cls += ' usertypeitemserierecurrent';
  }
  return cls;
}

function getSecondItemSeriePositionY(d) {
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    return y(d.count_desktop_ratio);
  } else {
    return y(d.count_new_ratio);
  }
}

function getSecondItemSerieHeight(d) {
  var secondItemHeight;
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    secondItemHeight = y(d.count_mobile_ratio);
  } else {
    secondItemHeight = y(d.count_recurrent_ratio);
  }
  secondItemHeight -= marginItemsSerie;
  return secondItemHeight;
}

function getSecondItemSerieFill() {
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    return '#E4A62F';
  } else {
    return '#67A5B0';
  }
}

function getSecondItemTextCls() {
  var cls = 'seconditemtext';
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    cls += ' scopeitemtextmobile';
  } else {
    cls += ' usertypeitemtextrecurrent';
  }
  return cls;
}

var marginCorrectionTextPositionY = 9;
function getSecondItemTextPositionY(d) {
  return (getSecondItemSeriePositionY(d) + marginTextsSerieVertical + marginCorrectionTextPositionY);
}

function animateSecondItemTextValue(d, domElement) {
  var svgElement = d3.select(domElement);
  var start = ((parseFloat(svgElement.text()
    .replace(/Mobile \(/g, '')
    .replace(/Returning \(/g, '')
    .replace(/%\)/g, '')) || 0)  / 100);
  var countFilterRatio;
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    countFilterRatio = d.count_mobile_ratio;
  } else {
    countFilterRatio = d.count_recurrent_ratio;
  }
  var itp = d3.interpolate(start, countFilterRatio);
  return function(tr) {
    svgElement.text(formatSecondItemTextValue(itp(tr)));
  };
}

function formatSecondItemTextValue(countFilterRatio) {
  var text;
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    text = 'Mobile';
  } else {
    text = 'Returning';
  }
  text += (' (' + (countFilterRatio * 100).toFixed(2) + '%)');
  return text;
}

function getSecondItemTextValue(d) {
  var countFilterRatio;
  if (filterToCompareInChart === filtersToCompare.SCOPE) {
    countFilterRatio = d.count_mobile_ratio;
  } else {
    countFilterRatio = d.count_recurrent_ratio;
  }
  return formatSecondItemTextValue(countFilterRatio);
}

function getCountryTextPositionX(d, i) {
  return (getItemSeriePositionX(d, i) + (getItemSerieWidth() / 2));
}

function getCountryTextPositionY() {
  return ((marginTextsSerieVertical * 2) + marginCorrectionTextPositionY);
}

function getCountryTextFontSize() {
  return ((fs(dataVisualization.length) + 2) + 'px');
}

function getCountryTextValue(d) {
  var text;
  switch(d.country) {
    case 'GB':
      text = 'United Kingdom';
      break;
    case 'ES':
      text = 'Spain';
      break;
    case 'FR':
      text = 'France';
      break;
    case 'DE':
      text = 'Germany';
      break;
    case 'IT':
      text = 'Italy';
      break;
    default:
      text = d.country;
      break;
  }
  return text;
}

function getCountryImageHref(d) {
  return (relativeResourcesPath + '/images/' + d.country + '.png');
}

var countryImageWidth = 18;
function getCountryImagePositionX(d, i) {
  return (getCountryTextPositionX(d, i) - (countryImageWidth / 2));
}

function getCountryImagePositionY() {
  return (getCountryTextPositionY() + fs(dataVisualization.length));
}


// MAIN -----------------------------------------------------------------------

var valuesToCompare = {
  QUERY_COUNT: 'query_count',
  CLICK_COUNT: 'click_count',
  CONVERSION_COUNT: 'conversion_count'
};
var valueToCompareInChart = valuesToCompare.QUERY_COUNT;
var form = d3.select('#countries-deskvsmob-newvsrec-form');
form.selectAll('select[name=valuetocompareinchart]').on('change', function() {
  valueToCompareInChart = this.value;
  updateVisualization();
});

var filtersToCompare = {
  SCOPE: 'scope',
  USER_TYPE: 'user_type'
};
var filterToCompareInChart = filtersToCompare.SCOPE;
form.selectAll('select[name=filtertocompareinchart]').on('change', function() {
  filterToCompareInChart = this.value;
  updateVisualization();
});

var chartContainerWidth = 800;
var chartContainerHeight = 455;

var chartContainerPaddings = {
  top: 15,
  right: 25,
  bottom: 25,
  left: 25
};

var chartWidth = (chartContainerWidth - (chartContainerPaddings.left + chartContainerPaddings.right));
var chartHeight = (chartContainerHeight - (chartContainerPaddings.top + chartContainerPaddings.bottom));

var chartContainer = d3.select('#countries-deskvsmob-newvsrec-chartcontainer')
    .attr('width', chartContainerWidth)
    .attr('height', chartContainerHeight);

var chart = chartContainer.append('g')
    .attr('class', 'chart')
    .attr('transform', 'translate(' + chartContainerPaddings.left + ',' + chartContainerPaddings.top + ')');

launchVisualization();
