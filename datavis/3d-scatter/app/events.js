const chartOptions = require('./chartOption.js');

const rotateButton = document.getElementById("rotate-button");
const totalsButton = document.getElementById("totals-button");
const ctrButton = document.getElementById("ctr-button");
const zeroButton = document.getElementById("zero-button");
const zoomOutButton = document.getElementById("zoomOut-button");
const zoomInButton = document.getElementById("zoomIn-button");
const chartContainer = document.getElementById("chart");

const zoomedInOption = {
  xAxis3D: {
    max: 4000
  },
  yAxis3D: {
    max: 60
  },
  zAxis3D: {
    min: 50
  },
  series: [{
    itemStyle: {
      color: (row) => {
        let color = row.data[5] === 'English' ? '#67A5B0' : '#E4A62F';
        if (row.data[2] < 50 || row.data[0] > 4000) {
          color = 'rgba(100,100,100,0.1)'
        }
        return color;
      },
    }
  }]
};

let zoomedIn = false;
let eventsEnabled = false;
let currentOptions = {};
let preHoverOptions = {};

const disableButtons = () => {
  rotateButton.setAttribute('disabled', 'true');
  zoomOutButton.setAttribute('disabled', 'true');
  zoomInButton.setAttribute('disabled', 'true');
  totalsButton.setAttribute('disabled', 'true');
  ctrButton.setAttribute('disabled', 'true');
  zeroButton.setAttribute('disabled', 'true');
}

const enableButtons = () => {
  rotateButton.removeAttribute('disabled');
  zoomOutButton.removeAttribute('disabled');
  zoomInButton.removeAttribute('disabled');
  totalsButton.removeAttribute('disabled');
  ctrButton.removeAttribute('disabled');
  zeroButton.removeAttribute('disabled');
}

const disableEventsForSeconds = (seconds) => {
  eventsEnabled = false;
  disableButtons();
  setTimeout(() => {
    eventsEnabled = true;
    enableButtons();
  }, seconds);
}

const rotateChart = (myChart, currentOptions) => {
  if (!eventsEnabled) return;
  disableEventsForSeconds(chartOptions.animationDuration);
  ctrButton.removeAttribute('checked');
  zeroButton.removeAttribute('checked');
  totalsButton.removeAttribute('checked');
  rotateButton.setAttribute('checked', 'checked');

  let options = JSON.parse(JSON.stringify(chartOptions.defaultOption));
  if (zoomedIn) {
    options.xAxis3D.max = zoomedInOption.xAxis3D.max;
    options.yAxis3D.max = zoomedInOption.yAxis3D.max;
    options.zAxis3D.min = zoomedInOption.zAxis3D.min;
    options.series = zoomedInOption.series;
  }
  myChart.setOption(options);
  currentOptions = myChart.getOption();
};

const showZero = (myChart, currentOptions) => {
  if (!eventsEnabled) return;
  disableEventsForSeconds(chartOptions.animationDuration * 2);
  totalsButton.removeAttribute('checked');
  ctrButton.removeAttribute('checked');
  rotateButton.removeAttribute('checked');
  zeroButton.setAttribute('checked', 'checked');

  myChart.setOption(chartOptions.zeroOption1);
  setTimeout(() => {
    myChart.setOption(chartOptions.zeroOption2);
    currentOptions = myChart.getOption();
  }, chartOptions.animationDuration);
};

const showCtr = (myChart, currentOptions) => {
  if (!eventsEnabled) return;
  disableEventsForSeconds(chartOptions.animationDuration * 2);
  totalsButton.removeAttribute('checked');
  zeroButton.removeAttribute('checked');
  rotateButton.removeAttribute('checked');
  ctrButton.setAttribute('checked', 'checked');

  myChart.setOption(chartOptions.ctrOption1);
  setTimeout(() => {
    myChart.setOption(chartOptions.ctrOption2);
    currentOptions = myChart.getOption();
  }, chartOptions.animationDuration);
};

const showTotals = (myChart, currentOptions) => {
  if (!eventsEnabled) return;
  disableEventsForSeconds(chartOptions.animationDuration * 2);
  ctrButton.removeAttribute('checked');
  zeroButton.removeAttribute('checked');
  rotateButton.removeAttribute('checked');
  totalsButton.setAttribute('checked', 'checked');

  myChart.setOption(chartOptions.totalsOption1);
  setTimeout(() => {
    myChart.setOption(chartOptions.totalsOption2);
    currentOptions = myChart.getOption();
  }, chartOptions.animationDuration);
};

const zoomIn = (myChart, currentOptions) => {
  if (!eventsEnabled) return;
  zoomedIn = true;
  zoomInButton.setAttribute('checked', 'checked');
  zoomOutButton.removeAttribute('checked');
  disableEventsForSeconds(chartOptions.animationDuration);
  myChart.setOption(zoomedInOption);
  currentOptions = myChart.getOption();
};

const zoomOut = (myChart, currentOptions) => {
  if (!eventsEnabled) return;
  zoomedIn = false;
  zoomInButton.removeAttribute('checked');
  zoomOutButton.setAttribute('checked', 'checked');
  disableEventsForSeconds(chartOptions.animationDuration);

  myChart.setOption({
    xAxis3D: {
      max: 50000,
      min: 0
    },
    yAxis3D: {
      max: 100,
      min: 0
    },
    zAxis3D: {
      max: 100,
      min: 0
    },
    series: [{
      itemStyle: {
        color: (row) => row.data[5] === 'English' ? '#67A5B0' : '#E4A62F'
      }
    }]
  });
  currentOptions = myChart.getOption();
}

const enableEvents = (myChart) => {
  currentOptions = myChart.getOption();
  rotateButton.addEventListener("click", () => {
    rotateChart(myChart, currentOptions)
  }, false);
  zeroButton.addEventListener("click", () => {
    showZero(myChart, currentOptions)
  }, false);
  totalsButton.addEventListener("click", () => {
    showTotals(myChart, currentOptions)
  }, false);
  ctrButton.addEventListener("click", () => {
    showCtr(myChart, currentOptions)
  }, false);
  zoomOutButton.addEventListener("click", () => {
    zoomOut(myChart, currentOptions)
  }, false);
  zoomInButton.addEventListener("click", () => {
    zoomIn(myChart, currentOptions)
  }, false);

  chartContainer.addEventListener("mouseover", () => {
    preHoverOptions = myChart.getOption();
    myChart.setOption(chartOptions.mouseInOption)
  });
  chartContainer.addEventListener("touchmove", () => {
    preHoverOptions = myChart.getOption();
    myChart.setOption(chartOptions.mouseInOption)
  });
  chartContainer.addEventListener("mouseout", () => {
    if (!preHoverOptions.grid3D[0].viewControl.autoRotate) {
      myChart.setOption(preHoverOptions);
    }
  });

  eventsEnabled = true;
}


export {
  enableEvents
}
