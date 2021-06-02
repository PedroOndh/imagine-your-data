'use strict';


class Rotate360Chart {

  constructor (chartSvgElement, chartWidth, chartHeight, durationRotateAnimation = 15) {
    this.chartWidth = chartWidth;
    this.chartHeight = chartHeight;

    this.durationRotateAnimation = durationRotateAnimation;

    this.chartSvgElement = chartSvgElement
        .attr('viewBox', `0 0 ${this.chartWidth} ${this.chartHeight}`);

    this.chartOuterMargin = 40;
    this.chartInnerMargin = 0;

    this.durationDislpayTransition = 500;
    this.durationUpdateTransition = 2500;
    this.durationEnterTransition = 2500;

    this.data = [];

    this.displayChartComponents();

    this.initializeChartScales();
  }

  displayChartComponents () {
    this.displayChartAxis();
    this.displayChartContainer();
  }

  displayChartAxis () {
    this.axisSvgElement = this.chartSvgElement
      .append('svg')
        .attr('class', 'chart-axis');

    const chartCenterPositionX = this.getChartCenterPositionX();
    const chartCenterPositionY = this.getChartCenterPositionY();

    const chartAxisDelimiterOpacity = 0.2;
    const chartAxisTextOpacity = Rotate360Chart.getChartAxisTextOpacity();

    this.axisSvgElement
      .append('circle')
        .attr('class', 'chart-axis-delimiter chart-axis-delimiter--query')
        .attr('cx', chartCenterPositionX)
        .attr('cy', chartCenterPositionY)
        .attr('r', this.getChartQueryRange())
        .style('opacity', 0)
      .transition().delay(this.durationDislpayTransition)
        .style('opacity', chartAxisDelimiterOpacity);
    this.axisSvgElement
      .append('text')
        .attr('class', 'chart-axis-text chart-axis-text--query')
        .attr('x', this.getChartCenterPositionX())
        .attr('y', this.getChartAxisTextQueryPositionY())
        .text('Queries')
        .style('opacity', 0)
      .transition().delay(this.durationDislpayTransition)
        .style('opacity', chartAxisTextOpacity);

    this.axisSvgElement
      .append('circle')
        .attr('class', 'chart-axis-delimiter chart-axis-delimiter--click')
        .attr('cx', chartCenterPositionX)
        .attr('cy', chartCenterPositionY)
        .attr('r', this.getChartClickRange())
        .style('opacity', 0)
      .transition().delay(this.durationDislpayTransition)
        .style('opacity', chartAxisDelimiterOpacity);
    this.axisSvgElement
      .append('text')
        .attr('class', 'chart-axis-text chart-axis-text--click')
        .attr('x', this.getChartCenterPositionX())
        .attr('y', this.getChartAxisTextClickPositionY())
        .text('Clicks')
        .style('opacity', 0)
      .transition().delay(this.durationDislpayTransition)
        .style('opacity', chartAxisTextOpacity);
    this.axisSvgElement
      .append('text')
        .attr('class', 'chart-axis-text-details chart-axis-text-details--click')
        .attr('x', this.getChartCenterPositionX())
        .attr('y', this.getChartAxisTextDetailsClickPositionY())
        .style('opacity', 0);

    this.axisSvgElement
      .append('circle')
        .attr('class', 'chart-axis-delimiter chart-axis-delimiter--add2cart')
        .attr('cx', chartCenterPositionX)
        .attr('cy', chartCenterPositionY)
        .attr('r', this.getChartAdd2cartRange())
        .style('opacity', 0)
      .transition().delay(this.durationDislpayTransition)
        .style('opacity', chartAxisDelimiterOpacity);
    this.axisSvgElement
      .append('text')
        .attr('class', 'chart-axis-text chart-axis-text--add2cart')
        .attr('x', this.getChartCenterPositionX())
        .attr('y', this.getChartAxisTextAdd2cartPositionY())
        .text('Add to cart')
        .style('opacity', 0)
      .transition().delay(this.durationDislpayTransition)
        .style('opacity', chartAxisTextOpacity);
    this.axisSvgElement
      .append('text')
        .attr('class', 'chart-axis-text-details chart-axis-text-details--add2cart')
        .attr('x', this.getChartCenterPositionX())
        .attr('y', this.getChartAxisTextDetailsAdd2cartPositionY())
        .style('opacity', 0);
  }

  getChartCenterPositionX () {
    return (this.chartWidth / 2);
  }

  getChartCenterPositionY () {
    return (this.chartHeight / 2);
  }

  static getChartAxisTextOpacity () {
    return 0.5;
  }

