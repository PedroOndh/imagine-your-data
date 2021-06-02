'use strict';


// API ------------------------------------------------------------------------

function readJsonFile(jsonFile, callback) {
  d3.json(jsonFile, function(error, data) {
    if(error) {
      console.error(error);
    } else {
      callback(data);
    }
  });
}


// DATA FORMAT ----------------------------------------------------------------

var relativeResourcesPath = '.';

var dataVisualizationOriginal;
function readDataVisualization() {
  readJsonFile(relativeResourcesPath + '/data/overall_per_numterms.json', function(dataRaw) {
    dataVisualizationOriginal = formatDataVisualization(dataRaw);
    generateScopeFilters();
    generateCountRatioFilters();
    updateVisualization();
  });
}

function formatDataVisualization(dataRaw) {
  return {
    desktop: formatScopeData(dataRaw.desktop),
    mobile: formatScopeData(dataRaw.mobile)
  };
}

function formatScopeData(dataRaw) {
  var dataFormatted = [];

  var totalCount = d3.sum(dataRaw, function(d) {
    return (d.not_contextualised_data.query_count + d.contextualised_data.query_count);
  });
  var subtotalCountAcum = 0;
  for (var index in dataRaw) {
    var dataRawItem = dataRaw[index];
    var subtotalCount = (dataRawItem.not_contextualised_data.query_count + dataRawItem.contextualised_data.query_count);
    subtotalCountAcum += subtotalCount;
    var dataFormattedItem =
      formatContextualisedAndNotContextualisedData(dataRawItem, totalCount, subtotalCount, subtotalCountAcum);
    dataFormatted.push(dataFormattedItem);
  }

  return dataFormatted;
}

function formatContextualisedAndNotContextualisedData(dataRaw, totalCount, subtotalCount, subtotalCountAcum) {
  var notContextualisedData = dataRaw.not_contextualised_data;
  var contextualisedData = dataRaw.contextualised_data;
  return {
    numterms: dataRaw.numterms,
    total_count: subtotalCount,
    total_count_acum: subtotalCountAcum,
    total_count_ratio: calculateCountRatio(subtotalCount, totalCount),
    not_contextualised_data: formatFinalData(notContextualisedData, contextualisedData, false),
    contextualised_data: formatFinalData(contextualisedData, notContextualisedData, true)
  };
}

function calculateCountRatio(count, totalCount) {
  return ((totalCount > 0) ? (count/ totalCount) : 0);
}

function formatFinalData(dataRaw, dataToCompareRaw, isContextualisedData) {
  var queryCount = dataRaw.query_count;
  var findCount = dataRaw.find_count;
  var clickCount = dataRaw.click_count;
  var conversionCount = dataRaw.conversion_count;

  var queryCountToCompare = dataToCompareRaw.query_count;
  var findCountToCompare = dataToCompareRaw.find_count;
  var clickCountToCompare = dataToCompareRaw.click_count;
  var conversionCountToCompare = dataToCompareRaw.conversion_count;

  var findability = calculateCountRatio(findCount, queryCount);
  var findabilityToCompare = calculateCountRatio(findCountToCompare, queryCountToCompare);

  var ctr = calculateCountRatio(clickCount, queryCount);
  var ctrToCompare = calculateCountRatio(clickCountToCompare, queryCountToCompare);

  var cvr = calculateCountRatio(conversionCount, queryCount);
  var cvrToCompare = calculateCountRatio(conversionCountToCompare, queryCountToCompare);

  return {
    contextualised: isContextualisedData,
    query_count: queryCount,
    query_count_ratio: calculateCountRatio(queryCount, (queryCount + queryCountToCompare)),
    find_count: findCount,
    click_count: clickCount,
    conversion_count: conversionCount,
    findability: findability,
    findability_difference: (findability - findabilityToCompare),
    ctr: ctr,
    ctr_difference: (ctr - ctrToCompare),
    cvr: cvr,
    cvr_difference: (cvr - cvrToCompare)
  };
}


// VISUALIZATION --------------------------------------------------------------

function launchVisualization() {
  readDataVisualization();
}

