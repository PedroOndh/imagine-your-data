import './styles/contextualisequerieschart.scss';

import { scaleLinear, scaleBand } from 'd3-scale';
import 'd3-transition';
import { ascending, max, min, range, sum } from 'd3-array';
import { arc } from 'd3-shape';
import { select } from 'd3-selection';
import { interpolate } from 'd3-interpolate';


const durationTransitions = 1000;

export default class ContextualiseQueriesChart {

  private svgElement;

  private elementHeight: number;
  private elementWidth: number;

  private contextualised: boolean;

  private centerRadius = 135;
  private outerMargin = 20;

  private radiusScale;
  private angleScale;

  private durationTransitions = durationTransitions;

  private contextualiseQueriesChartDetails;
  private selectedSerieData;
  private displayedData;

  private contextualiseQueriesChartCouple;

  constructor (svgElement, elementHeight: number, elementWidth: number, contextualised = true) {
    this.elementHeight = elementHeight;
    this.elementWidth = elementWidth;

    this.contextualised = contextualised;

    this.svgElement = svgElement
        .attr('viewBox', `0 0 ${this.elementWidth} ${this.elementHeight}`)
      .append('g');

    this.radiusScale = scaleLinear()
      .range([this.centerRadius, ((this.elementHeight / 2) - this.outerMargin)]);

    this.angleScale = scaleBand()
      .range([0, (2 * Math.PI)]);

    this.displayChart();
  }

  private displayChart (): void {
    this.svgElement.append('circle')
        .attr('class', 'series-background '
          + (this.contextualised ? 'series-background--contextualised' : 'series-background--not-contextualised'))
        .attr('cx', this.getChartCenterPositionX())
        .attr('cy', this.getChartCenterPositionY())
        .attr('r', this.centerRadius)
        .style('opacity', 0);
    this.svgElement.append('circle')
        .attr('class', 'series-center-background')
        .attr('cx', this.getChartCenterPositionX())
        .attr('cy', this.getChartCenterPositionY())
        .attr('r', this.centerRadius)
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', 1);

    const detailsVerticalOffset = (this.centerRadius / 1.4);
    const chartTitleHeight = 35;
    const chartDetailsHeight = this.centerRadius;
    const chartDetailsWidth = (this.centerRadius * 1.7);
    this.svgElement.append('text')
        .attr('class', ('contextualise-title' +
          (this.contextualised ? ' contextualise-title--contextualised' : ' contextualise-title--not-contextualised')))
        .attr('x', this.getChartCenterPositionX())
        .attr('y',
          ((this.getChartCenterPositionY() - (chartDetailsHeight + chartTitleHeight)) + detailsVerticalOffset))
        .text(this.contextualised ? 'Personalised' : 'Non-Personalised')
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', 0.8);

    this.svgElement.append('text')
        .attr('class', ('contextualise-subtitle' +
          (this.contextualised ? ' contextualise-subtitle--contextualised'
            : ' contextualise-subtitle--not-contextualised')))
        .attr('x', this.getChartCenterPositionX())
        .attr('y',
          ((this.getChartCenterPositionY() - (chartDetailsHeight + (chartTitleHeight / 2.5))) + detailsVerticalOffset))
        .text('eCommerce Search')
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', 0.8);

    const svgElementDetails = this.svgElement.append('svg')
        .attr('x', (this.getChartCenterPositionX() - (chartDetailsWidth / 2)))
        .attr('y', ((this.getChartCenterPositionY() - chartDetailsHeight) + detailsVerticalOffset));
    this.contextualiseQueriesChartDetails =
      new ContextualiseQueriesChartDetails(svgElementDetails, chartDetailsHeight, chartDetailsWidth,
        this.contextualised);
  }

  private getChartCenterPositionX (): number {
    return (this.elementWidth / 2);
  }

  private getChartCenterPositionY (): number {
    return (this.elementHeight / 2);
  }

  public setContextualiseQueriesChartCouple (contextualiseQueriesChartCouple) {
   this.contextualiseQueriesChartCouple = contextualiseQueriesChartCouple;
  }

