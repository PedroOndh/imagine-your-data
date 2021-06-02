'use strict';


class TimeDistributionRadialChart {

  constructor (chartSvgElement, chartWidth, chartHeight, dayToHighlight = 5) {
    this.chartWidth = chartWidth;
    this.chartHeight = chartHeight;

    this.dayToHighlight = dayToHighlight;

    this.chartSvgElement = chartSvgElement
        .attr('viewBox', `0 0 ${this.chartWidth} ${this.chartHeight}`)
      .append('g');

    this.innerRadius = 90;
    const outerMargin = 45;
    this.radiusScale = d3.scaleBand()
      .range([this.innerRadius, ((this.chartHeight / 2) - outerMargin)]);

    this.angleScale = d3.scaleBand()
      .range([0, (2 * Math.PI)])
      .domain(d3.ticks(-1, 23, 25));

    this.valueRadiusScale = d3.scaleLinear()
      .range([0.2, 1]);
    this.valueOpacityScale = d3.scaleLinear()
      .range([0.6, 1]);

    this.displayChartDetailsText();
  }

  displayChartDetailsText () {
    const durationTransition = 700;
    this.chartSvgElement.append('circle')
        .attr('class', 'chartcenter')
        .attr('cx', this.getChartCenterPositionX())
        .attr('cy', (this.getChartCenterPositionY()))
        .attr('r', this.innerRadius)
        .style('opacity', 0)
      .transition().delay(durationTransition)
        .style('opacity', 0.9)
        .style('stroke-opacity', 0.9);
    this.detailsMargin = 25;
    const detailsOpacity = this.getDetailsOpacity();
    this.chartSvgElement.append('text')
        .attr('class', 'charttext details initial')
        .attr('x', this.getChartCenterPositionX())
        .attr('y', this.getChartCenterPositionY())
        .text('Black Friday')
        .style('opacity', 0)
      .transition().delay(durationTransition)
        .style('opacity', detailsOpacity);
    this.chartSvgElement.append('text')
        .attr('class', 'charttext details')
        .attr('x', this.getChartCenterPositionX())
        .attr('y', this.getChartCenterPositionY())
        .style('opacity', 0)
      .transition().delay(durationTransition)
        .style('opacity', detailsOpacity);
    this.chartSvgElement.append('text')
        .attr('class', 'charttext details')
        .attr('x', this.getChartCenterPositionX())
        .attr('y', this.getChartCenterPositionY())
        .style('opacity', 0)
      .transition().delay(durationTransition)
        .style('opacity', detailsOpacity);
  }

  getChartCenterPositionX () {
    return (this.chartWidth / 2);
  }

  getChartCenterPositionY () {
    return (this.chartHeight / 2);
  }

  getDetailsOpacity () {
    return 0.9;
  }

  displayChart (data, showAdd2Cart = false) {
    this.showAdd2Cart = showAdd2Cart;

    this.updateChartScales(data);

    this.displaySeriesChart(data);

    setTimeout(() => {
      const dataDayText = data.filter(d => {
        return (d.datetime.getUTCHours() === 0);
      });
      let index = 0;
      this.onLoadingInterval = setInterval(() => {
        this.onMouseOutSerieDayText();
        if (index === dataDayText.length) {
          clearInterval(this.onLoadingInterval);
          return;
        }
        this.onMouseOverSerieDayText(dataDayText[index], false);
        index++;
      }, 1800);
    }, 600);
  }

  updateChartScales (data) {
    let minDateOfData = d3.min(data, d => {
      return d.datetime;
    });
    let maxDateOfData = d3.max(data, d => {
      return d.datetime;
    });
    let radiusScaleDomain = [];
    let radiusScaleDomainDateIterator = new Date(minDateOfData.getTime());
    while (radiusScaleDomainDateIterator.getTime() <= maxDateOfData.getTime()) {
      radiusScaleDomain.push(radiusScaleDomainDateIterator.getUTCDay());
      radiusScaleDomainDateIterator.setDate(radiusScaleDomainDateIterator.getDate() + 1);
    }
    this.radiusScale
      .domain(radiusScaleDomain);

    let minValueOfData = d3.min(data, d => {
      let valueOfData = d.queries;
      if (valueOfData > 0) { // Zero values are ignored for the scales
        return valueOfData;
      }
    });
    let maxValueOfData = d3.max(data, d => {
      return d.queries;
    });
    this.valueRadiusScale
      .domain([minValueOfData, maxValueOfData]);
    this.valueOpacityScale
      .domain([minValueOfData, maxValueOfData]);
  }

