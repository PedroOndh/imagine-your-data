
//var diameter = parseInt(d3.select('.graph').style('width'))*0.5; //max size of the bubbles
var diameter = 500;
var color    = d3.scale.category20b(); //color category

console.log(diameter);

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var container = d3.select(".bubbleschart")
    .append("svg")
    .attr("viewBox","0 0 650 650")
    .attr("perserveAspectRatio","xMinYMid")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(20,20)");

var svg = container.append("g").attr("class", "bubble");

d3.csv("/local-data-vis/2017-09-15-my-first-two-weeks-creating-Data-Viz/queries_by_country.csv", function(error, data){
    console.log(data);
    //convert numerical values from strings to numbers
    data = data.map(function(d){ d.value = +d["counts"]; return d; });

    //bubbles needs very specific format, convert data to this.
    var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

    //setup the chart
    var bubbles = svg.append("g")
        .selectAll(".bubble")
        .data(nodes)
        .enter();

    //create the bubbles and access the tooltip
    bubbles.append("circle")
        .attr("r", function(d){ return d.r; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .attr("opacity",0.9)
        .style("fill", function(d) { return color(d.value); })
        .on("mouseover", function(d)
        {
            tooltip.style("display", "block");
        })
        .on("mouseout", function(d)
        {
            tooltip.style("display", "none");
        })
        .on("mousemove", function(d) {
    var xPosition = d3.mouse(this)[0] - 15;
    var yPosition = d3.mouse(this)[1] - 55;
    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    text_string = "<tspan x='60' dy='1.4em'>" + "Text: " + d.queries + "</tspan><tspan x='60' dy='1.4em'>" + "Value: " + d.counts + "</tspan>";
    tooltip.select("text").html(text_string);
});

})

//create tooltip
var tooltip = container.append("g")
  .attr("class","bubbleschart-tooltip")
  .style("display","none");

tooltip.append("rect")
  .attr("width", 130)
  .attr("height", 50)
  .attr("fill", "grey")
  .style("opacity", 0.8);


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

function resize () {
    console.log("Resizing... ");

    //diameter = parseInt(d3.select('.graph').style('width'))*0.5
    console.log("Diameter: " + diameter);
    //bubble.size([diameter, diameter])
    //.padding(1.5);

    var newDiameter = parseInt(d3.select('.bubbleschart').style('width'));

    //resize diameter on svg
    svg
    .attr("width", newDiameter)
    .attr("height", newDiameter)
}

d3.select(window).on('resize', resize);