var scopesValues = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile'
};
var selectedScopeValue = scopesValues.DESKTOP;
function generateScopeFilters() {
  var totalCountDesktop = d3.sum(dataVisualizationOriginal.desktop, function(d) {
    return d.total_count;
  });
  var totalCountMobile = d3.sum(dataVisualizationOriginal.mobile, function(d) {
    return d.total_count;
  });
  var totalCountScopes = (totalCountDesktop + totalCountMobile);
  var totalCountRatioDesktop = calculateCountRatio(totalCountDesktop, totalCountScopes);
  var totalCountRatioMobile = calculateCountRatio(totalCountMobile, totalCountScopes);

  createScopeFilter(scopesValues.DESKTOP, 0, totalCountRatioDesktop);
  createScopeFilter(scopesValues.MOBILE, 1, totalCountRatioMobile);
}

var durationEnterTransition = 500;
function createScopeFilter(scopeValue, index, totalCountRatioScope) {
  var filterWidth = 150;
  var filtersInnerMargin = 1;
  var formMargin = 20;
  var filterHeight = (formHeight - formMargin);

  var filterClass= scopeValue;
  if (scopeValue === scopesValues.DESKTOP) {
    filterClass += ' selected';
  }
  var filterPositionX = (chartContainerPaddings.left + ((filterWidth + filtersInnerMargin) * index));

  var scopeFilter = chartContainer.append('g')
      .attr('class', 'scopefilter')
      .attr('transform', 'translate(' + filterPositionX + ',' + formMargin + ')')
      .on('click', function () {
        onClickScopeFilter(scopeValue);
      });

  scopeFilter.append('rect')
      .attr('class', 'scopefilterbutton ' + filterClass)
      .attr('rx', 4)
      .attr('width', filterWidth)
      .attr('height', filterHeight)
      .attr('opacity', 0)
    .transition().duration(durationEnterTransition)
      .attr('opacity', 1);

  var textMarginCorrector = 5;
  scopeFilter.append('text')
      .attr('class', 'scopefiltertext ' + filterClass)
      .attr('x', (filterWidth / 2))
      .attr('y', (filterHeight / 2) + textMarginCorrector)
      .text(formatScopeFilterText(scopeValue, totalCountRatioScope))
      .attr('opacity', 0)
    .transition().duration(durationEnterTransition)
      .attr('opacity', 1);
}

function onClickScopeFilter(scopeValue) {
  if (selectedScopeValue !== scopeValue) {
    selectedScopeValue = scopeValue;
    chartContainer.selectAll('.scopefilterbutton').classed('selected', false);
    chartContainer.selectAll('.scopefiltertext').classed('selected', false);
    chartContainer.select('.scopefilterbutton.' + scopeValue).classed('selected', true);
    chartContainer.select('.scopefiltertext.' + scopeValue).classed('selected', true);
    updateVisualization();
  }
}

function formatScopeFilterText(scopeValue, totalCountRatioScope) {
  var totalCountRatioScopeText;
  if (totalCountRatioScope === 1) {
    totalCountRatioScopeText = (totalCountRatioScope * 100);
  } else {
    totalCountRatioScopeText = (totalCountRatioScope * 100).toFixed(1);
  }
  var text = (' (' + totalCountRatioScopeText + '%)');
  switch(scopeValue) {
    case scopesValues.DESKTOP:
      text = ('Desktop' + text);
      break;
    case scopesValues.MOBILE:
      text = ('Mobile' + text);
      break;
    default:
      console.error('"selectedscopevalue" not valid. ');
      break;
  }
  return text;
}

var countRatioValues = {
  FINDABILITY: 'findability',
  CTR: 'ctr',
  CVR: 'cvr'
};
var selectedCountRatioValue = countRatioValues.FINDABILITY;
function generateCountRatioFilters() {
  createCountRatioFilter(countRatioValues.CVR, 0);
  createCountRatioFilter(countRatioValues.CTR, 1);
  createCountRatioFilter(countRatioValues.FINDABILITY, 2);
}

