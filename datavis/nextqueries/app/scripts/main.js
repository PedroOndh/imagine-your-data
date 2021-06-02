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
  readJsonFile(relativeDataPath + '/data/next_queries.json', function(dataRaw) {
    dataVisualization = formatDataVisualization(dataRaw);
    updateVisualization();
  });
}

function formatDataVisualization(dataRaw) {
  var dataFormatted = {
    initial_queries: {},
    next_queries: {},
    relations_queries: []
  };

  var initialQueriesData = dataFormatted.initial_queries;
  var nextQueriesData = dataFormatted.next_queries;
  var relationsQueriesData = dataFormatted.relations_queries;

  var data = dataRaw.data;
  data.sort(function(dataItemA, dataItemB) {
    return d3.descending(dataItemA.users_count, dataItemB.users_count);
  });

  for (var index in data) {
    var dataItem = data[index];

    var queryInitial = dataItem.query_initial;
    var queryNext = dataItem.query_next;
    var usersCount = dataItem.users_count;
    var sessionsCount = dataItem.sessions_count;
    var totalCount = dataItem.total_count;

    var dataItemQueryInitial = initialQueriesData[queryInitial];
    if (!dataItemQueryInitial) {
      initialQueriesData[queryInitial] = {
        query: queryInitial,
        is_initial_query: true,
        related_queries: [queryNext],
        users_count: usersCount,
        sessions_count: sessionsCount,
        total_count: totalCount
      };
    } else {
      dataItemQueryInitial.related_queries.push(queryNext);
      dataItemQueryInitial.users_count += usersCount;
      dataItemQueryInitial.sessions_count += sessionsCount;
      dataItemQueryInitial.total_count += totalCount;
    }

    var dataItemQueryNext = nextQueriesData[queryNext];
    if (!dataItemQueryNext) {
      nextQueriesData[queryNext] = {
        query: queryNext,
        is_initial_query: false,
        related_queries: [queryInitial],
        users_count: usersCount,
        sessions_count: sessionsCount,
        total_count: totalCount
      };
    } else {
      dataItemQueryNext.related_queries.push(queryInitial);
      dataItemQueryNext.users_count += usersCount;
      dataItemQueryNext.sessions_count += sessionsCount;
      dataItemQueryNext.total_count += totalCount;
    }

    var dataItemRelationQueries = {
      query_initial: queryInitial,
      query_next: queryNext,
      users_count: usersCount,
      sessions_count: sessionsCount,
      total_count: totalCount
    };
    relationsQueriesData.push(dataItemRelationQueries);
  }

  dataFormatted.initial_queries = {
    data: formatQueriesDataAsArray(initialQueriesData),
    are_initial_queries: true
  };

  dataFormatted.next_queries = {
    data: formatQueriesDataAsArray(nextQueriesData),
    are_initial_queries: false
  };

  return dataFormatted;
}

function formatQueriesDataAsArray(queriesDataAsObject) {
  var queriesDataAsArray = d3.values(queriesDataAsObject).map(function(dataItem) {
    return dataItem;
  });

  queriesDataAsArray.sort(function(dataItemA, dataItemB) {
    return d3.descending(dataItemA.users_count, dataItemB.users_count);
  });

  var usersCountAcum = 0;
  for (var index in queriesDataAsArray) {
    var dataItem = queriesDataAsArray[index];
    usersCountAcum += dataItem.users_count;
    dataItem.users_count_acum = usersCountAcum;
  }

  return queriesDataAsArray;
}


// VISUALIZATION --------------------------------------------------------------

function launchVisualization () {
  readDataVisualization();
}

function updateVisualization() {
  updateScales();
  updateChart();
}

