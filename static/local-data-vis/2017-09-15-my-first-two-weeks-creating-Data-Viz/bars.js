var w = parseInt(d3.select(".graph").style('width'));


d3.json("/local-data-vis/2017-09-15-my-first-two-weeks-creating-Data-Viz/data_counts.json",function(data){
    data = data["entity"]["data"]

    var keys = data.map(function(d){return d.keyword});
    var counts = data.map(function(d) {return d.query_count});
    var clicks = data.map(function(d) {return d.click_count});

var margin = {top: 20, right: w * 0.1, bottom: 95, left: w * 0.1};
var width = w - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select(".graph")
  .append("svg")
  //.attr("preserveAspectRatio", "xMaxYMax meet")
  //.attr("viewBox", "0 0 900 600")
  //.attr("width", width + margin.left + margin.right)
  .attr("width","100%")
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .classed("svg-content", true);


// Transpose the data into layers
var dataset = d3.layout.stack()(["query_count", "click_count"].map(function(i) {
  return data.map(function(d) {
    return {x: d.keyword, y: +d[i]};
  });
}));

// Set x, y and colors
var x = d3.scale.ordinal()
  .domain(dataset[0].map(function(d) { return d.x; }))
  //.rangeRoundBands([margin.left - 40, width-margin.right], 0.2);
  .rangeRoundBands([0,width-margin.right],0.2);

var y = d3.scale.linear()
  .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
  .range([height, 0]);

var colors = ["#BD0B49","#E4A62F"]; //["b33040", "#d25c4d"]; //, "#f2b447", "#d9d574"]; "#001c9c","#101b4d","#475003","#9c8305","#d3c47c"]);

// Define and draw axes
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(5)
  .tickSize(-width, 0, 0)
  .tickFormat( function(d) { return d } );

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom").outerTickSize(0);

svg.append("g")
  .attr("class", "y axis")
  .attr("font-size","10px")
  .call(yAxis);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    //.attr("dx","5px")
    //.attr("dy", ".15em")
    .attr("font-size", "10px")
    .attr("dy","-13px")
    .attr("transform", "rotate(-90)");


// Create groups for each series, rects for each segment
var groups = svg.selectAll(".groups")
  .data(dataset)
  .enter().append("g")
  .attr("class", "groups")
  .style("fill", function(d, i) { return colors[i]; });

var rect = groups.selectAll("rect")
  .data(function(d) { return d; })
  .enter()
  .append("rect")
  .attr("class","graph-columna")
  .attr("x", function(d) { return x(d.x); })
  .attr("y", function(d) { return y(d.y0 + d.y); })
  .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
  .attr("width", x.rangeBand())
  .on("mouseover", function() { tooltip.style("display", "block"); })
  .on("mouseout", function() { tooltip.style("display", "none"); })
  .on("mousemove", function(d) {
    var xPosition = d3.mouse(this)[0] - 15;
    var yPosition = d3.mouse(this)[1] - 25;
    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    tooltip.select("text").text(d.x);
  });


// Draw legend
var legends = svg.append("g")
  .attr("class","graph-legends");

var legend = legends.selectAll(".legend")
  .data(colors)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

legend.append("rect")
  .attr("x", width - margin.right)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d, i) {return colors.slice().reverse()[i];});

legend.append("text")
  .attr("x", width - margin.right + 25 )
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function(d, i) {
    switch (i) {
      case 0: return "clicks";
      case 1: return "counts";
    }
  });



// Prep the tooltip bits, initial display is hidden
var tooltip = svg.append("g")
  .attr("class", "graph-tooltip")
  .style("display", "none");

tooltip.append("rect")
  .attr("width", 90)
  .attr("height", 40)
  .attr("fill", "white")
  .style("opacity", 0.7);

tooltip.append("text")
  .attr("x", 50)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");

  function resize() {

    w = parseInt(d3.select(".graph").style('width'));

    width = w - margin.left - margin.right;
    margin = {top: 20, right: w * 0.1, bottom: 95, left: w * 0.1};

    if (width < 300) {width = 300}

    height = 500 - margin.top - margin.bottom;

    /* Update the range of the scale with new width/height */
    x.range([0, width]);
    //x.rangeRoundBands([margin.left - 40, width-margin.right], 0.2);
    x.rangeRoundBands([0,width-margin.right],0.2);
    y.range([height, 0]);

    /* Update the axis with the new scale */

    if (width > 500 ) {
      svg.select('.x.axis')
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
    //.attr("dx","5px")
    //.attr("dy", ".15em")
      .attr("display", "block")
      .attr("font-size", "10px")
      .attr("dy","-7px")
      .attr("transform", "rotate(-90)");

      /* Force D3 to recalculate and update the legends */
      svg.select('.graph-legends').selectAll("rect")
     .attr("x", width - margin.right - 100)
     .attr("width", 18)
     .attr("height", 18)
     .style("fill", function(d, i) {return colors.slice().reverse()[i];});

      svg.select('.graph-legends').selectAll("text")
     .attr("x", width - margin.right + 25 - 100)
     .attr("y", 9)
     .attr("dy", ".35em")
     .attr("font-size","10px")
     .style("text-anchor", "start")
     .text(function(d, i) {
      switch (i) {
        case 0: return "clicks";
        case 1: return "counts";
      }
    });

    }
    else {
    svg.select('.x.axis')
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("display", "none");

    /* Force D3 to recalculate and update the legends */
    svg.select('.graph-legends').selectAll("rect")
     .attr("x", width - margin.right - 100)
     .attr("width", 15)
     .attr("height", 15)
     .style("fill", function(d, i) {return colors.slice().reverse()[i];});

    svg.select('.graph-legends').selectAll("text")
     .attr("x", width - margin.right + 25 - 100)
     .attr("y", 9)
     .attr("dy", ".35em")
     .attr("font-size","8px")
     .style("text-anchor", "start")
     .text(function(d, i) {
      switch (i) {
        case 0: return "clicks";
        case 1: return "counts";
      }
    });

    }

    svg.select('.y.axis')
      .call(yAxis);

    /* Force D3 to recalculate and update the bars */
    svg.selectAll('.graph-columna')
      .attr("x", function(d) {
          return x(d.x);
        })
      .attr("width", x.rangeBand())
      .on("mouseover", function() { tooltip.style("display", "block"); })
  .on("mouseout", function() { tooltip.style("display", "none"); })
  .on("mousemove", function(d) {
    var xPosition = d3.mouse(this)[0] - 15;
    var yPosition = d3.mouse(this)[1] - 65;
    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    tooltip.select("text").html("<tspan x='40' dy='1.4em'>" + "Text: " + d.x + "</tspan><tspan x='40' dy='1.4em'>" + "Value: " + d.y + "</tspan>");})
  .attr("text-anchor","start");


  }

  d3.select(window).on('resize', resize);

  resize();

});