  public displayData (data: any[], maxResultsToShow = 16): void {
    data = data.slice(0, maxResultsToShow);
    data.sort((d1, d2) => ascending(this.keyFunctionData(d1), this.keyFunctionData(d2)));
    this.displayedData = data;

    this.updateScales(data);

    this.svgElement.select('.series-background')
      .transition().duration(this.durationTransitions)
        .attr('r', this.getSeriesBackgroundRadius(data))
        .style('opacity', 0.1);

    this.displayChartSeries(data);

    this.contextualiseQueriesChartDetails.displayDataDetails(data);

    if (this.selectedSerieData) {
      this.onClickSerie(this.selectedSerieData, false);
    }
  }

  private updateScales (data: any[]): void {
    let maxValueOfFindability = max(data, d =>
      Math.max(this.getFindabilityValue(d, true), this.getFindabilityValue(d, false)));
    if ((maxValueOfFindability === undefined) || (maxValueOfFindability === 0)) {
      maxValueOfFindability = 0.01;
    }

    this.radiusScale
      .domain([0, maxValueOfFindability]);

    this.angleScale
      .domain(range(0, data.length, 1));
  }

  private getFindabilityValue (d, contextualised = this.contextualised): number {
    return (contextualised ? d.findability_csu : d.findability_not_csu);
  }

  private getSeriesBackgroundRadius (data: any[]): number {
    let maxValueOfFindability = max(data, d => this.getFindabilityValue(d));
    if ((maxValueOfFindability === undefined) || (maxValueOfFindability === 0)) {
      maxValueOfFindability = 0.01;
    }

    return this.radiusScale(maxValueOfFindability);
  }

  private displayChartSeries (data: any[]): void {
    const series = this.svgElement.selectAll('.serie')
      .data(data, this.keyFunctionData);

    this.removeSeries(series);

    this.updateSeries(series);

    this.enterSeries(series);
  }

  private keyFunctionData (d): string {
    return d.terms;
  }

  private removeSeries (series): void {
    series.exit().remove();
  }

  private updateSeries (series): void {
    series.select('.serie-item-container')
        .attr('d', (d, i) =>  this.getSerieItemInitialCommands(i))
      .transition().duration((this.durationTransitions / 2))
        .attr('d', (d, i) =>  this.getSerieItemContainerCommands(i));
    series.select('.serie-item-content')
        .style('opacity', 0.5)
        .attr('d', (d, i) =>  this.getSerieItemInitialCommands(i))
      .transition().duration((this.durationTransitions / 2))
        .attr('d', (d, i) =>  this.getSerieItemContentCommands(d, i))
        .style('opacity', 1);

    series.select('.serie-item-text')
        .attr('class', (d, i) => this.getSerieItemTextClass(i))
        .attr('transform', (d, i) =>
          `translate(${this.getSerieItemTextPositionX(i)},${this.getSerieItemTextPositionY(i)})
          rotate(${this.getSerieItemTextRotationDegrees(i)})`)
        .style('opacity', 0)
      .transition().duration(this.durationTransitions)
        .style('opacity', this.getSerieItemTextOpacity());
  }

  private getSerieItemInitialCommands (i: number): string {
    const angleMarginSerieItem = (Math.PI / 360);
    let serieItemArc = arc()
      .innerRadius(this.centerRadius)
      .outerRadius(this.centerRadius + 1)
      .startAngle(this.angleScale(i) + angleMarginSerieItem)
      .endAngle((this.angleScale(i) + this.angleScale.bandwidth()) - angleMarginSerieItem);

    return serieItemArc();
  }

  private getSerieItemContainerCommands (i: number): string {
    let maxValueOfFindability = max(this.displayedData, d => this.getFindabilityValue(d));
    if ((maxValueOfFindability === undefined) || (maxValueOfFindability === 0)) {
      maxValueOfFindability += 0.01;
    }

    const angleMarginSerieItem = (Math.PI / 360);
    let serieItemArc = arc()
      .innerRadius(this.centerRadius)
      .outerRadius(this.radiusScale(maxValueOfFindability))
      .startAngle(this.angleScale(i) + angleMarginSerieItem)
      .endAngle((this.angleScale(i) + this.angleScale.bandwidth()) - angleMarginSerieItem);

    return serieItemArc();
  }

