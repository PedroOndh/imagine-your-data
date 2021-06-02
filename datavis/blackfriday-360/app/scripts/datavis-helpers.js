'use strict';


class DatavisHelpers {

  static readJsonFile (jsonFile, callback) {
    d3.json(jsonFile, (error, data) => {
      if (error) {
        console.error(error);
      } else {
        callback(data);
      }
    });
  }

  static readCsvFile (csvFile, raw, callback) {
    d3.csv(csvFile, raw, (error, data) => {
      if (error) {
        console.error(error);
      } else {
        callback(data);
      }
    });
  }

}
