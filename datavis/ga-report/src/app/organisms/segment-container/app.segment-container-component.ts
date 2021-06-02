import {
  Component,
  ViewEncapsulation
} from '@angular/core';
import {
  select
} from 'd3-selection';
import {
  parseDataForMetric
} from './../../utils/dataFormatter';
import {
  scaleBand
} from 'd3-scale';
import {
  LineChartComponent
} from './../line-chart/app.line-chart-component';

@Component({
  selector: '[segment-container]',
  template: '<svg:g id="inner-segment-container"></svg:g>',
  styles: [`
    .rect {
      fill: rgba(0,0,0,0);
      stroke-width: .5;
      stroke: rgb(0,0,0);
    }
    .rect:hover {
      fill: rgba(0,0,0,.3);
      transition: fill .2s;
    }
    .segments {
      font-size: 1rem;
    }
    .segmentLine {
      stroke-width: 1.5;
      stroke: rgb(0,0,0);
    }
  `],
  encapsulation: ViewEncapsulation.None
})

export class SegmentContainerComponent {

  margin = {
    top: 40,
    right: 0,
    bottom: 0,
    left: 0
  };

  width = 200 - this.margin.left - this.margin.right;
  height = 250 - this.margin.top - this.margin.bottom;

  lineChart = new LineChartComponent;

  renderContainer = data => {

    const {
      segments
    } = parseDataForMetric(data, 'visits');

    const y = scaleBand()
      .range([0, this.height])
      .domain(segments);

    const g = select('#inner-segment-container')
      .attr('transform', `translate(250,${this.margin.top})`);

    g.append('g')
      .attr('class', 'header')
      .append('text')
      .attr('transform', `translate(${this.width/2}, ${-13})`)
      .style('text-anchor', 'middle')
      .text('Device Type');

    g.append('g')
      .selectAll('g')
      .data(segments)
      .enter()
      .append('rect')
      .attr('class', 'rect')
      .attr('id', d => `${d}_segment`)
      .attr('x', 0)
      .attr('y', d => y(d)+5)
      .on('mouseover', d => {
        this.lineChart.displaySegment(d, segments)
      })
      .on('mouseout', d => {
        this.lineChart.displaySegment('All', segments)
      })
      .attr('height', y.bandwidth()-10)
      .attr('width', this.width);

    g.append('g')
      .selectAll('g')
      .data(segments)
      .enter()
      .append('text')
      .attr('class', 'segments')
      .attr('text-anchor', 'middle')
      .text(d => d)
      .style('pointer-events', 'none')
      .attr('x', this.width / 2)
      .attr('y', d => y(d) + y.bandwidth() / 2 + 7);

    g.append('line')
      .attr('class', 'segmentLine')
      .attr('x1', 0)
      .attr('y1', -50)
      .attr('x2', 0)
      .attr('y2', 5);

    g.append('line')
      .attr('class', 'segmentLine')
      .attr('x1', this.width)
      .attr('y1', -50)
      .attr('x2', this.width)
      .attr('y2', 5);

  };
}