  displaySeriesChart (data) {
    // --- JOIN ---
    let series = this.chartSvgElement.selectAll('.serie')
      .data(data);

    // --- REMOVE ---
    this.removeSeries(series);

    // --- UPDATE ---
    this.updateSeries(series);

    // --- ENTER ---
    this.enterSeries(series);

    this.chartSvgElement.selectAll('.serie').sort((d1, d2) => {
      return d3.ascending(d1.datetime.getTime(), d2.datetime.getTime());
    });
  }

  removeSeries (series) {
    let exitSeries = series.exit();

    const durationRemoveTransition = 400;
    exitSeries.select('.serieitem')
      .transition().duration(durationRemoveTransition)
        .style('opacity', 0);
    exitSeries
      .transition().duration(durationRemoveTransition)
        .remove();
  }

  updateSeries (series) {
    const durationUpdateTransition = 1000;
    series.select('.serieitem.content')
      .transition().duration(durationUpdateTransition)
        .attr('r', d => {
          return this.getSerieItemContentRadius(d);
        })
        .style('opacity', d => {
          return this.getSerieItemContentOpacity(d);
        });
  }

  getSerieItemContentRadius (d) {
    let valueOfData = d.queries;
    if (valueOfData === 0) {
      return 0;
    }
    return ((this.radiusScale.bandwidth() / 2) * this.valueRadiusScale(valueOfData));
  }

  getSerieItemContentOpacity (d) {
    if (d.datetime.getUTCDay() === this.dayToHighlight) {
      return 1;
    }
    return this.valueOpacityScale(d.queries);
  }

  enterSeries (series) {
    let enterSeries = series.enter().append('g')
        .attr('class', 'serie');

    const durationEnterTransition = 300;
    this.enterSeriesHourText(enterSeries, durationEnterTransition);

    this.enterSeriesContainer(enterSeries, durationEnterTransition);

    this.enterSeriesDayText(enterSeries, durationEnterTransition);

    this.enterSeriesContent(enterSeries, durationEnterTransition);
  }

  enterSeriesContainer (enterSeries, durationEnterTransition) {
    enterSeries.append('path')
        .on('mouseover', d => {
          this.onMouseOverSerieItem(d);
        })
        .on('mouseout', () => {
          this.onMouseOutSerieItem();
        })
        .attr('class', d => {
          return this.getSerieItemContainerClass(d);
        })
        .attr('transform', `translate(${this.getChartCenterPositionX()},${this.getChartCenterPositionY()})`)
        .attr('d', d => {
          return this.getSerieItemContainerCommands(d);
        })
        .style('opacity', 0)
      .transition().duration(durationEnterTransition)
        .style('opacity', d => {
          return this.getSerieItemContainerOpacity(d);
        });
  }

  onMouseOverSerieItem (d) {
    clearInterval(this.onLoadingInterval);

    this.updateChartDetailsText(d);

    this.chartSvgElement.selectAll('.serieitem.container, .serieitem.content, .serieitem.hourtext')
      .filter(dt => {
        return this.filterSelectedSerieItemsHour(dt, d);
      })
        .classed('selected', true);
    this.chartSvgElement.selectAll('.serieitem.container:not(.selected), ' +
      '.serieitem.content:not(.selected), .serieitem.hourtext:not(.selected)')
        .classed('notselected', true);

    this.chartSvgElement.selectAll('.serieitem.daytext')
      .filter(dt => {
        return this.filterSelectedSerieItemsDay(dt, d);
      })
      .classed('selected', true);
    this.chartSvgElement.selectAll('.serieitem.daytext:not(.selected)')
      .classed('notselected', true);

    this.chartSvgElement.selectAll('.serieitem.daytext.selected, .serieitem.hourtext.selected')
        .style('opacity', 1);

    this.chartSvgElement.selectAll('.serieitem.content.notselected:not(.highlight)')
        .style('opacity', 0.1);
    this.chartSvgElement.selectAll('.serieitem.daytext.notselected:not(.highlight), .serieitem.hourtext.notselected')
        .style('opacity', 0.2);
  }