  getChartQueryRange () {
    return ((this.chartWidth / 2) - this.chartOuterMargin);
  }

  getChartAxisTextQueryPositionY () {
    return ((this.getChartCenterPositionY() - this.getChartQueryRange()) - 4);
  }

  getChartAdd2cartRange () {
    const maxRange = (this.getChartQueryRange() - this.chartInnerMargin);
    return ((maxRange / 3) + this.chartInnerMargin);
  }

  getChartClickRange () {
    const maxRange = (this.getChartQueryRange() - this.chartInnerMargin);
    return ((maxRange / 3) + this.getChartAdd2cartRange());
  }

  getChartAxisTextClickPositionY () {
    return ((this.getChartCenterPositionY() - this.getChartClickRange()) - 4);
  }

  getChartAxisTextAdd2cartPositionY () {
    return ((this.getChartCenterPositionY() - this.getChartAdd2cartRange()) - 4);
  }

  getChartAxisTextDetailsClickPositionY () {
    return (this.getChartAxisTextClickPositionY() + 21);
  }

  getChartAxisTextDetailsAdd2cartPositionY () {
    return (this.getChartAxisTextAdd2cartPositionY() + 21);
  }

  displayChartContainer () {
    this.containerSvgElement = this.chartSvgElement
      .append('svg')
        .attr('class', 'chart-container')
        .attr('shape-rendering', 'geometricPrecision');
  }

  initializeChartScales () {
    this.radiusScale = d3.scaleOrdinal()
      .range(this.getChartRadiusScaleRange())
      .domain([-1, 0, 1, 2]);

    this.angleScale = d3.scaleBand()
      .range([0, (2 * Math.PI)])
      .domain(d3.ticks(0, 59, 60));
  }

  getChartRadiusScaleRange () {
    const add2cartRadius =
      (this.getChartAdd2cartRange() - ((this.getChartAdd2cartRange() - this.chartInnerMargin) / 2.5));
    const clickRadius =
      (this.getChartClickRange() - ((this.getChartClickRange() - this.getChartAdd2cartRange()) / 1.9));
    const queryRadius = (this.getChartQueryRange() - ((this.getChartQueryRange() - this.getChartClickRange()) / 2.2));
    const maxRadius = (this.chartHeight / 2);

    return [maxRadius, queryRadius, clickRadius, add2cartRadius];
  }

  displayChartData (data) {
    this.updateChartDataDetails(data);

    const dataFiltered =
      data.filter(d => !this.data.some(dt => ((dt.id === d.id) && (dt.event_type === d.event_type))));

    this.data = data;

    // --- JOIN ---
    let series = this.containerSvgElement
      .selectAll('.serie')
      .data(dataFiltered, Rotate360Chart.dataKeyFunction);

    // --- UPDATE ---
    this.updateSeries(series);

    // --- ENTER ---
    this.enterSeries(series);
  }

  updateChartDataDetails (data) {
    const chartAxisTextOpacity = Rotate360Chart.getChartAxisTextOpacity();

    const queries = d3.sum(data, d => (d.event_type === EnumEventType.Query ? 1 : 0));
    const clicks = d3.sum(data, d => (d.event_type === EnumEventType.Click ? 1 : 0));
    const detailsTextClickSvgElement = this.axisSvgElement
      .select('.chart-axis-text-details--click');
    detailsTextClickSvgElement
      .transition().duration(this.durationUpdateTransition * 0.7)
        .style('opacity', chartAxisTextOpacity)
        .tween('animateDetailsValue', () => {
          return this.animateDetailsValue(detailsTextClickSvgElement, (clicks / queries));
        });

    const add2cart = d3.sum(data, d => (d.event_type === EnumEventType.Add2cart ? 1 : 0));
    const detailsTextAdd2cartSvgElement = this.axisSvgElement
      .select('.chart-axis-text-details--add2cart');
    detailsTextAdd2cartSvgElement
      .transition().duration(this.durationUpdateTransition * 0.7)
        .style('opacity', chartAxisTextOpacity)
        .tween('animateDetailsValue', () => {
          return this.animateDetailsValue(detailsTextAdd2cartSvgElement, (add2cart / queries));
        });
  }

  animateDetailsValue (detailsTextSvgElement, value) {
    let start = (parseFloat(detailsTextSvgElement.text()
      .replace(/%/g, '')) || 0);
    start /= 100;
    const itp = d3.interpolate(start, value);
    return (tr) => {
      detailsTextSvgElement.text(Rotate360Chart.formatValueAsPercentage(itp(tr)));
    };
  }

  static formatValueAsPercentage (value) {
    return `${(value * 100).toFixed(1).toLocaleString('en')}%`;
  }