function createCountRatioFilter(countRatioValue, index) {
  var filterWidth = 125;
  var filtersInnerMargin = 1;
  var formMargin = 20;
  var filterHeight = (formHeight - formMargin);

  var filterClass= countRatioValue;
  if (countRatioValue === countRatioValues.FINDABILITY) {
    filterClass += ' selected';
  }
  var filterPositionX = (((chartContainerWidth - chartContainerPaddings.right) - filterWidth)
    - ((filterWidth + filtersInnerMargin) * index));

  var countRatioFilter = chartContainer.append('g')
      .attr('class', 'countratiofilter')
      .attr('transform', 'translate(' + filterPositionX + ',' + formMargin + ')')
      .on('click', function () {
        onClickCountRatioFilter(countRatioValue);
      });

  countRatioFilter.append('rect')
      .attr('class', 'countratiofilterbutton ' + filterClass)
      .attr('rx', 4)
      .attr('width', filterWidth)
      .attr('height', filterHeight)
      .attr('opacity', 0)
    .transition().duration(durationEnterTransition)
      .attr('opacity', 1);

  var textMarginCorrector = 5;
  countRatioFilter.append('text')
      .attr('class', 'countratiofiltertext ' + filterClass)
      .attr('x', (filterWidth / 2))
      .attr('y', (filterHeight / 2) + textMarginCorrector)
      .text(formatCountRatioFilterText(countRatioValue))
      .attr('opacity', 0)
    .transition().duration(durationEnterTransition)
      .attr('opacity', 1);
}

function formatCountRatioFilterText(countRatioValue) {
  var text;
  switch(countRatioValue) {
    case countRatioValues.FINDABILITY:
      text = 'Findability';
      break;
    case countRatioValues.CTR:
      text = 'CTR';
      break;
    case countRatioValues.CVR:
      text = 'Add to cart';
      break;
    default:
      console.error('"selectedcountratiovalue" not valid. ');
      break;
  }
  return text;
}

function onClickCountRatioFilter(countRatioValue) {
  if (selectedCountRatioValue !== countRatioValue) {
    selectedCountRatioValue = countRatioValue;
    chartContainer.selectAll('.countratiofilterbutton').classed('selected', false);
    chartContainer.selectAll('.countratiofiltertext').classed('selected', false);
    chartContainer.select('.countratiofilterbutton.' + countRatioValue).classed('selected', true);
    chartContainer.select('.countratiofiltertext.' + countRatioValue).classed('selected', true);
    updateVisualization();
  }
}

var dataVisualization;
function updateVisualization() {
  dataVisualization = dataVisualizationOriginal;
  switch(selectedScopeValue) {
    case scopesValues.DESKTOP:
      dataVisualization = dataVisualization.desktop;
      break;
    case scopesValues.MOBILE:
      dataVisualization = dataVisualization.mobile;
      break;
    default:
      console.error('"selectedscopevalue" not valid. ');
      break;
  }

  updateScales();
  updateChart();
}

var x, y, maxDomainOfY;
function updateScales() {
  var maxDomainOfX = d3.max(dataVisualization, function(d) {
    return d.total_count_acum;
  });
  x = d3.scaleLinear()
    .range([0, chartWidth])
    .domain([0, maxDomainOfX]);

  var maxValueOfY = getMaxValueOfY();
  maxDomainOfY = getMaxDomainOfY(maxValueOfY);
  y = d3.scaleLinear()
    .range([chartInnerHeight, 0])
    .domain([0, maxDomainOfY]);
}

function getMaxValueOfY() {
  var maxValueOfY = d3.max(dataVisualization, function(d) {
    var maxValueOfCountRatioNotContextualised = getSelectedCountRatioValue(d.not_contextualised_data);
    var maxValueOfCountRatioContextualised = getSelectedCountRatioValue(d.contextualised_data);
    return Math.max(maxValueOfCountRatioNotContextualised, maxValueOfCountRatioContextualised);
  });

  return (maxValueOfY || 0);
}

function getSelectedCountRatioValue(d) {
  switch(selectedCountRatioValue) {
    case countRatioValues.FINDABILITY:
      return d.findability;
    case countRatioValues.CTR:
      return d.ctr;
    case countRatioValues.CVR:
      return d.cvr;
    default:
      console.error('"selectedcountratiovalue" not valid. ');
      break;
  }
}

function getMaxDomainOfY(maxValueOfY) {
  var maxDomainOfY = 0;

  var sum = 0.01;
  var cont = true;
  while(cont) {
    if(maxDomainOfY >= maxValueOfY) {
      cont = false;
    }
    maxDomainOfY += sum;
  }

  return maxDomainOfY;
}

function updateChart() {
  // --- JOIN ---
  var series = chart.selectAll('.serie')
    .data(dataVisualization, keyFunction);

  // --- REMOVE ---
  removeSeries(series);

  // --- UPDATE ---
  updateSeries(series);

  // --- ENTER ---
  enterSeries(series);
}

function keyFunction(d) {
  return d.numterms;
}

function removeSeries(series) {
  series.exit().remove();
}

