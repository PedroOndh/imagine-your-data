const showDistributionData = (distributionData, index) => {
  hideDistributionData();

  const nestedDistributionData = d3.nest()
    .key((d) => d.language)
    .entries(distributionData[index].values);
  const distributionChartContainer = d3.select('#distributionCharts')
    .attr('viewBox', `0 0 ${width} ${80}`);

  distributionChartContainer.append('text')
    .text(`Distribution of Amount of Keywords in Search Queries at ${index}:00`)
    .style('text-anchor', 'middle')
    .style('font-size', 12)
    .attr('transform', `translate(${(width/2)+20},${78})`);

  const chartCount = nestedDistributionData.length;
  const chartWidth = width / chartCount;
  const chartHeight = 50;

  nestedDistributionData.forEach((languageRow, index) => {
    const data =  languageRow.values;
    const x = d3.scaleBand().rangeRound([0, chartWidth - axisAnchor.y]);
    const y = d3.scaleLinear().range([chartHeight, 5]);

    x.domain([1,2,3,4,5,6,'+7']);
    y.domain([0, 15000]);

    const chartXPosition = ((width / (chartCount + 1)) * (index + 1)) - ((chartWidth/2 - axisAnchor.y)+9);

    const xaxis = distributionChartContainer.append('g')
      .attr('transform', `translate(${chartXPosition},${chartHeight})`)
      .style('font-size', 4)
      .style('stroke-width', .4)
      .call(d3.axisBottom(x).scale(x).tickSize(0));
    const yaxis = distributionChartContainer.append('g')
      .attr('transform', `translate(${chartXPosition},0)`)
      .style('font-size', 4)
      .style('stroke-width', .4)
      .call(d3.axisLeft(y).ticks(3).tickSize(1));

    data.forEach((row) => {
      distributionChartContainer.append('rect')
        .data([row])
        .attr('class', 'rect')
        .style('fill', (d, i) => getBrokerColorByIndex(index))
        .attr('y', (d) => y(d.total_count))
        .attr('width', 8)
        .attr('x', (d) => ((x(d.keyword_count) + chartXPosition + x.bandwidth()/2)-3.5))
        .attr('height', (d) => chartHeight - y(d.total_count));
    });
  });
};

const hideDistributionData = () => {
  const distributionChartNode = document.getElementById('distributionCharts');
  while (distributionChartNode.hasChildNodes()) {
    distributionChartNode.removeChild(distributionChartNode.lastChild);
}
};
