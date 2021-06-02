d3.select('#linechart')
  .append('line')
  .attr('x1', 72)
  .attr('x2', 330)
  .attr('y1', 160)
  .attr('y2', 160)
  .attr('stroke', '#ffff66')
  .attr('stroke-width', 8);

d3.select('#linechart')
  .append('text')
  .attr('transform', 'translate(179,152)')
  .style('font-size', 12)
  .text('☀️');

d3.select('#linechart')
  .append('text')
  .style('font-size', 12)
  .attr('transform', 'translate(395,152)')
  .text('🌘');

  d3.select('#linechart')
    .append('line')
    .attr('x1', 328)
    .attr('x2', 530)
    .attr('y1', 160)
    .attr('y2', 160)
    .attr('stroke', '#6d99ba')
    .attr('stroke-width', 8)