function updateSeries(series) {
  updateXAxisSeries(series);

  updateCountRatioSeries(series);
}

var durationUpdateTransition = 500;
function updateXAxisSeries(series) {
  series.select('.serieitem.xaxis')
    .transition().duration(durationUpdateTransition)
      .attr('x', getXAxisSerieItemPositionX)
      .attr('width', getXAxisSerieItemWidth)
      .style('opacity', getXAxisSerieItemOpacity);

  series.select('.serietext.xaxis')
    .transition().duration(durationUpdateTransition)
      .attr('x', getXAxisSerieTextPositionX)
      .tween('animateXAxisSerieTextValue', function(d, i) {
        return animateXAxisSerieTextValue(d, i, this);
      });
}

function getXAxisSerieItemPositionX(d, i) {
  return ((getXAxisSerieItemWidth() + 1) * i);
}

function getXAxisSerieItemWidth() {
  return ((chartWidth / dataVisualization.length) - 1);
}

function getXAxisSerieItemOpacity(d) {
  return (((d.total_count_ratio) * 0.4) + 0.6);
}

function getXAxisSerieTextPositionX(d, i) {
  return (getXAxisSerieItemPositionX(d, i) + (getXAxisSerieItemWidth() / 2));
}

function animateXAxisSerieTextValue(d, index, domElement) {
  var svgElement = d3.select(domElement);
  var start = ((parseFloat(svgElement.text()
    .replace(/[0-9]+[\+]* \w+ \(/g, '')
    .replace(/%\)/g, '')) || 0)  / 100);
  var itp = d3.interpolate(start, d.total_count_ratio);
  return function(tr) {
    svgElement.text(formatXAxisSerieTextValue(d.numterms, index, itp(tr)));
  };
}

function formatXAxisSerieTextValue(numterms, index, queryCountRatioNotContextualised) {
  var numtermsText = numterms;
  if (index === (dataVisualization.length - 1)) {
    numtermsText += '+';
  }
  var wordText = 'word';
  if (numterms !== 1) {
    wordText += 's';
  }
  return (numtermsText + ' ' + wordText + ' (' + (queryCountRatioNotContextualised * 100).toFixed(1) + '%)');
}

function updateCountRatioSeries(series) {
  series.select('.serieitem.countratio.notcontextualised')
      .attr('class', 'serieitem countratio ' + selectedCountRatioValue + ' notcontextualised')
    .transition().duration(durationUpdateTransition)
      .attr('x', getCountRatioNotContextualisedSerieItemPositionX)
      .attr('y', getCountRatioNotContextualisedSerieItemPositionY)
      .attr('width', getSerieItemWidth())
      .attr('height', getCountRatioNotContextualisedSerieItemHeight);

  series.select('.serietext.countratio.csu.notcontextualised')
      .attr('class', 'serietext countratio csu ' + selectedCountRatioValue + ' notcontextualised')
      .style('display', function(d) {
        return getCountRatioSerieTextCsuDisplay(d, false);
      });

  series.select('.serietext.countratio.countratiovalue.notcontextualised')
      .attr('class', 'serietext countratio countratiovalue ' + selectedCountRatioValue + ' notcontextualised')
      .style('display', function(d) {
        return getCountRatioSerieTextDisplay(d, false);
      })
    .transition().duration(durationUpdateTransition)
      .attr('y', getCountRatioNotContextualisedSerieTextPositionY)
      .tween('animateCountRatioSerieTextValue', function(d) {
        return animateCountRatioSerieTextValue(d, false, this);
      });

  series.select('.serieitem.countratio.contextualised')
      .attr('class', 'serieitem countratio ' + selectedCountRatioValue + ' contextualised')
      .style('opacity', 0.75)
    .transition().duration(durationUpdateTransition)
      .attr('x', getCountRatioContextualisedSerieItemPositionX)
      .attr('y', getCountRatioContextualisedSerieItemPositionY)
      .attr('width', getSerieItemWidth())
      .attr('height', getCountRatioContextualisedSerieItemHeight)
      .style('opacity', 1);

  series.select('.serietext.countratio.csu.contextualised')
      .attr('class', 'serietext countratio csu ' + selectedCountRatioValue + ' contextualised')
      .style('display', function(d) {
        return getCountRatioSerieTextCsuDisplay(d, true);
      });

  series.select('.serietext.countratio.countratiovalue.contextualised')
    .attr('class', 'serietext countratio countratiovalue ' + selectedCountRatioValue + ' contextualised')
      .style('display', function(d) {
        return getCountRatioSerieTextDisplay(d, true);
      })
    .transition().duration(durationUpdateTransition)
      .attr('y', getCountRatioContextualisedSerieTextPositionY)
      .tween('animateCountRatioSerieTextValue', function(d) {
        return animateCountRatioSerieTextValue(d, true, this);
      });

  series.select('.serietext.countratio.difference')
      .attr('class', getCountRatioDifferenceSerieTextCls)
    .transition().duration(durationUpdateTransition)
      .attr('class', getCountRatioDifferenceSerieTextCls)
      .attr('x', getCountRatioDifferenceSerieTextPositionX)
      .attr('y', getCountRatioDifferenceSerieTextPositionY)
      .tween('animateCountRatioDifferenceSerieTextValue', function(d) {
        return animateCountRatioDifferenceSerieTextValue(d, this);
      });
}

