# Contextualise Queries Visualization

(*) Project created using the Data Visualizations Archetype "Vanilla" (cbn-datavis-archetype-vanilla).

## Build

* Run `npm install` to install dependencies
* Run `npm run watch` to watch for changes
* Run `npm run serve` to watch for changes and host the project locally inside a temporary folder
* Run `npm run build` to build your visualization for production in a `dist` folder
* Run `npm run test` to run all tests

### Development

The application is located in the `app` folder. Inside this folder is a data folder for any data files and styles folder for stylesheets. Stylesheets need to be included through JavaScript using `import`. The data folder and its content will be copied into the location of the transpiled result. The entry-point for the JavaScript code is `app.js`. All dependencies and modules the imported to this entry point will be included in the transpiled and bundled result in the build.

Test are run with Jasmine and the test files are located in the `spec` folder.

This project will (soon) contain a Jenkins file referencing a Jenkins pipeline executing the following steps:

* Run `npm run build && npm run test`
* Deploy content of the `dist` folder to the URL `https://www.imagineyourdata.com/datavis/{project-name}/`

It should be possible to use any frameworks and/or libraries with this project and all npm scripts can be edited in the `package.json` file. The only requirement for the Jenkins pipeline to work is for the `npm run build` command to create a transpiled and working web-project inside a `dist` folder inside the root directory.