  private getSerieItemContentCommands (d, i: number): string {
    let valueOfFindability = this.getFindabilityValue(d);
    if ((valueOfFindability === undefined) || (valueOfFindability === 0)) {
      valueOfFindability += 0.01;
    }

    const angleMarginSerieItem = (Math.PI / 360);
    let serieItemArc = arc()
      .innerRadius(this.centerRadius)
      .outerRadius(this.radiusScale(valueOfFindability))
      .startAngle(this.angleScale(i) + angleMarginSerieItem)
      .endAngle((this.angleScale(i) + this.angleScale.bandwidth()) - angleMarginSerieItem);

    return serieItemArc();
  }

  private getSerieItemContentOpacity (): number {
    return 0.8;
  }

  private getSerieItemTextClass (i: number): string {
    var cls = 'serie-item-text';
    cls += (this.contextualised ? ' serie-item-text--contextualised' : ' serie-item-text--not-contextualised');
    cls += (this.isSerieItemFirstHalf(i) ? ' serie-item-text--first-half' :  ' serie-item-text--second-half');
    return cls;
  }

  private isSerieItemFirstHalf (i: number): boolean {
    return (i < this.angleScale.domain().length / 2);
  }

  private getSerieItemTextPositionX (i: number): number {
    let positionX = this.getChartCenterPositionX();
    let angle = (this.angleScale(i) + (this.angleScale.bandwidth() / 2));
    let radius = (this.centerRadius + 7);
    positionX += (Math.sin(angle) * radius);
    return positionX;
  }

  private getSerieItemTextPositionY (i: number): number {
    let positionX = this.getChartCenterPositionX();
    let angle = (this.angleScale(i)+ (this.angleScale.bandwidth() / 2));
    let radius = (this.centerRadius + 7);
    positionX -= (Math.cos(angle) * radius);
    return positionX;
  }

  private getSerieItemTextRotationDegrees (i: number): number {
    let rotationDegrees = (this.isSerieItemFirstHalf(i) ? -90 : 90);
    rotationDegrees += ((this.angleScale(i)+ (this.angleScale.bandwidth() / 2)) * (180 / Math.PI));
    return rotationDegrees;
  }

  private getSerieItemTextOpacity (): number {
    return 0.4;
  }

  private enterSeries (series): void {
    let enterSeries = series.enter().append('g')
        .attr('class', 'serie')
        .on('mouseover', d => this.onMouseOverSerie(d))
        .on('mouseout', () => this.onMouseOutSerie())
        .on('click', d => this.onClickSerie(d));

    enterSeries.append('path')
        .attr('class', 'serie-item-container '
          + (this.contextualised ? 'serie-item-container--contextualised' : 'serie-item-container--not-contextualised'))
        .attr('transform', `translate(${this.getChartCenterPositionX()},${this.getChartCenterPositionY()})`)
        .attr('d', (d, i) =>  this.getSerieItemInitialCommands(i))
        .style('opacity', 0)
      .transition().duration(this.durationTransitions)
        .attr('d', (d, i) => this.getSerieItemContainerCommands(i));
    enterSeries.append('path')
        .attr('class', ('serie-item-content '
          + (this.contextualised ? 'serie-item-content--contextualised' : 'serie-item-content--not-contextualised')))
        .attr('transform', `translate(${this.getChartCenterPositionX()},${this.getChartCenterPositionY()})`)
        .attr('d', (d, i) => this.getSerieItemInitialCommands(i))
        .style('opacity', 0)
      .transition().duration(this.durationTransitions)
        .attr('d', (d, i) => this.getSerieItemContentCommands(d, i))
        .style('opacity', this.getSerieItemContentOpacity());

    enterSeries.append('text')
        .attr('class', (d, i) => this.getSerieItemTextClass(i))
        .attr('transform', (d, i) =>
          `translate(${this.getSerieItemTextPositionX(i)},${this.getSerieItemTextPositionY(i)})
          rotate(${this.getSerieItemTextRotationDegrees(i)})`)
        .text(d => this.keyFunctionData(d))
        .style('opacity', 0)
      .transition().duration(this.durationTransitions)
        .style('opacity', this.getSerieItemTextOpacity());
  }

