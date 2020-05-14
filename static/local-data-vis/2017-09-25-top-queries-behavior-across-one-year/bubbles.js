// Set the dimensions of the canvas / graph
var margin = {top: 110, right: 200, bottom: 70, left: 50},
    width = 900 - margin.left - margin.right,
    height = 540 - margin.top - margin.bottom;

var normal_opacity = 0.8;

// Parse the date / time
var parseDate = d3.time.format("%Y-%m").parse;
var parseDay = d3.time.format("%Y-%m-%d").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom")
    .ticks(12)
    .tickSize(0)
    .tickPadding(10)
    .tickFormat(d3.time.format("%b"));

var yAxis = d3.svg.axis().scale(y)
    .tickPadding(10)
    .orient("left").ticks(5).tickSize(0);

// Adds the svg canvas
var svg = d3.select("svg.bublesViz")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("font-size","12px")
        .style("font-family",'“Ubuntu”,“Open Sans”,sans-serif')
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("/local-data-vis/2017-09-25-top-queries-behavior-across-one-year/bershka_clean2.csv", function(error, data) {

    var colors = ["#E4A62F","#67A5B0","#81848B","#BD0B49","#B6C630","#414649"];
    //var colorScale = d3.scale.quantile().domain([min_query_val,max_query_val]).range(colors)
    var colorScale = d3.scale.ordinal().domain(Array.from(new Set(data.map(function(d){return d.Queries;})))).range(colors);

    data.forEach(function(d) {
        d.Dates = parseDate(d.Dates);
        d.Values = +d.Values;
        d.Color = colorScale(d.Queries);
        d.Year = d.Dates.getFullYear();
        d.Month = d.Dates.getMonth();
    });


    var min_query_val = d3.min(data, function (d) {
        return d.Values;
    });
    var max_query_val = d3.max(data, function (d) {
        return d.Values;
    })
    //set colors
    //var colorScale = d3.scale.linear()
    //     .domain([min_query_val,max_query_val])
    //    .range(["red","blue"]);
         //.range(["#ffebee, #ffcdd2, #ef9a9a, #e57373, #ef5350, #f44336, #e53935, #d32f2f, #c62828, #b71c1c, #ff8a80, #ff5252, #ff1744, #d50000"]);

    var radiusScale = d3.scale.linear()
         .domain([min_query_val,max_query_val])
         .range([2,35]);

    // Scale the range of the data

var max_val = d3.max(data, function (d) {
    return d.Dates;
});

var copy_max = new Date(max_val);
var max_val_range = new Date(copy_max.setTime( copy_max.getTime() + 15 * 86400000 ));


var min_val = d3.min(data, function (d) {
    return d.Dates;
});
var copy_min = new Date(min_val);
var min_val_range = new Date(copy_min.setTime( copy_min.getTime() - 15 * 86400000 ));

    // Scale the range of the data
    x.domain([min_val_range,max_val_range]);
    y.domain([0, d3.max(data, function(d) { return d.Values; })]);

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r", function(d) {
            return radiusScale(d.Values);
        })
        .attr("class",function(d) {return d.Queries; })
        .attr("cx", function(d) { return x(d.Dates); })
        .attr("cy", function(d) { return y(d.Values); })
        .attr("fill", function(d) {
            return d.Color;
        }).style("opacity", normal_opacity)
        .on("mouseover", function(d)
        {
            var color = d3.select(this).attr("fill");
            //tooltip.attr("fill",color)
            tooltip.style("display", "block");
        })
        .on("mouseout", function(d)
        {
            tooltip.style("display", "none");
        })
        .on("mousemove", function(d) {
    var xPosition = d3.mouse(this)[0] - 15;
    var yPosition = d3.mouse(this)[1] - 85;
    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    var text_string = "<tspan x='60' dy='1.4em'>" + "Keyword: " + d.Queries + "</tspan><tspan x='60' dy='1.4em'>" + "Count: " + d.Values + "</tspan>";
    //text_string += "<tspan x='60' dy='1.4em'>" + d.Dates.toDateString() + "</tspan>";
    text_string += "<tspan x='60' dy='1.4em'>" + "Findability: " + d.Finds + "</tspan>";
    tooltip.select("text").html(text_string);});

    // Add the X Axis
    var xAxisNode = svg.append("g")
        .attr("class", "x axis")
        .style("fill","grey")
        .style("shape-rendering","crispEdges")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    xAxisNode.selectAll("text").style("stroke-width",1);
    xAxisNode.selectAll("path").style("stroke","grey");

    // Add the Y Axis
    var yAxisNode = svg.append("g")
        .attr("class", "y axis")
        .style("fill","grey")
        .style("shape-rendering","crispEdges")
        .call(yAxis);
    yAxisNode.selectAll("text").style("stroke-width",1);
    yAxisNode.selectAll("path").style("stroke","grey");

  var newarr = [];

  var listOfObjects = [];

  data.forEach(function(d) {
      var query = d.Queries;
      if (newarr.includes(query)) {}
      else {
          newarr.push(query);
          var singleObj = {}
          singleObj['Queries'] = d.Queries;
          singleObj['Color'] = d.Color;
          listOfObjects.push(singleObj);
      }
  });

  var legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(listOfObjects)
      .enter()
      .append("g")
      .attr("class","bubblechart-legend")
      .attr("name", function(d) {return d.Queries;})
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width + 100)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", function(d) {return d.Color;})
      .style("opacity", normal_opacity);

  legend.append("text")
      .attr("x", width + 80)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d.Queries; });