var yScale, fontSizeInitialQueriesScale, fontSizeNextQueriesScale, fillOpacityInitialQueriesScale, fillOpacityNextQueriesScale;
var minValueOfFontSizeScaleRange = 11;
var maxValueOfFontSizeScaleRange = 14;
var minValueOfQueriesOpacityScaleRange = 0.4;
var maxValueOfQueriesOpacityScaleRange = 0.8;
function updateScales() {
  var initialQueriesData = dataVisualization.initial_queries.data;
  var maxValueOfY = (initialQueriesData[initialQueriesData.length - 1].users_count_acum || 0);
  yScale = d3.scaleLinear()
    .range([0, chartHeight])
    .domain([0, maxValueOfY]);

  fontSizeInitialQueriesScale = d3.scaleLinear()
    .range([minValueOfFontSizeScaleRange, maxValueOfFontSizeScaleRange])
    .domain([getMinValueOfUsersCount(initialQueriesData), getMaxValueOfUsersCount(initialQueriesData)]);
  var nextQueriesData = dataVisualization.next_queries.data;
  fontSizeNextQueriesScale = d3.scaleLinear()
    .range([minValueOfFontSizeScaleRange, maxValueOfFontSizeScaleRange])
    .domain([getMinValueOfUsersCount(nextQueriesData), getMaxValueOfUsersCount(nextQueriesData)]);

  fillOpacityInitialQueriesScale = d3.scaleLinear()
    .range([minValueOfQueriesOpacityScaleRange, maxValueOfQueriesOpacityScaleRange])
    .domain([getMinValueOfUsersCount(initialQueriesData), getMaxValueOfUsersCount(initialQueriesData)]);
  fillOpacityNextQueriesScale = d3.scaleLinear()
    .range([minValueOfQueriesOpacityScaleRange, maxValueOfQueriesOpacityScaleRange])
    .domain([getMinValueOfUsersCount(nextQueriesData), getMaxValueOfUsersCount(nextQueriesData)]);
}

function getMinValueOfUsersCount(queriesData) {
  return d3.min(queriesData, function(d) {
    return d.users_count;
  });
}

function getMaxValueOfUsersCount(queriesData) {
  return d3.max(queriesData, function(d) {
    return d.users_count;
  });
}

function updateChart() {
  updateQueriesChart(dataVisualization.initial_queries);
  updateQueriesChart(dataVisualization.next_queries);

  updateRelationsChart();
}

function updateQueriesChart(queriesData) {
  // --- JOIN ---
  var series = chart.selectAll(('.queryserie' + (queriesData.are_initial_queries ? '.initialqueryserie' : '.nextqueryserie')))
    .data(queriesData.data, queryKeyFunction);

  // --- REMOVE ---
  removeQueriesSeries(series);

  // --- UPDATE ---
  updateQueriesSeries(series);

  // --- ENTER ---
  var enterSeries = series.enter().append('g')
      .attr('class', ('queryserie' + (queriesData.are_initial_queries ? ' initialqueryserie' : ' nextqueryserie')));
  enterQueriesSeries(enterSeries);
}

function queryKeyFunction(d) {
  return (d.query + '&comma' + d.is_initial_query);
}

function removeQueriesSeries(series) {
  series.exit().remove();
}

var durationUpdateTransition = 800;
function updateQueriesSeries(series) {
  series.select('.queryserieitem')
      .style('opacity', minValueOfQueriesOpacityScaleRange)
    .transition().duration(durationUpdateTransition)
      .attr('y', getQuerySerieItemPositionY)
      .attr('height', getQuerySerieItemHeight)
      .style('opacity', getQuerySerieItemOpacity);

  series.select('.queryserietext')
      .style('opacity', 0.5)
    .transition().duration(durationUpdateTransition)
      .attr('y', getQuerySerieTextPositionY)
      .style('font-size', getQuerySerieTextFontSize)
      .style('opacity', 1);
}

function getQuerySerieItemPositionY(d) {
  return yScale(d.users_count_acum - d.users_count);
}

function getQuerySerieItemHeight(d) {
  return (yScale(d.users_count) - 1);
}

function getQuerySerieItemOpacity(d) {
  var opacity;
  if (d.is_initial_query) {
    opacity = fillOpacityInitialQueriesScale(d.users_count);
  } else {
    opacity = fillOpacityNextQueriesScale(d.users_count);
  }
  return opacity;
}

function getQuerySerieTextPositionY(d) {
  return (getQuerySerieItemPositionY(d) + getQuerySerieTextFontSize(d));
}

function getQuerySerieTextFontSize(d) {
  var fontSize;
  if (d.is_initial_query) {
    fontSize = fontSizeInitialQueriesScale(d.users_count);
  } else {
    fontSize = fontSizeNextQueriesScale(d.users_count);
  }
  return fontSize;
}

var querySerieItemWidth = 35;
var durationQueriesSeriesEnterTransition = 400;
function enterQueriesSeries(enterQueriesSeries) {
  enterQueriesSeries.append('rect')
      .attr('class', getQuerySerieItemCls)
      .on('mouseover', onMouseOverQuerySerie)
      .on('mouseout', onMouseOutQuerySerie)
      .on('click', onClickQuerySerie)
      .attr('x', getQuerySerieItemPositionX)
      .attr('y', getQuerySerieItemPositionY)
      .attr('width', querySerieItemWidth)
      .attr('height', getQuerySerieItemHeight)
      .style('opacity', 0)
    .transition().duration(durationQueriesSeriesEnterTransition)
      .style('opacity', getQuerySerieItemOpacity);

  enterQueriesSeries.append('text')
      .attr('class', getQuerySerieTextCls)
      .on('mouseover', onMouseOverQuerySerie)
      .on('mouseout', onMouseOutQuerySerie)
      .on('click', onClickQuerySerie)
      .attr('x', getQuerySerieTextPositionX)
      .attr('y', getQuerySerieTextPositionY)
      .text(function(d) {
        return d.query;
      })
      .style('font-size', getQuerySerieTextFontSize)
      .style('opacity', 0)
    .transition().duration(durationQueriesSeriesEnterTransition)
      .style('opacity', 0.9);
}