  updateChartDetailsText (d, acumulateAllDay) {
    this.chartSvgElement.select('.chartcenter')
        .classed('nothighlight', (d && (d.datetime.getUTCDay() !== this.dayToHighlight)));

    this.chartSvgElement.selectAll('.charttext.details')
        .attr('class', (dt, i) => {
          return this.getChartDetailsClass(d, i);
        })
        .attr('y', (dt, i) => {
          return this.getChartDetailsPositionY(d, i);
        })
        .text((dt, i) => {
          return this.getChartDetailsText(d, i, acumulateAllDay);
        })
        .style('opacity', this.getDetailsOpacity());
  }

  getChartDetailsClass (d, i) {
    let chartDetailsCls = 'charttext details';
    if (d) {
      if (d.datetime.getUTCDay() !== this.dayToHighlight) {
        chartDetailsCls += ' nothighlight';
      }
      switch (i) {
        case 0:
          chartDetailsCls += ' datetime';
          break;
        case 1:
          chartDetailsCls += ' value queries';
          break;
        case 2:
          chartDetailsCls += ' value add2cart';
          break;
      }
    }
    return chartDetailsCls;
  }

  getChartDetailsPositionY (d, i) {
    let chartDetailsPositionY = this.getChartCenterPositionY();
    let showAllDetailsTexts = (!d || this.showAdd2Cart);
    switch (i) {
      case 0:
        if (!showAllDetailsTexts) {
          chartDetailsPositionY -= (this.detailsMargin / 2);
        } else {
          chartDetailsPositionY -= this.detailsMargin;
        }
        break;
      case 1:
        if (!showAllDetailsTexts) {
          chartDetailsPositionY += (this.detailsMargin / 2);
        }
        break;
      case 2:
        if (!showAllDetailsTexts) {
          chartDetailsPositionY += (this.detailsMargin / 2);
        } else {
          chartDetailsPositionY += this.detailsMargin;
        }
        break;
    }
    return chartDetailsPositionY;
  }