  static dataKeyFunction (d) {
    return d.id;
  }

  updateSeries (series) {
    series
        .attr('class', d => Rotate360Chart.getChartSerieItemClass(d))
        .style('opacity', 0.5)
      .transition().duration(this.durationUpdateTransition)
        .attr('cx', d => this.getChartSerieItemPositionX(d))
        .attr('cy', d => this.getChartSerieItemPositionY(d))
        .attr('r', d => Rotate360Chart.getChartSerieItemRadius(d))
        .style('opacity', d => Rotate360Chart.getChartSerieItemOpacity(d));
  }

  static getChartSerieItemClass (d) {
    let cls = 'serie';
    switch (d.event_type) {
      case EnumEventType.Query:
        cls += ' serie--query';
        break;
      case EnumEventType.Click:
        cls += ' serie--click';
        break;
      case EnumEventType.Add2cart:
        cls += ' serie--add2cart';
        break;
    }
    return cls;
  }

  getChartSerieItemPositionX (d, initial = false) {
    let serieItemPositionX = this.getChartCenterPositionX();

    const angle = this.getAngleScaleValue(d);
    const radius = this.getRadiusScaleValue(d, initial);
    serieItemPositionX += (Math.sin(angle) * radius);

    return serieItemPositionX;
  }

  getAngleScaleValue (d) {
    return this.angleScale(d.id % this.angleScale.domain().length);
  }

  getRadiusScaleValue (d, initial) {
    let radiusScaleValue = this.radiusScale(initial ? -1 : d.event_type);
    if (!initial) {
      let positionRange = 0;
      switch (d.event_type) {
        case EnumEventType.Query:
          positionRange = ((this.getChartQueryRange() - this.getChartClickRange()) / 3.5);
          break;
        case EnumEventType.Click:
          positionRange = ((this.getChartClickRange() - this.getChartAdd2cartRange()) / 4);
          break;
        case EnumEventType.Add2cart:
          return (Math.random() * radiusScaleValue);
      }
      radiusScaleValue = (((Math.random() * positionRange) + radiusScaleValue) - (positionRange / 2));
    }
    return radiusScaleValue;
  }

  getChartSerieItemPositionY (d, initial = false) {
    let serieItemPositionY = this.getChartCenterPositionY();

    const angle = this.getAngleScaleValue(d);
    const radius = this.getRadiusScaleValue(d, initial);
    serieItemPositionY -= (Math.cos(angle) * radius);

    return serieItemPositionY;
  }

  static getChartSerieItemRadius (d) {
    switch (d.event_type) {
      case EnumEventType.Query:
        return 3;
      case EnumEventType.Click:
        return 4;
      case EnumEventType.Add2cart:
        return 5;
      default:
        return 0;
    }
  }

  static getChartSerieItemOpacity (d) {
    switch (d.event_type) {
      case EnumEventType.Query:
        return 0.6;
      case EnumEventType.Click:
        return 0.7;
      case EnumEventType.Add2cart:
        return 0.8;
      default:
        return 0;
    }
  }

  enterSeries (series) {
    let enterSeries = series.enter()
      .append('circle')
        .attr('class', d => Rotate360Chart.getChartSerieItemClass(d))
        .attr('cx', d => this.getChartSerieItemPositionX(d, true))
        .attr('cy', d => this.getChartSerieItemPositionY(d, true))
        .attr('r', 0)
        .style('opacity', 0);
    enterSeries
      .transition().duration(this.durationEnterTransition)
        .attr('cx', d => this.getChartSerieItemPositionX(d))
        .attr('cy', d => this.getChartSerieItemPositionY(d))
        .attr('r', d => Rotate360Chart.getChartSerieItemRadius(d))
        .style('opacity', d => Rotate360Chart.getChartSerieItemOpacity(d));
    enterSeries
      .append('animateTransform')
        .attr('attributeName', 'transform')
        .attr('attributeType', 'xml')
        .attr('type', 'rotate')
        .attr('from', `${0} ${this.getChartCenterPositionX()} ${this.getChartCenterPositionY()}`)
        .attr('to', `${360} ${this.getChartCenterPositionX()} ${this.getChartCenterPositionY()}`)
        .attr('dur', () => this.getChartSerieItemDurationRotation())
        .attr('repeatCount', 'indefinite');
  }

  getChartSerieItemDurationRotation () {
    const randomValue = ((Math.random() * 0.2) + 0.8);
    return (this.durationRotateAnimation * randomValue);
  }

}


const EnumEventType = {
  Query: 0,
  Click: 1,
  Add2cart: 2
};