function getQuerySerieItemCls(d) {
  return ('queryserieitem' + (d.is_initial_query ? ' initialquery' : ' nextquery'));
}

var overClass = 'over';
var clickedClass = 'clicked';
function onMouseOverQuerySerie(d) {
  onQuerySerieSelected(d, d3.select(this.parentNode), overClass);
  changeRelationSerieItemFill();
}

var fillColorRelationSerieItem = '#81848B';
var fillGradientRelationSerieItem = 'url(#LinearGradientRelationSerieItem)';
function changeRelationSerieItemFill() {
  chart.selectAll('.relationserieitem')
      .attr('fill', fillColorRelationSerieItem);
  chart.selectAll('.relationserie.' + overClass).select('.relationserieitem')
      .attr('fill', fillGradientRelationSerieItem);
  chart.selectAll('.relationserie.' + clickedClass).select('.relationserieitem')
      .attr('fill', fillGradientRelationSerieItem);
}

function onMouseOutQuerySerie() {
  chart.selectAll('.queryserie').classed(overClass, false);
  chart.selectAll('.relationserie').classed(overClass, false);
  changeRelationSerieItemFill();
}

function onClickQuerySerie(d) {
  onQuerySerieSelected(d, d3.select(this.parentNode), clickedClass);
  changeRelationSerieItemFill();
}

var queryNotSelectedClass = 'querynotselected';
function onQuerySerieSelected(d, serie, selectedClass) {
  var selectedClassQueries = selectedClass;
  if (selectedClass !== overClass) {
    selectedClass += (d.is_initial_query ? ' initialqueryselected' : ' nextqueryselected');
    selectedClassQueries += (d.is_initial_query ? ' nextqueryselected' : ' initialqueryselected');
  }

  var isSelectedSerieItem = serie.classed(selectedClass);

  chart.selectAll('.queryserie').classed(selectedClassQueries, false);
  chart.selectAll('.relationserie').classed(selectedClassQueries, false);

  serie.classed(selectedClass, !isSelectedSerieItem);

  d3.selectAll(('.queryserie' + (d.is_initial_query ? '.nextqueryserie' : '.initialqueryserie')))
    .filter(function(dt) {
      return filterQuerySeriesSelectedByQuery(d, dt, true);
    })
      .classed(selectedClass, !isSelectedSerieItem);
  d3.selectAll('.relationserie')
    .filter(function(dt) {
      return filterRelationSeriesSelectedByQuery(d, dt, true);
    })
      .classed(selectedClass, !isSelectedSerieItem);

  if (selectedClass !== overClass) {
    chart.selectAll('.' + queryNotSelectedClass).classed(queryNotSelectedClass, false);
    if (!isSelectedSerieItem) {
      chart.selectAll('.queryserie')
        .filter(function(dt) {
          return filterQuerySeriesSelectedByQuery(d, dt, false);
        })
          .classed(queryNotSelectedClass, true);
      chart.selectAll('.relationserie')
        .filter(function(dt) {
          return filterRelationSeriesSelectedByQuery(d, dt, false);
        })
          .classed(queryNotSelectedClass, true);
    }
  }
}

function filterQuerySeriesSelectedByQuery(dataItemQuerySelected, dataItemQuery, filterSelected) {
  if (queryKeyFunction(dataItemQuerySelected) === queryKeyFunction(dataItemQuery)) {
    return filterSelected;
  }
  var relatedQueriesSelected = dataItemQuerySelected.related_queries;
  for (var index in relatedQueriesSelected) {
    if ((relatedQueriesSelected[index] === dataItemQuery.query) &&
      (dataItemQuerySelected.is_initial_query !== dataItemQuery.is_initial_query)) {
      return filterSelected;
    }
  }
  return !filterSelected;
}