  getChartDetailsText (d, i, acumulateAllDay) { // TODO: refactor this hell
    let chartDetailsText;
    if (d) {
      let data = this.chartSvgElement.selectAll('.serie').data();
      let queriesCurrent = d3.sum(data, dt => {
        if (((dt.datetime.getUTCDay() === d.datetime.getUTCDay())
            && (acumulateAllDay || (dt.datetime.getUTCHours() === d.datetime.getUTCHours())))) {
          return dt.queries;
        }
      });
      let datetimePrevious = new Date(d.datetime);
      datetimePrevious.setDate(datetimePrevious.getDate() - 1);
      let isFirstDay = true;
      let queriesPrevious = d3.sum(data, dt => {
        if (((dt.datetime.getUTCDay() === datetimePrevious.getUTCDay())
            && (acumulateAllDay || (dt.datetime.getUTCHours() === datetimePrevious.getUTCHours())))) {
          isFirstDay = false;
          return dt.queries;
        }
      });
      switch (i) {
        case 0:
          let dateDayText = '';
          if (acumulateAllDay && (d.datetime.getUTCDay() === this.dayToHighlight)) {
            dateDayText = 'Black ';
          }
          let dateDay = new Date(d.datetime.getUTCFullYear(), d.datetime.getUTCMonth(), d.datetime.getUTCDate());
          dateDayText += dateDay.toLocaleDateString('en', {
            weekday: 'long'
          });
          chartDetailsText = `${dateDayText}`;
          if (!acumulateAllDay) {
            chartDetailsText += `, ${d.datetime.getUTCHours()}:00`;
          }
          break;
        case 1:
          let queriesCurrentString;
          if (isFirstDay || (queriesPrevious === 0)) {
            queriesCurrentString = queriesCurrent.toLocaleString('en')
          } else {
            let queriesCurrentRatio = Math.round(((queriesCurrent / queriesPrevious) - 1) * 100);
            queriesCurrentString = ((queriesCurrentRatio > 0) ? '+' : '-');
            queriesCurrentString += `${Math.abs(queriesCurrentRatio).toLocaleString('en')}%`;
          }
          chartDetailsText = `${queriesCurrentString} Queries`;
          break;
        case 2:
          if (this.showAdd2Cart) {
            let add2cartCurrent = d3.sum(data, dt => {
              if (((dt.datetime.getUTCDay() === d.datetime.getUTCDay())
                  && (acumulateAllDay || (dt.datetime.getUTCHours() === d.datetime.getUTCHours())))) {
                return dt.add2cart;
              }
            });
            add2cartCurrent = (queriesCurrent > 0 ? ((add2cartCurrent/queriesCurrent) * 100) : 0);
            let add2cartPrevious = d3.sum(data, dt => {
              if (((dt.datetime.getUTCDay() === datetimePrevious.getUTCDay())
                  && (acumulateAllDay || (dt.datetime.getUTCHours() === datetimePrevious.getUTCHours())))) {
                return dt.add2cart;
              }
            });
            add2cartPrevious = (queriesPrevious > 0 ? ((add2cartPrevious/queriesPrevious) * 100) : 0);
            let add2cartCurrentString;
            if (isFirstDay || (add2cartPrevious === 0)) {
              add2cartCurrentString = add2cartCurrent.toFixed(2).toLocaleString('en');
            } else {
              let add2cartCurrentRatio = (((add2cartCurrent / add2cartPrevious) - 1) * 100);
              add2cartCurrentString = ((add2cartCurrentRatio > 0) ? '+' : '-');
              add2cartCurrentString += Math.abs(add2cartCurrentRatio).toFixed(1).toLocaleString('en');
            }
            chartDetailsText = `${add2cartCurrentString}% Add2Cart`;
          }
          break;
      }
    } else {
      switch (i) {
        case 0:
          chartDetailsText = 'You can mouse-over';
          break;
        case 1:
          chartDetailsText = 'to see the details of';
          break;
        case 2:
          chartDetailsText = 'each day and hour';
          break;
      }
    }
    return chartDetailsText;
  }

  filterSelectedSerieItemsDay (dt, d) {
    return (dt.datetime.getUTCDay() === d.datetime.getUTCDay());
  }

  filterSelectedSerieItemsHour (dt, d) {
    return (dt.datetime.getUTCHours() === d.datetime.getUTCHours());
  }

  onMouseOutSerieItem () {
    this.updateChartDetailsText();

    this.chartSvgElement.selectAll('.serieitem')
        .classed('selected', false)
        .classed('notselected', false);

    this.chartSvgElement.selectAll('.serieitem.content')
        .style('opacity', d => {
          return this.getSerieItemContentOpacity(d);
        });
    this.chartSvgElement.selectAll('.serieitem.daytext, .serieitem.hourtext')
        .style('opacity', d => {
          return this.getSerieItemTextOpacity(d);
        });
  }

  getSerieItemContainerClass (d) {
    let cls = 'serieitem container';
    if (d.datetime.getUTCDay() === this.dayToHighlight) {
      cls += ' highlight';
    }
    return cls;
  }

  getSerieItemContainerCommands (d) {
    let arc = d3.arc()
      .innerRadius(this.radiusScale(d.datetime.getUTCDay()))
      .outerRadius(this.radiusScale(d.datetime.getUTCDay()) + this.radiusScale.bandwidth())
      .startAngle(this.angleScale(d.datetime.getUTCHours()) - (this.angleScale.bandwidth() / 2))
      .endAngle(this.angleScale(d.datetime.getUTCHours()) + (this.angleScale.bandwidth() / 2));

    return arc();
  }

  getSerieItemContainerOpacity (d) {
    if (d.datetime.getUTCDay() === this.dayToHighlight) {
      return 0.25;
    }
    return 1;
  }

