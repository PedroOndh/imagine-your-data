import {
  Component,
  ViewEncapsulation
} from '@angular/core';
import {
  select
} from 'd3-selection';
import {
  axisBottom,
  axisLeft
} from 'd3-axis';
import {
  scaleLinear,
  scaleBand,
  scaleOrdinal
} from 'd3-scale';
import {
  readCsvFile
} from './../../utils/fileReader';
import {
  parseDataForMetric
} from './../../utils/dataFormatter';
import {
  makeMillString,
  makeYoyString
} from './../../utils/valueFormatter';

@Component({
  selector: '[bar-chart]',
  template: '<svg:g id="inner-bar-chart"></svg:g>',
  styles: [`
    .grid {
      stroke: lightgrey;
      stroke-opacity: 0.3;
      stroke-dasharray: 2;
      shape-rendering: crispEdges;
    }
    .bar {
      stroke-width:1;
      stroke: #000;
    }
  `],
  encapsulation: ViewEncapsulation.None
})

export class BarChartComponent {

  margin = {
    top: 40,
    right: 0,
    bottom: 0,
    left: 0
  };

  yellow = '#E4A62F';
  blue = '#67A5B0';

  width = 400 - this.margin.left - this.margin.right;
  height = 250 - this.margin.top - this.margin.bottom;

  getYoyForPoint = point => {
    let currentKey = 'without_yoy'
    if (point[1] === point.data.with) {
      currentKey = 'with_yoy'
    }
    return point.data[currentKey];
  }

  renderLegend = legenContainer => {
    legenContainer
      .append('text')
      .attr('class', 'header')
      .attr('transform', `translate(${15}, ${-13})`)
      .text('Visits');

    // legenContainer.append('text')
    //   .attr('class', 'legend')
    //   .attr('transform', `translate(${5}, ${-6})`)
    //   .text('▉ With Search')
    //   .attr('fill', this.blue);
    //
    // legenContainer.append('text')
    //   .attr('class', 'legend')
    //   .attr('transform', `translate(${75}, ${-6})`)
    //   .text('▉ Without Search')
    //   .attr('fill', this.yellow);
  }

  renderChart = data => {

    const {
      segments,
      maxValue,
      keys,
      stackedData
    } = parseDataForMetric(data, 'visits');

    const y = scaleBand()
      .range([0, this.height])
      .domain(segments);

    const z = scaleOrdinal()
      .range([this.blue, this.yellow])
      .domain(keys);

    const x = scaleLinear()
      .range([0, this.width])
      .domain([0, maxValue]);

    const g = select('#inner-bar-chart')
      .attr('transform', `translate(${450+this.margin.left}+${this.margin.top})`);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.height})`)
      .call(axisBottom(x)
        .ticks(3)
        .tickFormat(d => makeMillString(d))
        .tickSizeOuter([-10]));

    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${this.height})`)
      .call(axisBottom(x)
        .ticks(3)
        .tickFormat('')
        .tickSizeInner([-this.height]));

    this.renderLegend(
      g.append('g'));

    const bars = g.append('g')
      .attr('class', 'bars')
      .selectAll('g')
      .data(stackedData)
      .enter().append('g')
      .attr('fill', d => z(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d[0]))
      .attr('y', d => y(d.data.device_type) + 5)
      .attr('width', d => x(d[1]) - x(d[0]))
      .attr('height', y.bandwidth() - 10)

    const labels = g.append('g')
      .attr('class', 'labels')
      .selectAll('g')
      .data(stackedData)
      .enter().append('g')
      .attr('fill', d => z(d.key))
      .attr('transform', d => `translate(0, ${23+d.index*15})`)
      .selectAll('rect')
      .data((d) => d)
      .enter().append('text')
      .attr('x', d => x(d.data.with + d.data.without) + 5)
      .attr('y', d => y(d.data.device_type))
      .text((d) => makeMillString(d[1] - d[0]));

    const yoyLabels = g.append('g')
      .attr('class', 'yoy_labels')
      .selectAll('g')
      .data(stackedData)
      .enter().append('g')
      .attr('transform', `translate(0, ${y.bandwidth()/2+5})`)
      .selectAll('rect')
      .data((d) => d)
      .enter().append('text')
      .attr('x', d => x(d[0]) + 5)
      .attr('y', d => y(d.data.device_type))
      .attr('fill', d => this.getYoyForPoint(d) < 0 ? 'red' : 'green') // TO DO: use specific colours
      .text((d) => {
        let yoyString = '';
        if (x(d[1]) > 50) {
          const yoyValue = this.getYoyForPoint(d);
          if (yoyValue) {
            yoyString = makeYoyString(yoyValue);
          }
        }
        return yoyString;
      });
  };
}
