import {
  Component,
  ViewEncapsulation
} from '@angular/core';
import {
  select
} from 'd3-selection';
import {
  scaleLinear,
  scaleBand,
  scaleOrdinal
} from 'd3-scale';
import {
  max,
  min
} from 'd3-array';
import * as d3 from 'd3';

@Component({
  selector: '[line-chart]',
  template: '<svg:g id="inner-line-chart"></svg:g>',
  styles: [`
    .visibleLine {
      visibility: visible;
    }
    .hiddenLine {
      visibility: hidden;
    }
  `],
  encapsulation: ViewEncapsulation.None
})

export class LineChartComponent {

  margin = {
    top: 20,
    right: 0,
    bottom: 40,
    left: 0
  };

  width = 600 - this.margin.left - this.margin.right;
  height = 200 - this.margin.top - this.margin.bottom;

  metrics = [
    'conversion_ratewith',
    'conversion_ratewithout',
    'conversion_ratewith_prev',
    'conversion_ratewithout_prev'
  ];

  renderLegend = g => {
    g.append('text')
      .attr('transform', `translate(${-100}, ${this.height+50})`)
      .text('▉ With Search (current Year)')
      .style('font-size', 10)
      .attr('fill', '#67A5B0');

    g.append('text')
      .attr('transform', `translate(${60}, ${this.height+50})`)
      .text('▉ Without Search (current Year)')
      .style('font-size', 10)
      .attr('fill', '#E4A62F');

    g.append('text')
      .attr('transform', `translate(${240}, ${this.height+50})`)
      .text('▉ With Search (previous Year)')
      .style('font-size', 10)
      .attr('fill', '#bcd7dc');

    g.append('text')
      .attr('transform', `translate(${400}, ${this.height+50})`)
      .text('▉ Without Search (previous Year)')
      .style('font-size', 10)
      .attr('fill', '#f0ce8e');
  }

  displaySegment = (visibleSegment, segments) => {
    this.metrics.forEach(metric => {
      segments.forEach(segment => {
        const lineContainer = document.getElementById(`${segment}_${metric}`);
        if (lineContainer) {
          let line = lineContainer.children[0];
          if (segment === visibleSegment) {
            line.setAttribute('class', 'visibleLine');
          } else {
            line.setAttribute('class', 'hiddenLine');
          }
        }
      });
    });
    const headline = document.getElementById('lineChartText');
    headline.innerHTML = `Conversion Rate - ${visibleSegment} Devices`;
  }

  renderChart = (data, columns, visibleSegment = 'All') => {
    const x = scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.week_number));

    let segments = [];
    data.map(row => {
      if (segments.indexOf(row.segment) === -1) {
        segments.push(row.segment);
      }
    });

    let values = [];
    this.metrics.forEach(metric => {
      data.forEach(row => {
        values.push(row[metric]);
      })
    });
    const yTop = +max(values) + 10;
    const yLow = +min(values) - 5 < 0 ? 0 : +min(values) - 5;

    const y = scaleLinear()
      .range([0, this.height])
      .domain([yTop, yLow]);

    const z = scaleOrdinal()
      .range(['#67A5B0', '#E4A62F', '#bcd7dc', '#f0ce8e'])
      .domain(this.metrics);

    const g = select('#inner-line-chart')
      .attr('transform', `translate(${251},${250+this.margin.top})`);

    this.renderLegend(
      g.append('g')
      .attr('class', 'legend')
    );

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(x))
      .append('text')
      .attr('y', 25)
      .attr('x', this.width / 2)
      .attr('dy', '0.71em')
      .attr('dy', '0.71em')
      .style('text-anchor', 'middle')
      .text('Week');

    g.append('g')
      .attr('transform', `translate(${this.width},0)`)
      .call(d3.axisRight(y).ticks(2));

    g.append('g')
      .call(d3.axisLeft(y).ticks(0));

    g.append('text')
      .attr('id', 'lineChartText')
      .attr('transform', `translate(${this.width/2}, ${25})`)
      .text('Conversion Rate - All Devices')
      .attr('fill', '#000')
      .attr('style', 'font-size: .8em;')
      .attr('style', 'text-anchor: middle;');

    this.metrics.forEach(metric => {
      segments.forEach(segment => {
        const line = d3.line()
          .defined(d => d.segment === segment)
          .x(function(d) {
            return x(d.week_number) + x.bandwidth() / 2;
          })
          .y(function(d) {
            return y(d[metric]);
          });

        const lines = g
          .append('g')
          .attr('id', `${segment}_${metric}`);

        lines
          .selectAll('g')
          .data([data])
          .enter()
          .append('path')
          .attr('class', () => {
            const className = segment === visibleSegment ? 'visibleLine' : 'hiddenLine';
            return className;
          })
          .attr('d', d => line(d))
          .style('stroke', z(metric))
          .data(data)
          .style('stroke-dasharray', () => metric.includes('_prev') ? 2 : 0)
          .style('stroke-width', () => metric.includes('_prev') ? 2 : 3)
          .attr('fill', 'none');
      });
    });
  };
}