function getCountRatioNotContextualisedSerieItemPositionX(d, i) {
  return getCountRatioSerieItemPositionX(d.not_contextualised_data, i);
}

function getCountRatioSerieItemPositionX(d, i) {
  var serieItemPositionX = (getXAxisSerieItemPositionX(d, i) + ((chartWidth / dataVisualization.length) / 2));
  if (d.contextualised) {
    serieItemPositionX += (marginItemsSerie / 2);
  } else {
    serieItemPositionX -= ((marginItemsSerie / 2) + getSerieItemWidth());
  }

  return serieItemPositionX;
}

function getSerieItemWidth() {
  return ((((chartWidth / dataVisualization.length) - marginSeries) / 2) - (marginItemsSerie / 2));
}

function getCountRatioNotContextualisedSerieItemPositionY(d) {
  return getCountRatioSerieItemPositionY(d.not_contextualised_data);
}

function getCountRatioSerieItemPositionY(d) {
  return y(getSelectedCountRatioValue(d));
}

function getCountRatioNotContextualisedSerieItemHeight(d) {
  return getCountRatioSerieItemHeight(d.not_contextualised_data);
}

function getCountRatioSerieItemHeight(d) {
  return y(maxDomainOfY - getSelectedCountRatioValue(d));
}

function getCountRatioContextualisedSerieItemPositionX(d, i) {
  return getCountRatioSerieItemPositionX(d.contextualised_data, i);
}

function getCountRatioContextualisedSerieItemPositionY(d) {
  return getCountRatioSerieItemPositionY(d.contextualised_data);
}

function getCountRatioContextualisedSerieItemHeight(d) {
  return getCountRatioSerieItemHeight(d.contextualised_data);
}

function getCountRatioDifferenceSerieTextPositionX(d, i) {
  return getCountRatioContextualisedSerieItemPositionX(d, i) + (getSerieItemWidth() / 2);
}

function getCountRatioDifferenceSerieTextPositionY(d) {
  return (getCountRatioContextualisedSerieItemPositionY(d) - 5);
}

function getCountRatioDifferenceSerieTextCls(d) {
  var cls = 'serietext countratio ' + selectedCountRatioValue + ' difference';
  var countRatioDifference = getSelectedCountRatioDifferenceValue(d.contextualised_data);
  if (countRatioDifference > 0) {
    cls += ' positive';
  } else {
    if (countRatioDifference < 0) {
      cls += ' negative';
    }
  }
  return cls;
}

function getSelectedCountRatioDifferenceValue(d) {
  switch(selectedCountRatioValue) {
    case countRatioValues.FINDABILITY:
      return d.findability_difference;
    case countRatioValues.CTR:
      return d.ctr_difference;
    case countRatioValues.CVR:
      return d.cvr_difference;
    default:
      console.error('"selectedcountratiovalue" not valid. ');
      break;
  }
}

function animateCountRatioDifferenceSerieTextValue(d, domElement) {
  var svgElement = d3.select(domElement);
  var start = ((parseFloat(svgElement.text()
    .replace(/%/g, '')) || 0)  / 100);
  var itp = d3.interpolate(start, getSelectedCountRatioDifferenceValue(d.contextualised_data));
  return function(tr) {
    svgElement.text(formatCountRatioDifferenceSerieTextValue(itp(tr)));
  };
}

function formatCountRatioDifferenceSerieTextValue(countRatioDifference) {
  var countRatioDifferenceText = '';

  if (countRatioDifference > 0) {
    countRatioDifferenceText = '+';
  }
  countRatioDifferenceText += ((countRatioDifference * 100).toFixed(1) + '%');

  return countRatioDifferenceText;
}