function filterRelationSeriesSelectedByQuery(dataItemQuerySelected, dataItemRelation, filterSelected) {
  var queryOrigRelation = (dataItemQuerySelected.is_initial_query ? dataItemRelation.query_initial : dataItemRelation.query_next);
  var queryDestRelation = (dataItemQuerySelected.is_initial_query ? dataItemRelation.query_next : dataItemRelation.query_initial);
  var relatedQueriesSelected = dataItemQuerySelected.related_queries;
  if (queryOrigRelation === dataItemQuerySelected.query) {
    for (var index in relatedQueriesSelected) {
      if (relatedQueriesSelected[index] === queryDestRelation) {
        return filterSelected;
      }
    }
  }
  return !filterSelected;
}

function getQuerySerieItemPositionX(d) {
  var chartInnerWidth = (chartWidth / 1.75);
  var querySerieItemPositionX = (chartWidth / 2);
  if (d.is_initial_query) {
    querySerieItemPositionX -= (chartInnerWidth / 2);
  } else {
    querySerieItemPositionX += ((chartInnerWidth / 2)  - querySerieItemWidth);
  }
  return querySerieItemPositionX;
}

function getQuerySerieTextCls(d) {
  return ('queryserietext' + (d.is_initial_query ? ' initialquery' : ' nextquery'));
}

var marginQuerySerieText = 4;
function getQuerySerieTextPositionX(d) {
  var querySerieTextPositionX = getQuerySerieItemPositionX(d);
  if (d.is_initial_query) {
    querySerieTextPositionX -= marginQuerySerieText;
  } else {
    querySerieTextPositionX += (querySerieItemWidth + marginQuerySerieText);
  }
  return querySerieTextPositionX;
}

function updateRelationsChart() {
  // --- JOIN ---
  var series = chart.selectAll('.relationserie')
    .data(dataVisualization.relations_queries, relationKeyFunction);

  // --- REMOVE ---
  removeRelationsSeries(series);

  // --- UPDATE ---
  updateRelationsSeries(series);

  // --- ENTER ---
  enterRelationsSeries(series);
}

function relationKeyFunction(d) {
  return (d.query_initial + '&comma' + d.query_next);
}

function removeRelationsSeries(series) {
  series.exit().remove();
}

function updateRelationsSeries(series) {
  series.select('.relationserieitem')
    .transition().duration(durationUpdateTransition)
      .attr('d', getRelationSerieItemCommands);
}

function getRelationSerieItemCommands(d) {
  var initialQueryData = getQueryData(dataVisualization.initial_queries.data, d.query_initial);
  var initialQuerySerieItemPositionX = getQuerySerieItemPositionX(initialQueryData);
  var initialQuerySerieItemPositionY = getQuerySerieItemPositionY(initialQueryData);
  var initialQuerySerieItemHeight = getQuerySerieItemHeight(initialQueryData);

  var nextQueryData = getQueryData(dataVisualization.next_queries.data, d.query_next);
  var nextQuerySerieItemPositionX = getQuerySerieItemPositionX(nextQueryData);
  var nextQuerySerieItemPositionY = getQuerySerieItemPositionY(nextQueryData);
  var nextQuerySerieItemHeight = getQuerySerieItemHeight(nextQueryData);

  var points = [ {
    x: (initialQuerySerieItemPositionX + querySerieItemWidth),
    y: initialQuerySerieItemPositionY
  },{
    x: nextQuerySerieItemPositionX,
    y: nextQuerySerieItemPositionY
  },{
    x: nextQuerySerieItemPositionX,
    y: (nextQuerySerieItemPositionY + nextQuerySerieItemHeight)
  },{
    x: (initialQuerySerieItemPositionX + querySerieItemWidth),
    y: (initialQuerySerieItemPositionY + initialQuerySerieItemHeight)
  } ];

  var commands = ('M ' + points[0].x + ' ' + points[0].y);
  commands += ('L ' + points[1].x + ' ' + points[1].y);
  commands += ('L ' + points[2].x + ' ' + points[2].y);
  commands += ('L ' + points[3].x + ' ' + points[3].y);
  commands += ('L ' + points[0].x + ' ' + points[0].y);

  return (commands + ' Z');
}

function getQueryData(queriesData, query) {
  for (var index in queriesData) {
    var queryData = queriesData[index];
    if (queryData.query === query) {
      return queryData;
    }
  }
}

var durationRelationsSeriesEnterTransition = (durationQueriesSeriesEnterTransition * 1.5);
function enterRelationsSeries(series) {
  var enterSeries = series.enter().append('g')
      .attr('class', 'relationserie');

  enterSeries.append('path')
      .attr('class', 'relationserieitem')
      .on('mouseover', onMouseOverRelationSerieItem)
      .on('mouseout', onMouseOutRelationSerieItem)
      .on('click', onClickRelationSerieItem)
      .attr('d', getRelationSerieItemInitialCommands)
      .attr('fill', fillColorRelationSerieItem)
    .transition().duration(durationRelationsSeriesEnterTransition)
      .attr('d', getRelationSerieItemCommands);
}

