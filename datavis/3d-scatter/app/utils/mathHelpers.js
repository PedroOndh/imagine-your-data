const roundValue = (value, decimalPlaces = 1) => {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(value * multiplier) / multiplier;
}

export {
  roundValue
}