  public onMouseOverSerie (d, propagateEvent = true): void {
    this.svgElement.selectAll('.serie-item-container, .serie-item-content, .serie-item-text')
      .filter(dt => {
        return (this.keyFunctionData(dt) === this.keyFunctionData(d));
      })
        .classed('serie-item--hover', true);

    this.svgElement.selectAll('.serie-item-container.serie-item--hover:not(.serie-item--selected)')
        .style('opacity', 0.2);
    this.svgElement.selectAll('.serie-item-content.serie-item--hover:not(.serie-item--selected)')
        .style('opacity', this.getSerieItemContentOpacity());
    this.svgElement.selectAll('.serie-item-text.serie-item--hover:not(.serie-item--selected)')
        .style('opacity', 1);

    if (propagateEvent && this.contextualiseQueriesChartCouple) {
      this.contextualiseQueriesChartCouple.onMouseOverSerie(d, false);
    }
  }

  public onMouseOutSerie (propagateEvent = true): void {
    this.svgElement.selectAll('.serie-item-container.serie-item--hover:not(.serie-item--selected)')
        .style('opacity', 0);
    this.svgElement.selectAll('.serie-item-content.serie-item--hover:not(.serie-item--selected):not(.serie-item--not-selected)')
        .style('opacity', this.getSerieItemContentOpacity());
    this.svgElement.selectAll('.serie-item-text.serie-item--hover:not(.serie-item--selected):not(.serie-item--not-selected)')
        .style('opacity', this.getSerieItemTextOpacity());

    this.svgElement.selectAll('.serie-item-container.serie-item--hover.serie-item--selected')
        .style('opacity', this.getSerieItemContainerOpacitySelected());
    this.svgElement.selectAll('.serie-item-content.serie-item--hover.serie-item--selected')
        .style('opacity', this.getSerieItemContentOpacitySelected());
    this.svgElement.selectAll('.serie-item-text.serie-item--hover.serie-item--selected')
        .style('opacity', this.getSerieItemTextOpacitySelected());

    this.svgElement.selectAll('.serie-item-content.serie-item--hover.serie-item--not-selected')
        .style('opacity', this.getSerieItemContentOpacityNotSelected());
    this.svgElement.selectAll('.serie-item-text.serie-item--hover.serie-item--not-selected')
        .style('opacity', this.getSerieItemTextOpacityNotSelected());

    this.svgElement.selectAll('.serie-item--hover')
        .classed('serie-item--hover', false);

    if (propagateEvent && this.contextualiseQueriesChartCouple) {
      this.contextualiseQueriesChartCouple.onMouseOutSerie(false);
    }
  }

  private getSerieItemContainerOpacitySelected (): number {
    return 0.4;
  }

  private getSerieItemContentOpacitySelected (): number {
    return 1;
  }

  private getSerieItemTextOpacitySelected (): number {
    return 1;
  }

  private getSerieItemContentOpacityNotSelected (): number {
    return (this.getSerieItemContentOpacity() / 5);
  }

  private getSerieItemTextOpacityNotSelected (): number {
    return (this.getSerieItemTextOpacity() / 5);
  }

