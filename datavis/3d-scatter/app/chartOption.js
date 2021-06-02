const mathHelpers = require('./utils/mathHelpers.js');
const animationDuration = 500;

const defaultOption = {
  tooltip: {
    show: false
  },
  xAxis3D: {
    name: 'Total Queries\n(with no results)',
    nameTextStyle: {
      color: 'rgba(0,0,0,1)',
      fontSize: 12,
      fontFamily: 'OpenSans'
    },
    max: 50000,
    min: 0,
    axisLabel: {
      show: true
    },
    type: 'value'
  },
  yAxis3D: {
    name: 'CTR',
    nameTextStyle: {
      color: 'rgba(0,0,0,1)',
      fontSize: 12,
      fontFamily: 'OpenSans'
    },
    max: 100,
    min: 0,
    axisLabel: {
      show: true
    },
    type: 'value'
  },
  zAxis3D: {
    name: 'Zero Results Rate',
    nameTextStyle: {
      color: 'rgba(0,0,0,1)',
      fontSize: 12,
      fontFamily: 'OpenSans'
    },
    max: 100,
    min: 0,
    axisLabel: {
      show: true
    },
    type: 'value'
  },
  grid3D: {
    boxHeight: 80,
    boxWidth: 80,
    boxDepth: 80,
    splitLine: {
      show: true,
      lineStyle: {
        opacity: .3
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(0,0,0,1)'
      }
    },
    axisLabel: {
      textStyle: {
        fontSize: 8,
        fontFamily: 'OpenSans'
      }
    },
    axisPointer: {
      show: false,
      lineStyle: {
        color: '#67A5B0',
        opacity: .3,
        width: 2
      },
      label: {
        show: false,
        textStyle: {
          fontSize: 7
        }
      }
    },
    viewControl: {
      autoRotate: true,
      autoRotateAfterStill: 3,
      alpha: 0,
      beta: 0,
      distance: 175,
      animationDurationUpdate: animationDuration
    }
  },
  series: [{
    type: 'scatter3D',
    symbolSize: (row) => row[3],
    itemStyle: {
      color: (row) => {
        return row.data[5] === 'English' ? '#67A5B0' : '#E4A62F';
      },
      opacity: .7
    },
    emphasis: {
      itemStyle: {
        color: '#BD0B49',
        opacity: 1
      },
      label: {
        show: true,
        textStyle: {
          color: '#000000',
          opacity: 1,
          borderWidth: 2,
          borderColor: '#BD0B49',
          fontSize: 12,
          fontFamily: 'OpenSans'
        },
        formatter: (row) => {
          const dataPoint = row.data;
          return `Keyword: ${dataPoint[4]} \nZero-Results-Rate: ${mathHelpers.roundValue(dataPoint[2], 1)}% \nCtr: ${mathHelpers.roundValue(dataPoint[1], 1)}% \nLanguage: ${dataPoint[5]}`;
        }
      }
    },
    animationDurationUpdate: animationDuration
  }]
};

const zeroOption1 = {
  grid3D: {
    boxDepth: 80,
    boxHeight: 80,
    viewControl: {
      autoRotate: false,
      beta: 90,
      alpha: 0,
      distance: 175
    }
  },
  xAxis3D: {
    axisLabel: {
      show: false
    },
    nameTextStyle: {
      color: 'rgba(0,0,0,0)'
    }
  },
  yAxis3D: {
    axisLabel: {
      show: true
    },
    nameTextStyle: {
      color: 'rgba(0,0,0,1)'
    }
  },
  zAxis3D: {
    axisLabel: {
      show: true
    },
    nameTextStyle: {
      color: 'rgba(0,0,0,1)'
    }
  }
};

const zeroOption2 = {
  grid3D: {
    boxWidth: 0,
    viewControl: {
      distance: 125
    }
  }
};

const ctrOption1 = {
  grid3D: {
    boxDepth: 80,
    boxHeight: 80,
    boxWidth: 80,
    viewControl: {
      beta: 0,
      alpha: 90,
      distance: 175,
      autoRotate: false,
    }
  },
  zAxis3D: {
    axisLabel: {
      show: false
    },
    nameTextStyle: {
      color: 'rgba(0,0,0,0)'
    }
  },
  yAxis3D: {
    axisLabel: {
      show: true
    },
    nameTextStyle: {
      color: 'rgba(0,0,0,1)'
    }
  },
  xAxis3D: {
    axisLabel: {
      show: true
    },
    nameGap: 12,
    nameTextStyle: {
      color: 'rgba(0,0,0,1)'
    }
  }
};

const ctrOption2 = {
  grid3D: {
    boxHeight: 0,
    viewControl: {
      distance: 125
    }
  }
};

const totalsOption1 = {
  grid3D: {
    boxDepth: 80,
    boxHeight: 80,
    boxWidth: 80,
    viewControl: {
      beta: 0,
      alpha: 0,
      distance: 175,
      autoRotate: false
    }
  },
  yAxis3D: {
    axisLabel: {
      show: false
    },
    nameTextStyle: {
      color: 'rgba(0,0,0,0)'
    },
  },
  xAxis3D: {
    axisLabel: {
      show: true
    },
    nameGap: 22,
    nameTextStyle: {
      color: 'rgba(0,0,0,1)'
    }
  },
  zAxis3D: {
    axisLabel: {
      show: true
    },
    nameTextStyle: {
      color: 'rgba(0,0,0,1)'
    }
  }
};

const totalsOption2 = {
  grid3D: {
    boxDepth: 0,
    viewControl: {
      distance: 125
    }
  }
};

const mouseInOption = {
  grid3D: {
    boxWidth: 80,
    boxHeight: 80,
    boxDepth: 80,
    viewControl: {
      distance: 175
    }
  },
  xAxis3D: {
    name: 'Total Queries\n(with no results)',
    nameTextStyle: {
      color: 'rgba(0,0,0,1)'
    },
    axisLabel: {
      show: true
    },
  },
  yAxis3D: {
    name: 'CTR',
    nameTextStyle: {
      color: 'rgba(0,0,0,1)'
    },
    axisLabel: {
      show: true
    },
  },
  zAxis3D: {
    name: 'Zero Results Rate',
    nameTextStyle: {
      color: 'rgba(0,0,0,1)'
    },
    axisLabel: {
      show: true
    },
  }
};

export {
  defaultOption,
  totalsOption1,
  totalsOption2,
  zeroOption1,
  zeroOption2,
  ctrOption1,
  ctrOption2,
  mouseInOption,
  animationDuration
}