function getRelationSerieItemInitialCommands(d) {
  var initialQueryData = getQueryData(dataVisualization.initial_queries.data, d.query_initial);
  var initialQuerySerieItemPositionX = getQuerySerieItemPositionX(initialQueryData);
  var initialQuerySerieItemPositionY = getQuerySerieItemPositionY(initialQueryData);
  var initialQuerySerieItemHeight = getQuerySerieItemHeight(initialQueryData);

  var points = [ {
    x: (initialQuerySerieItemPositionX + querySerieItemWidth),
    y: initialQuerySerieItemPositionY
  },{
    x: (initialQuerySerieItemPositionX + querySerieItemWidth),
    y: (initialQuerySerieItemPositionY + initialQuerySerieItemHeight)
  } ];

  var commands = ('M ' + points[0].x + ' ' + points[0].y);
  commands += ('L ' + points[0].x + ' ' + points[0].y);
  commands += ('L ' + points[1].x + ' ' + points[1].y);
  commands += ('L ' + points[1].x + ' ' + points[1].y);
  commands += ('L ' + points[0].x + ' ' + points[0].y);

  return (commands + ' Z');
}

function onMouseOverRelationSerieItem(d) {
  onRelationSerieItemSelected(d, d3.select(this.parentNode), overClass);
  changeRelationSerieItemFill();
}

function onMouseOutRelationSerieItem() {
  chart.selectAll('.queryserie').classed(overClass, false);
  chart.selectAll('.relationserie').classed(overClass, false);
  changeRelationSerieItemFill();
}

function onClickRelationSerieItem(d) {
  onRelationSerieItemSelected(d, d3.select(this.parentNode), clickedClass);
  changeRelationSerieItemFill();
}

function onRelationSerieItemSelected(d, serie, selectedClass) {
  var selectedClassQueries = selectedClass;
  if (selectedClass !== overClass) {
    selectedClassQueries += (' initialqueryselected' + ' nextqueryselected');
  }

  var isSelectedSerieItem = (serie.classed(selectedClass) &&
    !(serie.classed('initialqueryselected') || serie.classed('nextqueryselected')));

  chart.selectAll('.queryserie').classed(selectedClassQueries, false);
  chart.selectAll('.relationserie').classed(selectedClassQueries, false);

  serie.classed(selectedClass, !isSelectedSerieItem);

  d3.selectAll('.queryserie')
    .filter(function(dt) {
      return filterQuerySeriesSelectedByRelation(d, dt, true);
    })
      .classed(selectedClass, !isSelectedSerieItem);

  if (selectedClass !== overClass) {
    chart.selectAll('.' + queryNotSelectedClass).classed(queryNotSelectedClass, false);
    if (!isSelectedSerieItem) {
      chart.selectAll('.queryserie')
        .filter(function(dt) {
          return filterQuerySeriesSelectedByRelation(d, dt, false);
        })
          .classed(queryNotSelectedClass, true);
      chart.selectAll('.relationserie')
        .filter(function(dt) {
          return (relationKeyFunction(dt) !== relationKeyFunction(d));
        })
          .classed(queryNotSelectedClass, true);
    }
  }
}

function filterQuerySeriesSelectedByRelation(dataItemQuerySelected, dataItemQuery, filterSelected) {
  if((dataItemQuery.is_initial_query && (dataItemQuerySelected.query_initial === dataItemQuery.query))
    || (!dataItemQuery.is_initial_query && (dataItemQuerySelected.query_next === dataItemQuery.query))) {
    return filterSelected;
  }
  return !filterSelected;
}


// MAIN -----------------------------------------------------------------------

var chartContainerHeight = 550;
var chartContainerPaddings = {
  top: 25,
  right: 10,
  bottom: 30,
  left: 10
};

var chartContainer = d3.select('#nextqueries-chartcontainer')
    .attr('height', chartContainerHeight);

var chartContainerWidth = chartContainer.node().getBoundingClientRect().width;

var chartWidth = (chartContainerWidth - (chartContainerPaddings.left + chartContainerPaddings.right));
var chartHeight = (chartContainerHeight - (chartContainerPaddings.top + chartContainerPaddings.bottom));

var chart = chartContainer.append('g')
    .attr('class', 'chart')
    .attr('transform', 'translate(' + chartContainerPaddings.left + ',' + chartContainerPaddings.top + ')');

launchVisualization();