function enterSeries(series) {
  var enterSeries = series.enter().append('g')
      .attr('class', 'serie');

  enterXAxisSeries(enterSeries);

  enterCountRatioSeries(enterSeries);
}

function enterXAxisSeries(enterSeries) {
  enterSeries.append('rect')
      .attr('class', 'serieitem xaxis')
      .attr('x', getXAxisSerieItemPositionX)
      .attr('y', (chartInnerHeight + xAxisMargin))
      .attr('width', getXAxisSerieItemWidth)
      .attr('height', (xAxisHeight - xAxisMargin))
      .style('opacity', 0)
    .transition().duration(durationEnterTransition)
      .style('opacity', getXAxisSerieItemOpacity);

  enterSeries.append('text')
      .attr('class', 'serietext xaxis')
      .attr('x', getXAxisSerieTextPositionX)
      .attr('y', (chartHeight - 7))
      .text(getXAxisSerieTextValue)
      .style('opacity', 0)
    .transition().duration(durationEnterTransition)
      .style('opacity', 1);
}

function getXAxisSerieTextValue(d, i) {
  return formatXAxisSerieTextValue(d.numterms, i, d.total_count_ratio);
}

function enterCountRatioSeries(enterSeries) {
  enterSeries.append('rect')
      .attr('class', 'serieitem countratio ' + selectedCountRatioValue + ' notcontextualised')
      .attr('x', getCountRatioNotContextualisedSerieItemPositionX)
      .attr('y', getCountRatioNotContextualisedSerieItemPositionY)
      .attr('width', getSerieItemWidth())
      .attr('height', getCountRatioNotContextualisedSerieItemHeight)
      .style('opacity', 0)
    .transition().duration(durationEnterTransition)
      .style('opacity', 0.75);

  enterSeries.append('text')
      .attr('class', 'serietext countratio csu ' + selectedCountRatioValue + ' notcontextualised')
      .style('display', function(d) {
        return getCountRatioSerieTextCsuDisplay(d, false);
      })
      .attr('x', getCountRatioNotContextualisedSerieTextPositionX)
      .attr('y', (chartInnerHeight - 5))
      .text(getSerieTextCsuValue(false))
      .style('opacity', 0)
    .transition().duration(durationEnterTransition)
      .style('opacity', 1);

  enterSeries.append('text')
      .attr('class', 'serietext countratio countratiovalue ' + selectedCountRatioValue + ' notcontextualised')
      .style('display', function(d) {
        return getCountRatioSerieTextDisplay(d, false);
      })
      .attr('x', getCountRatioNotContextualisedSerieTextPositionX)
      .attr('y', getCountRatioNotContextualisedSerieTextPositionY)
      .text(function(d) {
        return getCountRatioSerieTextValue(d, false);
      })
      .style('opacity', 0)
    .transition().duration(durationEnterTransition)
      .style('opacity', 1);

  enterSeries.append('rect')
      .attr('class', 'serieitem countratio ' + selectedCountRatioValue + ' contextualised')
      .attr('x', getCountRatioContextualisedSerieItemPositionX)
      .attr('y', getCountRatioContextualisedSerieItemPositionY)
      .attr('width', getSerieItemWidth())
      .attr('height', getCountRatioContextualisedSerieItemHeight)
      .style('opacity', 0)
    .transition().duration(durationEnterTransition)
      .style('opacity', 1);

  enterSeries.append('text')
      .attr('class', 'serietext countratio csu ' + selectedCountRatioValue + ' contextualised')
      .style('display', function(d) {
        return getCountRatioSerieTextCsuDisplay(d, true);
      })
      .attr('x', getCountRatioContextualisedSerieTextPositionX)
      .attr('y', (chartInnerHeight - 5))
      .text(getSerieTextCsuValue(true))
      .style('opacity', 0)
    .transition().duration(durationEnterTransition)
      .style('opacity', 1);

  enterSeries.append('text')
      .attr('class', 'serietext countratio countratiovalue ' + selectedCountRatioValue + ' contextualised')
      .style('display', function(d) {
        return getCountRatioSerieTextDisplay(d, true);
      })
      .attr('x', getCountRatioContextualisedSerieTextPositionX)
      .attr('y', getCountRatioContextualisedSerieTextPositionY)
      .text(function(d) {
        return getCountRatioSerieTextValue(d, true);
      })
      .style('opacity', 0)
    .transition().duration(durationEnterTransition)
      .style('opacity', 1);

  enterSeries.append('text')
      .attr('class', getCountRatioDifferenceSerieTextCls)
      .attr('x', getCountRatioDifferenceSerieTextPositionX)
      .attr('y', getCountRatioDifferenceSerieTextPositionY)
      .text(getCountRatioDifferenceSerieTextValue)
      .style('opacity', 0)
    .transition().duration(durationEnterTransition)
      .style('opacity', 1);
}

