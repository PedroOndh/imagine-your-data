const isNumber = value => {
  return typeof value === 'number';
}

const roundValue = value => {
  return Math.round(value * 10) / 10;
}

const makePercentString = value => {
  if (!isNumber(value)) {
    return;
  }
  return `${roundValue(value)}%`;
}

const makeMillString = (value) => {
  if (!isNumber(value)) {
    return;
  }
  const millValue = roundValue(value / 1000000);
  return `${roundValue(value / 1000000)}M`;
}

const makeYoyString = value => {
  if (!isNumber(value)) {
    return;
  }
  const percentString = `${makePercentString(value)}`;
  let prefix = '▲';
  if (percentString[0] === '-') {
    prefix = '▼';
  }
  return `${prefix} ${percentString} YoY`;
}

export {
  makeMillString,
  makePercentString,
  makeYoyString
};