  enterSeriesDayText (enterSeries, durationEnterTransition) {
    enterSeries.append('path')
        .attr('class', 'serieitem hourseparator')
        .style('display', d => {
          return this.getSerieItemHourDayTextDisplay(d);
        })
        .attr('transform', `translate(${this.getChartCenterPositionX()},${this.getChartCenterPositionY()})`)
        .attr('d', d => {
          return this.getSerieItemDayTextSeparatorCommands(d);
        })
        .style('opacity', 0)
      .transition().duration(durationEnterTransition)
        .style('opacity', 0.1);

    enterSeries.append('path')
        .on('mouseover', d => {
          this.onMouseOverSerieDayText(d);
        })
        .on('mouseout', () => {
          this.onMouseOutSerieDayText();
        })
        .attr('class', d => {
          return this.getSerieItemContainerClass(d);
        })
        .style('display', d => {
          return this.getSerieItemDayTextDisplay(d);
        })
        .attr('transform', `translate(${this.getChartCenterPositionX()},${this.getChartCenterPositionY()})`)
        .attr('d', d => {
          return this.getSerieItemDayTextCommands(d);
        })
        .style('opacity', 0)
      .transition().duration(durationEnterTransition)
        .style('opacity', d => {
          return this.getSerieItemContainerOpacity(d);
        });

    enterSeries.append('text')
        .on('mouseover', d => {
          this.onMouseOverSerieDayText(d);
        })
        .on('mouseout', () => {
          this.onMouseOutSerieDayText();
        })
        .attr('class', d => {
          return this.getSerieItemDayTextClass(d);
        })
        .style('display', d => {
          return this.getSerieItemDayTextDisplay(d);
        })
        .attr('x', this.getChartCenterPositionX())
        .attr('y', this.getChartCenterPositionY())
        .text(d => {
          return this.getSerieItemDayTextValue(d);
        })
        .style('opacity', 0)
      .transition().duration(durationEnterTransition)
        .attr('x', d => {
          return this.getSerieItemDayTextPositionX(d);
        })
        .attr('y', d => {
          return this.getSerieItemDayTextPositionY(d);
        })
        .style('opacity', d => {
          return this.getSerieItemTextOpacity(d);
        });
  }

  getSerieItemDayTextClass (d) {
    let cls = 'serieitem daytext';
    if (d.datetime.getUTCDay() === this.dayToHighlight) {
      cls += ' highlight';
    }
    return cls;
  }

  getSerieItemDayTextDisplay (d) {
    if (d.datetime.getUTCHours() === this.angleScale.domain()[1]) {
      return 'block';
    }
    return 'none';
  }

  getSerieItemHourDayTextDisplay (d) {
    if ((d.datetime.getUTCDay() ===  this.radiusScale.domain()[0])
      && (d.datetime.getUTCHours() === this.angleScale.domain()[1])) {
      return 'block';
    }
    return 'none';
  }

  getSerieItemDayTextSeparatorCommands (d) {
    let radiusScaleDomain = this.radiusScale.domain();
    let arc = d3.arc()
      .innerRadius(this.radiusScale(radiusScaleDomain[0]))
      .outerRadius(this.radiusScale(radiusScaleDomain[radiusScaleDomain.length - 1]) + this.radiusScale.bandwidth())
      .startAngle(this.angleScale(d.datetime.getUTCHours()) - (this.angleScale.bandwidth() * 1.5))
      .endAngle(this.angleScale(d.datetime.getUTCHours()) - (this.angleScale.bandwidth() / 2));

    return arc();
  }

