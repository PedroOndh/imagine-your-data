# Google Analytics HTML Report

This repository contains scripts to create Google Analytics reports generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

## Run reports

To export a new report, execute the following command in the root of this project:

```python2 run_report.sh {start_date} {end_date} {client_db}```

Start and end-date have to be in the format YYYY-MM-DD, for exmaple:

```python2 run_report.sh 2017-12-25 2018-01-01 sb_zara```

This will create a folder named `my_report_2017-12-25_2018-01-01_zara` containing the built report. The contents of this folder need to be hosted by a web-server to be viewed.

## Build Report FrontEnd

* Run `npm install` to install dependencies
* Run `npm run start` to watch for changes and host the project locally inside a temporary folder
* Run `npm run build` to build your visualization for production in a `dist` folder
* Run `npm run test` to run all tests
* Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Development

The FrontEnd of the report is located in the `src/app` folder. Inside the `src` folder is an `assets` folder for the data files.
Python scripts to pull data from MongoDB are located in the `python-scripts` folder.

Test are run with Jasmine and the test files need to include `.spec` before the file extension.

![Screenshot](https://bytebucket.org/colbenson/cbn-ga-report-html/raw/5f1c6c1075cdbda53cd026adbf043a70dab6e893/Screen_Shot.png?token=2f4f1479cf8c3c7ca208d66eb5865d3c062c9bc7)
