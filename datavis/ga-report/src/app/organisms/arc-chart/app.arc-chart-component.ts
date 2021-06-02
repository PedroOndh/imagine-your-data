import {
  Component,
  ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3'; // importing arc sepcifcally returns undefined?
import {
  select
} from 'd3-selection';
import {
  parseDataForMetric
} from './../../utils/dataFormatter';
import {
  scaleLinear,
  scaleBand,
  scaleOrdinal
} from 'd3-scale';
import {
  max,
  min
} from 'd3-array';
import {
  makeYoyString,
  makePercentString
} from './../../utils/valueFormatter';


@Component({
  selector: '[arc-chart]',
  template: '<svg:g id="inner-arc-chart"></svg:g>',
  styles: [`
    .grid {
      stroke: lightgrey;
      stroke-opacity: 0.7;
      stroke-dasharray: 2;
      shape-rendering: crispEdges;
    }
    .arcs {
      stroke-width:1;
      stroke: #000;
    }
  `],
  encapsulation: ViewEncapsulation.None
})

export class ArcChartComponent {

  margin = {
    top: 40,
    right: 0,
    bottom: 0,
    left: 0
  };

  width = 250 - this.margin.left - this.margin.right;
  height = 500 - this.margin.top - this.margin.bottom;

  getArcLengthForKey = (d, key, x, y) => {
    return -x(d[key]) * y(d.device_type) * 2 * Math.PI
  }

  makeLegend = (legendContainer, segments) => {
    legendContainer.append('text')
      .attr('class', 'header')
      .attr('width', 100)
      .attr('x', 75)
      .attr('dy', -15)
      .append('textPath')
      .attr('xlink:xlink:href', d => '#arc_label')
      .text('Conversion Rate');

    // legendContainer.append('text')
    //   .attr('class', 'legend')
    //   .attr('width', 100)
    //   .attr('x', 60)
    //   .attr('dy', -10)
    //   .append('textPath')
    //   .attr('xlink:xlink:href', d => '#arc_label')
    //   .text('▉ With Search')
    //   .attr('fill', '#67A5B0');
    //
    // legendContainer.append('text')
    //   .attr('class', 'legend')
    //   .attr('width', 100)
    //   .attr('x', 130)
    //   .attr('dy', -10)
    //   .append('textPath')
    //   .attr('xlink:xlink:href', d => '#arc_label')
    //   .text('▉ Without Search')
    //   .attr('fill', '#E4A62F');
  }

  makeGrid = gridContainer => {
    const x1 = this.width;
    const y1 = this.height / 2 + 20;
    const length = 230;

    gridContainer.append('line')
      .attr('x1', x1)
      .attr('x2', x1 - length)
      .attr('y1', y1)
      .attr('y2', y1)
      .attr('stroke', '#000');

    gridContainer.append('line')
      .attr('x1', x1)
      .attr('x2', x1)
      .attr('y1', 0)
      .attr('y2', y1)
      .attr('stroke', '#000');

    const angledGridContainer = gridContainer.append('g');

    angledGridContainer.append('line')
      .attr('x1', x1)
      .attr('x2', x1)
      .attr('y1', y1)
      .attr('y2', y1 - length)
      .attr('stroke', '#000');

    angledGridContainer.append('line')
      .attr('x1', x1)
      .attr('x2', x1 - length)
      .attr('y1', y1)
      .attr('y2', y1)
      .attr('stroke', '#000');

    angledGridContainer.attr('transform', `rotate(-45, ${x1}, ${y1})`)
  }

  renderChart = data => {

    const {
      segments,
      keys,
      parsedData
    } = parseDataForMetric(data, 'conversion_rate');


    let values = [];
    keys.forEach(metric => {
      parsedData.forEach(row => {
        values.push(row[metric]);
      })
    });
    const yTop = +max(values);
    const yLow = +min(values);


    const x = scaleLinear()
      .range([0, -.75])
      .domain([0, yTop]);

    const y = scaleBand()
      .range([this.height / 2, 22])
      .domain(segments);

    const z = scaleOrdinal()
      .range(['#67A5B0', '#E4A62F'])
      .domain(keys);

    const g = select('#inner-arc-chart');

    this.makeGrid(
      g.append('g')
      .attr('class', 'grid')
    );

    keys.forEach((key, index) => {
      const bandWidth = y.bandwidth() / 2 - 5;
      const offset = index * bandWidth - 5;
      const totalWidth = bandWidth * 2;
      const arcWidth = totalWidth / 2;

      const arc = d3.arc()
        .innerRadius(d => y(d.device_type) - offset)
        .outerRadius(d => y(d.device_type) + arcWidth - offset)
        .startAngle(d => {
          return (x(d[key]) * Math.PI);
        })
        .endAngle(0);

      const labelArc = d3.arc()
        .innerRadius(d => y('All') - offset)
        .outerRadius(d => y('All') + arcWidth - offset)
        .startAngle(-1)
        .endAngle(0);

      g.append('g')
        .attr('class', 'arcs')
        .selectAll('path')
        .data(parsedData)
        .enter()
        .append('path')
        .attr('transform', d => {
          const yPos = (this.height / 2) - arcWidth + 1;
          return `translate(${this.width},${yPos+this.margin.top})`;
        })
        .style('fill', z(key))
        .attr('d', arc);

      const bendLabels = g.append('g');
      bendLabels.append('defs')
        .selectAll('defs')
        .data(parsedData)
        .enter()
        .append('path')
        .attr('transform', d => {
          const yPos = (this.height / 2) - arcWidth;
          return `translate(${this.width},${yPos+this.margin.top})`;
        })
        .attr('id', (d, i) => `arc_${index}_${i}`)
        .attr('d', arc);

      bendLabels
        .select('defs')
        .append('path')
        .attr('transform', `translate(${this.width},${(this.height / 2) - arcWidth+this.margin.top})`)
        .attr('id', `arc_label`)
        .attr('d', labelArc);

      bendLabels.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(parsedData)
        .enter()
        .append('text')
        .attr('width', 100)
        .attr('x', 0)
        .attr('dy', bandWidth - 5)
        // To Do: refactor and clean up!
        .attr('transform', (d, i) => `rotate(${x(yTop)*12/y(d.device_type) * 180}, ${this.width}, ${this.height/2 + arcWidth})`)
        .append('textPath')
        .attr('xlink:xlink:href', (d, i) => `#arc_${index}_${i}`)
        .style('fill', z(key))
        .text((d, i) => (i < segments.length - 1) ? makePercentString(d[key]) : '');

      bendLabels.append('g')
        .attr('class', 'yoy_labels')
        .selectAll('text')
        .data(parsedData)
        .enter()
        .append('text')
        .attr('width', 100)
        .attr('x', 0)
        .attr('dy', bandWidth - 7)
        // To Do: refactor and clean up!
        .attr('transform', (d) => `rotate(${500/y(d.device_type)}, ${this.width}, ${this.height/2 + arcWidth})`)
        .append('textPath')
        .attr('xlink:xlink:href', (d, i) => `#arc_${index}_${i}`)
        .attr('fill', d => d[key + '_yoy'] < 0 ? 'red' : 'green') // TO DO: use specific colours
        .text((d, i) => {
          let yoyString = '';
          const arcLength = this.getArcLengthForKey(d, key, x, y);
          if (arcLength > 150) {
            const yoyValue = d[`${key}_yoy`];
            if (yoyValue) {
              yoyString = makeYoyString(d[`${key}_yoy`])
            }
          }
          return yoyString;
        });

      this.makeLegend(bendLabels.append('g'), segments);
    });
  };
}
