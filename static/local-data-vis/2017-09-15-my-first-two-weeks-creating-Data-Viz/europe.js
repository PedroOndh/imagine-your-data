
/*
libs:
"https://d3js.org/queue.v1.min.js"
"https://d3js.org/d3.v3.js"
"https://d3js.org/topojson.v1.min.js"

author: David Lourenço Mestre
EmpathyBroker
*/
var countries_list;
var margin = {top: 50, left: 200, bottom: 20, right: 20}
  , width = parseInt(d3.select('.europechart').style('width'))
  , width = width - margin.left - margin.right
  , mapRatio = .5
  , height = width * mapRatio;

var projection = d3.geo.mercator()
    .scale(width/2.50)
    .translate([width/5,height*1.4]);

var container_europe = d3.select(".europechart");

var svg = container_europe.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g").attr("class","europe");

// load and display Europe and API data with Queue : "https://d3js.org/queue.v1.min.js"
queue()
    .defer(d3.json,"/local-data-vis/2017-09-15-my-first-two-weeks-creating-Data-Viz/eu.json")
    .defer(d3.json,"/local-data-vis/2017-09-15-my-first-two-weeks-creating-Data-Viz/queries_by_country.json")
    .await(graphMap)

function graphMap(error,topology,counts) {
    var tooltipDiv = container_europe.append("div")
    .attr("class","europechart-tooltipdiv")
    .style("position","absolute")
    .style("width","150px")
    .style("height","95px")
    .style("opacity",0)
    .style("border-left","3px solid red")
    .style("background","#F8F8F8")
    .style("font-size","12px")
    .style("padding","10px")
    .style("font-family",'“Ubuntu”,“Open Sans”,sans-serif')
    .style("border-radius","1px");

    countries_list = Object.keys(counts);

    g.selectAll("path")
      .data(topojson.feature(topology,topology.objects.europe).features)
      .enter()
      .append("path")
      .attr("class","country")
      .style("stroke-width","0.5px")
      .style("stroke","white")
      .style("opacity",1)
      .attr("d", path)
      .attr("fill",colorCountry)
      .on("mouseover", function(d)
      {
          //if there is data for the country being hovered, display tooltip
          if (countries_list.includes(d.properties.name)) {
              tooltipDiv
              .style("opacity", 0.65)
              return d3.select(this)
                  .attr("fill","#BD0B49")
                  .style("stroke-width","2px")
                  .style("stroke","white")
                  .style("opacity",0.1);
          }
      })
      .on("mouseout", function(d)
      {
          //hide tooltip on mouseout
          tooltipDiv.style("opacity", 0);
          return d3.select(this)
              .attr("fill",colorCountry)
              .style("stroke-width","0.5px")
              .style("opacity",1);
      })
      .on("mousemove", function(d)
      {
          //if there is data for the country being hovered, display tooltip
          if (countries_list.includes(d.properties.name)) {
              country_name = d.properties.name;
              tooltipDiv
                 .style("opacity",0.65)
                 //.style("left", (d3.mouse(this)[0] - 55) + 'px')
                 //.style("top",(d3.mouse(this)[1] - 90) + 'px');
                 .style("left", (d3.event.clientX - 85)  + "px")
                 .style("top", (d3.event.clientY + 60) + "px");
              html_to_insert = "<h3 style='margin:0; border-bottom: 1px solid black; padding: 5px; font-size:13px;'>" + d.properties.name + "</h3>";

              html_to_insert += "<p style='color:black;font-size:11px;'>" + "Value: " + counts[country_name]["count"] + "</p><p style='font-weight:bold;font-size:11px;'>" + "Text: " + counts[country_name]["query"] + "</p>";
              tooltipDiv.html(html_to_insert);
       }
  });
};

// Color countries
function colorCountry(country) {
    //if we have data, color = orange
    if (countries_list.includes(country.properties.name)) {
        return '#E4A62F';
    }
    //else paint it with grey
    else {return '#9A9DA2';}
}

// zoom and pan
var zoom = d3.behavior.zoom()
    .scaleExtent([1, 5])
    .on("zoom",function() {
        g.attr("transform","translate("+
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("circle")
            .attr("d", path.projection(projection));
        g.selectAll("path")
            .attr("d", path.projection(projection));
  });

svg.call(zoom)

//Stops dragging
/*
.on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("touchend.zoom", null);*/

function resize() {
    // adjust things when the window size changes
    width = parseInt(d3.select('.europechart').style('width'));
    width = width - margin.left - margin.right;
    height = width * mapRatio;

    // update projection
    projection
        .scale(width/2.50)
        .translate([width/5,height*1.4]);

    // resize the map container
    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // resize the map
    svg.selectAll('.country').attr('d', path);
}

d3.select(window).on('resize', resize);