legend.on("mouseover", function(d)
        {
            var this_class = d3.select(this).attr("name");
            this_class = "." + this_class;
            d3.selectAll("circle").style("opacity",0.05);
            d3.selectAll(this_class).style("opacity",normal_opacity);
            d3.select(this).style("font-weight","bold");
        })
        .on("mouseout", function(d)
        {
            d3.selectAll(".bubblechart-legend").style("font-weight","normal");
            d3.selectAll("circle").style("opacity",normal_opacity);
        })

  //create tooltip
var tooltip = svg.append("g")
  .attr("class","bubblechart-tooltip")
  .style("display","none");

tooltip.append("rect")
  .attr("width", 130)
  .attr("height", 70)
  .attr("fill", "#FAFAD2")
  .style("opacity", normal_opacity);


tooltip.append("text")
  .attr("x", 65)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold")
  .attr("font-family","Arial, Helvetica, sans-serif");

tooltip.append("text")
  .attr("class","datatext")
  .attr("x", 65)
  .attr("y", 30)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "10px")
  .attr("font-weight", "bold")
  .attr("fill","grey")
  .style("font-family",'“Ubuntu”,“Open Sans”,sans-serif');

var dates_limits = [{"start":0,"end":x(parseDay("2016-12-15")),"color":"#81848B","year":"2016"},
                    {"start":x(parseDay("2016-12-15")),"end":x(max_val_range),"color":"#E4A62F","year":"2017"}];

var years = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 5)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(dates_limits)
      .enter()
      .append("g");

years.append("rect")
      .attr("x", function(d) {return d.start;})
      .attr("y", height + 30)
      .attr("width", function(d) {return d.end - d.start})
      .attr("height", 5)
      .attr("fill", function(d) {return d.color;});

years.append("text")
      .attr("x", function(d) {return (d.end - d.start)/2 + d.start;})
      .attr("y", height + 40)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill","grey")
      .style("font-family",'“Ubuntu”,“Open Sans”,sans-serif')
      .text(function(d) { return d.year; });

/*
var years = svg.append("rect")
      .attr("class","years-bar")
      .attr("x", 0)
      .attr("y", height + 30)
      .attr("width", x(max_val_range))
      .attr("height", 10)
      .attr("fill","#4682b4");
*/
});