  public onClickSerie (d, propagateEvent = true): void {
    this.svgElement.selectAll('.serie-item-container:not(.serie-item--hover)')
        .style('opacity', 0);
    this.svgElement.selectAll('.serie-item-content:not(.serie-item--hover)')
        .style('opacity', this.getSerieItemContentOpacity());
    this.svgElement.selectAll('.serie-item-text:not(.serie-item--hover)')
        .style('opacity', this.getSerieItemTextOpacity());

    this.svgElement.selectAll('.serie-item--selected')
        .classed('serie-item--selected', false);
    this.svgElement.selectAll('.serie-item--not-selected')
        .classed('serie-item--not-selected', false);

    if (this.selectedSerieData && (this.keyFunctionData(this.selectedSerieData) === this.keyFunctionData(d))) {
      this.selectedSerieData = undefined;
    } else {
      this.selectedSerieData = d;

      this.svgElement.selectAll('.serie-item-container, .serie-item-content, .serie-item-text')
        .filter(dt => {
          return (this.keyFunctionData(dt) === this.keyFunctionData(d));
        })
          .classed('serie-item--selected', true);

      this.svgElement.selectAll('.serie-item-container, .serie-item-content, .serie-item-text')
        .filter(dt => {
          return (this.keyFunctionData(dt) !== this.keyFunctionData(d));
        })
          .classed('serie-item--not-selected', true);
    }

    this.svgElement.selectAll('.serie-item-container.serie-item--selected')
        .style('opacity', this.getSerieItemContainerOpacitySelected());
    this.svgElement.selectAll('.serie-item-content.serie-item--selected')
        .style('opacity', this.getSerieItemContentOpacitySelected());
    this.svgElement.selectAll('.serie-item-text.serie-item--selected')
        .style('opacity', this.getSerieItemTextOpacitySelected());

    this.svgElement.selectAll('.serie-item-content.serie-item--not-selected')
        .style('opacity', this.getSerieItemContentOpacityNotSelected());
    this.svgElement.selectAll('.serie-item-text.serie-item--not-selected')
        .style('opacity', this.getSerieItemTextOpacityNotSelected());

    this.contextualiseQueriesChartDetails.displaySelectedSerieDetails(d);

    if (propagateEvent && this.contextualiseQueriesChartCouple) {
      this.contextualiseQueriesChartCouple.onClickSerie(d, false);
    }
  }

}


class ContextualiseQueriesChartDetails {

  private svgElement;

  private elementHeight: number;
  private elementWidth: number;

  private contextualised: boolean;

  private durationTransitions = durationTransitions;

  private selectedSerieData;
  private displayedData;

  constructor (svgElement, elementHeight: number, elementWidth: number, contextualised = true) {
    this.svgElement = svgElement;

    this.elementHeight = elementHeight;
    this.elementWidth = elementWidth;

    this.contextualised = contextualised;

    this.displayChartDetails();
  }

