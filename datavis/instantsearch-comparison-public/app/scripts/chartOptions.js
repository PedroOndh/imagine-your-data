const SMOOTH = false;
const WIDTH = 2;
const CIRCLE_SIZE = 5;
const SHOW_SYMBOL = false;

const getOption = (visData, maxY, xValues, xInterval, xMetricName, yAxisName) => {
  return {
    title: [{
      left: '22%',
      y: '5%',
      orient: 'center',
      text: 'Desktop'
    }, {
      right: '22%',
      y: '5%',
      orient: 'center',
      text: 'Mobile'
    }],
    color: ['#B6C630', '#67A5B0', '#BD0B49'],
    tooltip: {
      trigger: 'axis',
      borderWidth: 2,
      transitionDuration: 1,
      textStyle: {
        fontSize: 10
      },
      extraCssText: 'text-align: left;',
      formatter: `{b0} ${xMetricName}:
                  <hr width="140"/>
                  <li style="color: #B6C630;">Instant Search ON: {c0}%</li>
                  <li style="color: #67A5B0;">Instant Search OFF: {c1}%</li>`
    },
    xAxis: [{
      type: 'category',
      data: xValues,
      axisTick: {
        length: 0
      },
      axisLabel: {
        interval: xInterval,
        textStyle: {
          fontSize: 7,
          margin: 8
        }
      }
    }, {
      type: 'category',
      name: xMetricName,
      data: xValues,
      axisTick: {
        length: 0
      },
      gridIndex: 1,
      axisLabel: {
        interval: xInterval,
        textStyle: {
          fontSize: 7,
          margin: 8
        }
      }
    }],
    yAxis: [{
      name: yAxisName,
      min: 0,
      max: maxY,
      axisLabel: {
        formatter: '{value} %'
      }
    }, {
      min: 0,
      max: maxY,
      gridIndex: 1,
      axisTick: {
        length: 0
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      }
    }],
    textStyle: {
      fontFamily: 'OpenSans',
      fontSize: 9
    },
    legend: {
      orient: 'center',
      x: 'center',
      y: '93%',
      data: ['Instant Search ON', 'Instant Search OFF']
    },
    grid: [{
      right: '55%'
    }, {
      left: '55%'
    }],
    series: [{
        name: 'Instant Search ON',
        type: 'line',
        data: visData[0],
        showSymbol: SHOW_SYMBOL,
        symbolSize: CIRCLE_SIZE,
        showAllSymbol: true,
        smooth: SMOOTH,
        lineStyle: {
          normal: {
            width: WIDTH
          }
        },
      },
      {
        name: 'Instant Search OFF',
        type: 'line',
        data: visData[1],
        symbolSize: CIRCLE_SIZE,
        showSymbol: SHOW_SYMBOL,
        showAllSymbol: true,
        smooth: SMOOTH,
        lineStyle: {
          normal: {
            width: WIDTH
          }
        }
      },
      {
        name: 'Instant Search ON',
        type: 'line',
        data: visData[2],
        symbolSize: CIRCLE_SIZE,
        showSymbol: SHOW_SYMBOL,
        showAllSymbol: true,
        smooth: SMOOTH,
        lineStyle: {
          normal: {
            width: WIDTH
          }
        },
        xAxisIndex: 1,
        yAxisIndex: 1
      },
      {
        name: 'Instant Search OFF',
        type: 'line',
        data: visData[3],
        symbolSize: CIRCLE_SIZE,
        showSymbol: SHOW_SYMBOL,
        showAllSymbol: true,
        smooth: SMOOTH,
        lineStyle: {
          normal: {
            width: WIDTH
          }
        },
        xAxisIndex: 1,
        yAxisIndex: 1
      }
    ],
    animation: true,
    animationDuration: 1000
  };
};