function formatCountRatioSerieTextValue(d) {
  return ((getSelectedCountRatioValue(d) * 100).toFixed(1) + '%');
}

function getCountRatioDifferenceSerieTextValue(d) {
  return formatCountRatioDifferenceSerieTextValue(getSelectedCountRatioDifferenceValue(d.contextualised_data));
}

function getCountRatioSerieTextCsuDisplay(d, isContextualised) {
  return getSerieTextCsuDisplay(getSelectedCountRatioValue(isContextualised ?
    d.contextualised_data : d.not_contextualised_data));
}

function getSerieTextCsuDisplay(countRatio) {
  if ((countRatio / maxDomainOfY) > 0.1) {
    return 'block';
  } else {
    return 'none';
  }
}

function getCountRatioSerieTextDisplay(d, isContextualised) {
  return getSerieTextDisplay(getSelectedCountRatioValue(isContextualised ?
    d.contextualised_data : d.not_contextualised_data));
}

function getSerieTextDisplay(countRatio) {
  if ((countRatio / maxDomainOfY) > 0.1) {
    return 'block';
  } else {
    return 'none';
  }
}

function getCountRatioNotContextualisedSerieTextPositionY(d) {
  return (getCountRatioNotContextualisedSerieItemPositionY(d) + 15);
}

function animateCountRatioSerieTextValue(d, isContextualised, domElement) {
  var svgElement = d3.select(domElement);
  var start = ((parseFloat(svgElement.text()
    .replace(/%/g, '')) || 0)  / 100);
  var itp = d3.interpolate(start, getSelectedCountRatioValue(isContextualised ?
    d.contextualised_data : d.not_contextualised_data));
  return function(tr) {
    svgElement.text((itp(tr) * 100).toFixed(1) + '%');
  };
}

function getCountRatioSerieTextValue(d, isContextualised) {
  return formatCountRatioSerieTextValue(isContextualised ? d.contextualised_data : d.not_contextualised_data);
}

function getCountRatioContextualisedSerieTextPositionY(d) {
  return (getCountRatioContextualisedSerieItemPositionY(d) + 15);
}

function getCountRatioNotContextualisedSerieTextPositionX(d, i) {
  return getCountRatioNotContextualisedSerieItemPositionX(d, i) + (getSerieItemWidth() / 2);
}

function getSerieTextCsuValue(isContextualised) {
  if (isContextualised) {
    return 'CSU';
  } else {
    return 'Non CSU';
  }
}

function getCountRatioContextualisedSerieTextPositionX(d, i) {
  return getCountRatioContextualisedSerieItemPositionX(d, i) + (getSerieItemWidth() / 2);
}


// MAIN -----------------------------------------------------------------------

var chartContainerWidth = 800;
var chartContainerHeight = 550;

d3.select(self.frameElement).style('height', (chartContainerHeight + 'px'));

var chartContainerPaddings = {
  top: 20,
  right: 25,
  bottom: 25,
  left: 25
};

var formHeight = 50;

var chartWidth = (chartContainerWidth - (chartContainerPaddings.left + chartContainerPaddings.right));
var chartHeight =
  (chartContainerHeight - (chartContainerPaddings.top + chartContainerPaddings.bottom) - formHeight);

var chartContainer = d3.select('#contextualise-prototype-chartcontainer')
    .attr('width', chartContainerWidth)
    .attr('height', chartContainerHeight);

var chart = chartContainer.append('g')
    .attr('class', 'chart')
    .attr('transform', 'translate(' + chartContainerPaddings.left + ','
      + (formHeight + chartContainerPaddings.top) + ')');

var marginSeries = 18;
var marginItemsSerie = 2;

var xAxisHeight = 27;
var xAxisMargin = 5;
var chartInnerHeight = (chartHeight - xAxisHeight);

launchVisualization();
