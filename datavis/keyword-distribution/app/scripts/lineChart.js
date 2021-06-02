const highlightPoints = (allSeries, index) => {
  allSeries.forEach((series) => {
    d3.select(`#${series.key}-${index}`)
      .transition()
      .duration(100)
      .attr('r', 4)
      .attr('stroke-width', 1)
      .attr('stroke', 'grey');
  });
};

const unhighlightPoints = (allSeries, index) => {
  allSeries.forEach((series) => {
    d3.select(`#${series.key}-${index}`)
      .transition()
      .duration(100)
      .attr('r', 2)
      .attr('stroke-width', 0);
  });
};

const displayLineChart = (data) => {
  const nestedData = d3.nest()
    .key((d) => d.language)
    .entries(data);

  const svg = d3.select('#linechart')
    .on('mouseleave', (d) => {
      highlightPoints(nestedData, 18);
      showDistributionData(distributionData, 18)
      hoverLine.append('line')
        .attr('x1', x(18)+(x.bandwidth()/2))
        .attr('x2', x(18)+(x.bandwidth()/2))
        .attr('y1', 0)
        .attr('id', 'hoverLine')
        .attr('y2', height-axisAnchor.y-10)
        .style('stroke-width', 1)
        .style('stroke', '#81848B');;
    })
    .on('mouseenter', (d) => {
      document.getElementById('hoverLine').remove();
      hideDistributionData();
      unhighlightPoints(nestedData , 18);
    })
    .attr('viewBox', `0 0 ${width} ${height+10}`)
    .append('g').attr('transform', `translate(${10},${10})`);

  const hoverLine = svg.append('g').attr('transform', `translate(${axisAnchor.y},0)`);
  const lineGroup = svg.append('g').attr('transform', `translate(${axisAnchor.y},0)`);
  const dotGroup = svg.append('g').attr('transform', `translate(${axisAnchor.y},0)`);
  const textGroup = svg.append('g').attr('transform', `translate(0,${height-5})`);
  const gridGroup = svg.append('g').attr('transform', `translate(${axisAnchor.y},0)`);

  let distributionData = {};
  readCsvFile('./data/distribution_data.csv', (distribData) => {
    distributionData = d3.nest()
      .key((d) => d.hour_of_day)
      .entries(distribData);
    highlightPoints(nestedData, 18);
    showDistributionData(distributionData, 18)
    hoverLine.append('line')
      .attr('x1', x(18)+(x.bandwidth()/2))
      .attr('x2', x(18)+(x.bandwidth()/2))
      .attr('y1', 0)
      .attr('id', 'hoverLine')
      .attr('y2', height-axisAnchor.y-10)
      .style('stroke-width', 1)
      .style('stroke', '#81848B');;
  });

  const x = d3.scaleBand().rangeRound([0, width - axisAnchor.y]);
  const y = d3.scaleLinear().range([axisAnchor.x, 0]);
  x.domain(data.map((d) => d.hourOfDay));
  y.domain([d3.min(data, (d) => d.avgKeywordsCount), d3.max(data, (d) => d.avgKeywordsCount)]);

  const xaxis = svg.append('g')
    .attr('transform', `translate(${axisAnchor.y},${axisAnchor.x})`)
    .style('font-size', 6)
    .style('stroke-width', .7)
    .call(d3.axisBottom(x).scale(x).tickSize(0));

  const yaxis = svg.append('g')
    .attr('transform', `translate(${axisAnchor.y},0)`)
    .style('font-size', 6)
    .style('stroke-width', .7)
    .call(d3.axisLeft(y).ticks(4).tickSize(2));

  svg.append('text')
    .attr('transform', `translate(${(width/2)},${axisAnchor.x+30})`)
    .attr('font-size', 8)
    .style('text-anchor', 'middle')
    .text('Hour of Day');

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('font-size', 8)
    .attr('y', 20)
    .attr('x', 0 - (axisAnchor.x / 2))
    .style('text-anchor', 'middle')
    .text('Avg. Words in Search Query');

  const valueLine = d3.line()
    .curve(d3.curveMonotoneX)
    .x((d) => (x(d.hourOfDay)+(x.bandwidth()/2)))
    .y((d) => y(+d.avgKeywordsCount))

  nestedData.forEach((series, seriesIndex) => {
    lineGroup.append('path')
      .data([series.values])
      .attr('class', 'line')
      .attr('d', valueLine)
      .style('fill', 'none')
      .style('stroke', (d, i) => getBrokerColorByIndex(seriesIndex))
      .style('stroke-width', 1);

    series.values.forEach((value, valueIndex) => {
      dotGroup.append('circle')
        .data([value])
        .attr('class', 'circle')
        .attr('id', (d) => `${series.key}-${d.hourOfDay}`)
        .attr('cx', (d) => x(d.hourOfDay)+(x.bandwidth()/2))
        .attr('cy', (d) => y(d.avgKeywordsCount))
        .attr('r', 2)
        .style('fill', (d, i) => getBrokerColorByIndex(seriesIndex));

      gridGroup.append('line')
        .attr('x1', x(valueIndex)+(x.bandwidth()/2))
        .attr('x2', x(valueIndex)+(x.bandwidth()/2))
        .attr('y1', 0)
        .attr('y2', height-axisAnchor.y-10)
        .data([value])
        .attr('class', 'hoverLine')
        .attr('id', (d) => `line-${d.hourOfDay}`)
        .style('stroke-width', 10)
        .style('stroke', '#81848B')
        .style('opacity', 0)
        .on('mouseover', () => {
          const previousLine = document.getElementById('hoverLine');
          if (previousLine) previousLine.remove();
          hoverLine.append('line')
            .attr('x1', x(valueIndex)+(x.bandwidth()/2))
            .attr('x2', x(valueIndex)+(x.bandwidth()/2))
            .attr('y1', 0)
            .attr('id', 'hoverLine')
            .attr('y2', height-axisAnchor.y-10)
            .style('stroke-width', 1)
            .style('stroke', '#81848B');
          highlightPoints(nestedData, valueIndex);
          showDistributionData(distributionData, valueIndex);
        })
        .on('mouseleave', (d) => {
          document.getElementById('hoverLine').remove();
          unhighlightPoints(nestedData, valueIndex);
        });
    });

    textGroup.append('text')
      .attr('transform', `translate(${(width/(nestedData.length+1))*(seriesIndex+1)},${0})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .style('fill', (d, i) => getBrokerColorByIndex(seriesIndex))
      .text(`⁓ ${series.key}`);
  });
}