  private displayChartDetails (): void {
    const detailsQueriesHeight = (this.elementHeight / 3.5);
    const detailsMainHeight = (this.elementHeight - detailsQueriesHeight);
    const imageSize = detailsMainHeight;
    this.svgElement.append('image')
        .attr('class', 'details-image')
        .attr('y', ((detailsMainHeight / 2) - (imageSize / 2)))
        .attr('width', imageSize)
        .attr('height', imageSize)
        .attr('xlink:href', this.getChartDetailsImage())
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', 1);

    const detailsMainWidth = (this.elementWidth - imageSize);
    const detailsMainPositionX = ((detailsMainWidth / 2) + imageSize);
    const detailsTextHeight = ((detailsMainHeight / 4));
    let detailsTextPositionY = (detailsTextHeight / 1.5);
    this.svgElement.append('text')
        .attr('class', 'details-text details-text__ctr')
        .attr('x', detailsMainPositionX)
        .attr('y', detailsTextPositionY)
        .text('CTR')
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', this.getDetailsOpacity());
    const detailsBarWidth = (detailsMainWidth * 0.9);
    const detailsBarHeight = ((detailsMainHeight / 4));
    let detailsBarPositionY = detailsTextHeight;
    this.svgElement.append('rect')
        .attr('class', 'details-bar-container')
        .attr('x', (detailsMainPositionX - (detailsBarWidth / 2)))
        .attr('y', detailsBarPositionY)
        .attr('width', detailsBarWidth)
        .attr('height', detailsBarHeight)
        .attr('rx', (detailsBarHeight / 3))
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', 1);
    this.svgElement.append('rect')
        .attr('class', ('details-bar-content details-bar-content__ctr '
          + (this.contextualised ? 'details-bar-content--contextualised' : 'details-bar-content--not-contextualised')))
        .attr('x', (detailsMainPositionX - (detailsBarWidth / 2)))
        .attr('y', detailsBarPositionY)
        .attr('width', 0)
        .attr('height', detailsBarHeight)
        .attr('rx', (detailsBarHeight / 3))
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', 1);
    this.svgElement.append('text')
        .attr('class', 'details-value details-value__ctr')
        .attr('x', ((detailsMainPositionX + (detailsBarWidth / 2)) - (detailsBarHeight / 6)))
        .attr('y', (detailsBarPositionY + (detailsBarHeight / 2)))
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', this.getDetailsOpacity());

    detailsTextPositionY += (detailsTextHeight + detailsBarHeight);
    detailsBarPositionY += (detailsTextHeight + detailsBarHeight);
    this.svgElement.append('text')
        .attr('class', 'details-text details-text__findability')
      .attr('x', detailsMainPositionX)
      .attr('y', detailsTextPositionY)
        .text('Findability')
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', this.getDetailsOpacity());
    this.svgElement.append('rect')
        .attr('class', 'details-bar-container')
        .attr('x', (detailsMainPositionX - (detailsBarWidth / 2)))
      .attr('y', detailsBarPositionY)
        .attr('width', detailsBarWidth)
        .attr('height', detailsBarHeight)
        .attr('rx', (detailsBarHeight / 3))
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', 1);
    this.svgElement.append('rect')
        .attr('class', ('details-bar-content details-bar-content__findability '
          + (this.contextualised ? 'details-bar-content--contextualised' : 'details-bar-content--not-contextualised')))
        .attr('x', (detailsMainPositionX - (detailsBarWidth / 2)))
      .attr('y', detailsBarPositionY)
        .attr('width', 0)
        .attr('height', detailsBarHeight)
        .attr('rx', (detailsBarHeight / 3))
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', 1);
    this.svgElement.append('text')
        .attr('class', 'details-value details-value__findability')
        .attr('x', ((detailsMainPositionX + (detailsBarWidth / 2)) - (detailsBarHeight / 6)))
      .attr('y', (detailsBarPositionY + (detailsBarHeight / 2)))
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', this.getDetailsOpacity());

    this.svgElement.append('text')
        .attr('class', 'details-text details-text__queries')
        .attr('x', ((this.elementWidth / 2) - (detailsBarHeight / 6)))
       .attr('y', (this.elementHeight - (detailsQueriesHeight / 3)))
        .text('Queries:')
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', this.getDetailsOpacity());
    this.svgElement.append('text')
        .attr('class', 'details-value details-value__queries')
        .attr('x', ((this.elementWidth / 2) + (detailsBarHeight / 6)))
        .attr('y', (this.elementHeight - (detailsQueriesHeight / 3)))
        .style('opacity', 0)
      .transition().delay(this.durationTransitions)
        .style('opacity', this.getDetailsOpacity());
  }

  private getChartDetailsImage (): string {
    return (this.contextualised ? 'images/man-wink.svg' : 'images/man-anonymous.svg');
  }

  private getDetailsOpacity (): number {
    return 0.9;
  }

  public displayDataDetails (data: any[]): void {
    this.displayedData = data;

    const queries = sum(data, d => this.getQueriesValue(d));
    let ctr = 0, findability = 0;
    if (queries > 0) {
      ctr = (sum(data, d => (this.getCtrValue(d) * this.getQueriesValue(d))) / queries);
      findability = (sum(data, d => (this.getFindabilityValue(d) * this.getQueriesValue(d))) / queries);
    }
    this.svgElement.select('.details-value__queries')
        .text(this.formatNumericValue(queries, false));

    const detailsBarContainerWidth = this.svgElement.select('.details-bar-container')
        .attr('width');
    this.svgElement.select('.details-bar-content__ctr')
        .attr('width', this.getDetailsBarContentWidth(detailsBarContainerWidth, ctr));
    this.svgElement.select('.details-value__ctr')
        .text(this.formatNumericValue(ctr));

    this.svgElement.select('.details-bar-content__findability')
        .attr('width', this.getDetailsBarContentWidth(detailsBarContainerWidth, findability));
    this.svgElement.select('.details-value__findability')
        .text(this.formatNumericValue(findability));
  }

