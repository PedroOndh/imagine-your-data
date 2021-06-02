const getBrokerColorByIndex = (index) => {
  const colors = ['#E4A62F', '#B6C630', '#67A5B0', '#BD0B49', '#414649', '#81848B'];
  return colors[index] || 'black';
};

const readCsvFile = (csvFile, callback) => {
  d3.csv(csvFile, (error, data) => {
    if (error) {
      console.error(error);
    } else {
      callback(data);
    }
  });
}
