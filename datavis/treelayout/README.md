# Data Visualizations Archetype

This project will serve as an archetype for all data visualizations developed at EmpathyBroker. Its purpose is to establish a common way to structure the project, use dependencies, compile and deploy.

To create a new visualization, just clone this repository and rename the project. Don't forget to remove the .git directory to start with a brand new Git history.


## Getting started

* Run `npm install && bower install` to install dependencies
* Run `gulp serve` to preview and watch for changes
* Run `gulp serve:dist` to preview the production build
* Run `gulp` to build your visualization for production


## Adding a new dependency

When building your awesome visualization, you will typically need to add a dependency (such as d3). To do this, just run `bower install --save <package>` and this dependency will be installed and incorporated to the build process.