  onMouseOverSerieDayText (d, disableOnLoadingInterval = true) {
    if (disableOnLoadingInterval) {
      clearInterval(this.onLoadingInterval);
    }

    this.updateChartDetailsText(d, true);

    this.chartSvgElement.selectAll('.serieitem.container, .serieitem.content, .serieitem.daytext')
      .filter(dt => {
        return this.filterSelectedSerieItemsDay(dt, d);
      })
        .classed('selected', true);
    this.chartSvgElement.selectAll('.serieitem.container:not(.selected), ' +
      '.serieitem.content:not(.selected), .serieitem.daytext:not(.selected)')
        .classed('notselected', true);

    this.chartSvgElement.selectAll('.serieitem.daytext.selected')
        .style('opacity', 1);

    this.chartSvgElement.selectAll('.serieitem.content.notselected:not(.highlight)')
        .style('opacity', 0.1);
    this.chartSvgElement.selectAll('.serieitem.daytext.notselected:not(.highlight)')
        .style('opacity', 0.2);
  }

  onMouseOutSerieDayText () {
    this.updateChartDetailsText();

    this.chartSvgElement.selectAll('.serieitem')
        .classed('selected', false)
        .classed('notselected', false);

    this.chartSvgElement.selectAll('.serieitem.content')
        .style('opacity', d => {
          return this.getSerieItemContentOpacity(d);
        });
    this.chartSvgElement.selectAll('.serieitem.daytext')
        .style('opacity', d => {
          return this.getSerieItemTextOpacity(d);
        });
  }

  getSerieItemDayTextCommands (d) {
    let arc = d3.arc()
      .innerRadius(this.radiusScale(d.datetime.getUTCDay()))
      .outerRadius(this.radiusScale(d.datetime.getUTCDay()) + this.radiusScale.bandwidth())
      .startAngle(this.angleScale(d.datetime.getUTCHours()) - (this.angleScale.bandwidth() * 1.5))
      .endAngle(this.angleScale(d.datetime.getUTCHours()) - (this.angleScale.bandwidth() / 2));

    return arc();
  }

  getSerieItemDayTextPositionX (d) {
    let serieItemPositionX = this.getChartCenterPositionX();

    let angle = (this.angleScale(d.datetime.getUTCHours()) - this.angleScale.bandwidth());
    let radius = (this.radiusScale(d.datetime.getUTCDay()) + (this.radiusScale.bandwidth() / 2));
    serieItemPositionX += (Math.sin(angle) * radius);

    return serieItemPositionX;
  }

  getSerieItemDayTextPositionY (d) {
    let serieItemPositionY = this.getChartCenterPositionY();

    let angle = (this.angleScale(d.datetime.getUTCHours()) - this.angleScale.bandwidth());
    let radius = (this.radiusScale(d.datetime.getUTCDay()) + (this.radiusScale.bandwidth() / 2));
    serieItemPositionY -= (Math.cos(angle) * radius);

    return serieItemPositionY;
  }

  getSerieItemDayTextValue (d) {
    let dateDay = new Date(d.datetime.getUTCFullYear(), d.datetime.getUTCMonth(), d.datetime.getUTCDate());
    return dateDay.toLocaleDateString('en', {
      weekday: 'short'
    });
  }

  getSerieItemTextOpacity (d) {
    if (d.datetime.getUTCDay() === this.dayToHighlight) {
      return 1;
    }
    return 0.7;
  }

  enterSeriesHourText (enterSeries, durationEnterTransition) {
    enterSeries.append('path')
        .attr('class', 'serieitem hourseparator')
        .style('display', d => {
          return this.getSerieItemHourDisplay(d);
        })
        .attr('transform', `translate(${this.getChartCenterPositionX()},${this.getChartCenterPositionY()})`)
        .attr('d', d => {
          return this.getSerieItemHourSeparatorCommands(d);
        })
        .style('opacity', 0)
      .transition().duration(durationEnterTransition)
        .style('opacity', 0.1);

    enterSeries.append('text')
        .attr('class', d => {
          return this.getSerieItemHourTextClass(d);
        })
        .style('display', d => {
          return this.getSerieItemHourDisplay(d);
        })
        .attr('x', d => {
          return this.getSerieItemHourTextPositionX(d);
        })
        .attr('y', d => {
          return this.getSerieItemHourTextPositionY(d);
        })
        .text(d => {
          return this.getSerieItemHourTextValue(d);
        })
        .style('opacity', 0)
      .transition().duration(durationEnterTransition)
        .style('opacity', d => {
          return this.getSerieItemTextOpacity(d);
        });
  }

