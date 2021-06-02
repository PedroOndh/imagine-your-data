import {csv, json} from 'd3-request';

const readCsvFile = (csvFile, callback) => {
  csv(csvFile, (error, data) => {
    if (error) {
      console.error(error);
    } else {
      callback(data);
    }
  });
};

const readJsonFile = (jsonFile, callback) => {
  json(jsonFile, (error, data) => {
    if (error) {
      console.error(error);
    } else {
      callback(data);
    }
  });
};

export {
  readCsvFile,
  readJsonFile
};