  private getQueriesValue (d, contextualised = this.contextualised): number {
    return (contextualised ? d.queries_csu : d.queries_not_csu);
  }

  private getCtrValue (d, contextualised = this.contextualised): number {
    return (contextualised ? d.ctr_csu : d.ctr_not_csu);
  }

  private getFindabilityValue (d, contextualised = this.contextualised): number {
    return (contextualised ? d.findability_csu : d.findability_not_csu);
  }

  private getDetailsBarContentWidth (detailsBarContainerWidth: number, value: number) {
    if (value > 1) {
      value = 1;
    }
    return (detailsBarContainerWidth * value);
  }

  public displaySelectedSerieDetails (d): void {
    let queries, ctr, findability;
    if (this.selectedSerieData && (this.keyFunctionData(this.selectedSerieData) === this.keyFunctionData(d))) {
      this.selectedSerieData = undefined;
      queries = sum(this.displayedData, d => this.getQueriesValue(d));
      if (queries > 0) {
        ctr = (sum(this.displayedData, d => (this.getCtrValue(d) * this.getQueriesValue(d))) / queries);
        findability = (sum(this.displayedData, d => (this.getFindabilityValue(d) * this.getQueriesValue(d))) / queries);
      }
    } else {
      this.selectedSerieData = d;
      queries = this.getQueriesValue(d);
      ctr = this.getCtrValue(d);
      findability = this.getFindabilityValue(d);
    }
    this.updateDetailsValues(queries, ctr, findability);
  }

  private keyFunctionData (d): string {
    return d.terms;
  }

  private updateDetailsValues (queries: number, ctr: number, findability: number): void {
    const opacityTransition = 0.4;
    const durationTransition = (this.durationTransitions / 2);
    const svgElementQueries = this.svgElement.select('.details-value__queries')
        .style('opacity', opacityTransition);
    svgElementQueries.transition().duration(durationTransition)
        .style('opacity', this.getDetailsOpacity())
        .tween('animateSecondItemTextValue', () => {
          return this.animateDetailsValue(svgElementQueries, queries, false);
        });

    const detailsBarContainerWidth = this.svgElement.select('.details-bar-container')
        .attr('width');
    this.svgElement.select('.details-bar-content__ctr')
      .transition().duration(durationTransition)
        .attr('width', this.getDetailsBarContentWidth(detailsBarContainerWidth, ctr));
    const svgElementCtr = this.svgElement.select('.details-value__ctr')
        .style('opacity', opacityTransition);
    svgElementCtr.transition().duration(durationTransition)
        .style('opacity', this.getDetailsOpacity())
        .tween('animateSecondItemTextValue', () => {
          return this.animateDetailsValue(svgElementCtr, ctr);
        });

    this.svgElement.select('.details-bar-content__findability')
      .transition().duration(durationTransition)
        .attr('width', this.getDetailsBarContentWidth(detailsBarContainerWidth, findability));
    const svgElementFindability = this.svgElement.select('.details-value__findability')
        .style('opacity', opacityTransition);
    svgElementFindability.transition().duration(durationTransition)
        .style('opacity', this.getDetailsOpacity())
        .tween('animateSecondItemTextValue', () => {
          return this.animateDetailsValue(svgElementFindability, findability);
        });
  }

  private animateDetailsValue (svgElement, value: number, percentage = true) {
    var start = (parseFloat(svgElement.text()
      .replace(/,/g, '')
      .replace(/%/g, '')) || 0);
    if (percentage) {
      start /= 100;
    }
    var itp = interpolate(start, value);
    return (tr) => {
      svgElement.text(this.formatNumericValue(itp(tr), percentage));
    };
  }

  private formatNumericValue (value: number, percentage = true) {
    if (percentage) {
      value *= 100;
    }
    let valueFormatted = value.toLocaleString('en', {
      minimumFractionDigits: (percentage ? 1 : 0),
      maximumFractionDigits: (percentage ? 1 : 0)
    });
    if (percentage) {
      valueFormatted += '%';
    }
    return valueFormatted;
  }

}