  getSerieItemHourDisplay (d) {
    if (d.datetime.getUTCDay() === this.radiusScale.domain()[0]) {
      return 'block';
    }
    return 'none';
  }

  getSerieItemHourSeparatorCommands (d) {
    let radiusScaleDomain = this.radiusScale.domain();
    let arc = d3.arc()
      .innerRadius(this.radiusScale(radiusScaleDomain[0]))
      .outerRadius(this.radiusScale(radiusScaleDomain[radiusScaleDomain.length - 1]) + this.radiusScale.bandwidth())
      .startAngle(this.angleScale(d.datetime.getUTCHours()) - (this.angleScale.bandwidth() / 2))
      .endAngle(this.angleScale(d.datetime.getUTCHours()) + (this.angleScale.bandwidth() / 2));

    return arc();
  }

  getSerieItemHourTextClass (d) {
    let cls = 'serieitem hourtext';
    if (d.datetime.getUTCDay() === this.dayToHighlight) {
      cls += ' highlight';
    }
    return cls;
  }

  getSerieItemHourTextPositionX (d) {
    let serieItemPositionX = this.getChartCenterPositionX();

    let angle = this.angleScale(d.datetime.getUTCHours());
    let radiusDomain = this.radiusScale.domain();
    let radius = (this.radiusScale(radiusDomain[radiusDomain.length - 1]) + (this.radiusScale.bandwidth() * 1.5));
    serieItemPositionX += (Math.sin(angle) * radius);

    return serieItemPositionX;
  }

  getSerieItemHourTextPositionY (d) {
    let serieItemPositionY = this.getChartCenterPositionY();

    let angle = this.angleScale(d.datetime.getUTCHours());
    let radiusDomain = this.radiusScale.domain();
    let radius = (this.radiusScale(radiusDomain[radiusDomain.length - 1]) + (this.radiusScale.bandwidth() * 1.5));
    serieItemPositionY -= (Math.cos(angle) * radius);

    return serieItemPositionY;
  }

  getSerieItemHourTextValue (d) {
    return `${d.datetime.getUTCHours()}:00`;
  }

  enterSeriesContent (enterSeries, durationEnterTransition) {
    enterSeries.append('circle')
        .on('mouseover', d => {
          this.onMouseOverSerieItem(d);
        })
        .on('mouseout', () => {
          this.onMouseOutSerieItem();
        })
        .attr('class', d => {
          return this.getSerieItemContentClass(d);
        })
        .attr('cx', this.getChartCenterPositionX())
        .attr('cy', this.getChartCenterPositionY())
        .attr('r', 0)
        .style('opacity', 0)
      .transition().duration(durationEnterTransition)
        .attr('cx', d => {
          return this.getSerieItemContentPositionX(d);
        })
        .attr('cy', d => {
          return this.getSerieItemContentPositionY(d);
        })
        .attr('r', d => {
          return this.getSerieItemContentRadius(d);
        })
        .style('opacity', d => {
          return this.getSerieItemContentOpacity(d);
        });
  }

  getSerieItemContentClass (d) {
    let cls = 'serieitem content';
    if (d.datetime.getUTCDay() === this.dayToHighlight) {
      cls += ' highlight';
    }
    return cls;
  }

  getSerieItemContentPositionX (d) {
    let serieItemPositionX = this.getChartCenterPositionX();

    let angle = this.angleScale(d.datetime.getUTCHours());
    let radius = (this.radiusScale(d.datetime.getUTCDay()) + (this.radiusScale.bandwidth() / 2));
    serieItemPositionX += (Math.sin(angle) * radius);

    return serieItemPositionX;
  }

  getSerieItemContentPositionY (d) {
    let serieItemPositionY = this.getChartCenterPositionY();

    let angle = this.angleScale(d.datetime.getUTCHours());
    let radius = (this.radiusScale(d.datetime.getUTCDay()) + (this.radiusScale.bandwidth() / 2));
    serieItemPositionY -= (Math.cos(angle) * radius);

    return serieItemPositionY;
  }

}
