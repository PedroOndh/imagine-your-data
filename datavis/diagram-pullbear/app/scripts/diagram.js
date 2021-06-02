var diagram_width = 1200;//d3.select("diagram").style("width");

var svg = d3.select(".diagram").attr({
      "width": '100%'
  });

var h = 700,
    r1 = h / 2,
    r0 = r1 - 80;

var colors = ['#E4A62F','#67A5B0','#81848B','#BD0B49','#B6C630','#414649'];

var chord = d3.layout.chord()
    .padding(.04)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

var arc = d3.svg.arc()
    .innerRadius(r0)
    .outerRadius(r0 + 20);

var containerWidth = svg.node().getBoundingClientRect().width;

var svg = svg.append("svg:svg")
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + containerWidth / 2 + "," + h / 2 + ")").style("text-anchor","start");

d3.json("data/relevant_queries_ordered.json", function(data) {
  var indexByName = {},
      nameByIndex = {},
      matrix = [],
      n = 0;

  self.names = []

  var total_values = [];
  data.forEach(function(d) {
    d.imports.forEach(function(d) {
      total_values.push(d.size);
    })
  })

  var minval = d3.min(total_values);
  var maxval = d3.max(total_values);

  var scaleopacity = d3.scale.linear().domain([minval,maxval]).range([0.35,1]);
  var scalecolors_paths = d3.scale.ordinal().domain(Array.from(new Set(total_values.map(function(d){return d;})))).range(colors);
  var length = total_values.length;
  var scalecolors_circle = d3.scale.linear().domain([1,length])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb(colors[0]), d3.rgb(colors[1])]);

  // Compute a unique index for each package name.
  data.forEach(function(d) {
    d = d.name;
    if (!(d in indexByName)) {
      nameByIndex[n] = d;
      indexByName[d] = n++;
      names.push(d);
    }
  });

  // Construct a square matrix counting package imports.
  data.forEach(function(d) {
    var source = indexByName[d.name],
        row = matrix[source];
    if (!row) {
     row = matrix[source] = [];
     for (var i = -1; ++i < n;) row[i] = 0;
    }
    d.imports.forEach(function(d) {
      console.log("IMPORTS: "); 
      console.log(d.name);
      console.log(d.size);
      row[indexByName[d.name]] = d.size; 
    });
  });

 chord.matrix(matrix);

  var g = svg.selectAll("g.group")
      .data(chord.groups)
    .enter().append("svg:g")
      .attr("class", "group")
      .on("mouseover", fade(false))
      .on("mouseout", fade(true));
      //.on("mouseover", function(d) {return d3.select(this).transition().duration(1000).style("opacity",0.2)})
      //.on("mouseout", function(d) {return d3.select(this).transition().duration(1000).style("opacity",0.7)});

  g.attr("class",function(d) {return "semicircle" + d.index;});
  g.append("svg:path")
      .style("stroke", function(d) {return scalecolors_paths(d.index)})
      .style("fill", function(d) {return scalecolors_paths(d.index)})
      .attr("d", arc);

  g.append("svg:text")
      .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
      .attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + (r0 + 28) + ")"
            + (d.angle > Math.PI ? "rotate(180)" : "");
      })
      .text(function(d) { return nameByIndex[d.index]; });

  svg.selectAll("path.chord")
      .data(chord.chords)
    .enter().append("svg:path")
      .attr("class", "chord")
      .style("stroke", function(d) { return d3.rgb(scalecolors_paths(d.source.index)).darker(); })
      .style("fill", function(d) { return scalecolors_paths(d.source.index)})
      .style("opacity", function(d) {
        console.log(d); 
        return scaleopacity(d.source.index); 
      })
      .attr("d", d3.svg.chord().radius(r0));
});

function fade(opacity) {
  return function(d, i) {
    var indexes = [];
    var nonindexes = [];
    svg.selectAll("path.chord")
        .transition().duration(600)
        .filter(function(d) { 
          if (d.source.index == i || d.target.index == i) {
            if (indexes.indexOf(d.source.subindex) == -1) {
              indexes.push(d.source.subindex);
            }
            if (indexes.indexOf(d.target.subindex) == -1) {
              indexes.push(d.target.subindex);
            }
          }

          if (nonindexes.indexOf(d.source.subindex) == -1) {
            nonindexes.push(d.source.subindex);
          }
          if (nonindexes.indexOf(d.target.subindex) == -1) {
            nonindexes.push(d.target.subindex);
          }
          return d.source.index != i && d.target.index != i; 
        })
        .style("stroke-opacity", function(d) {
          if (opacity) {
            return d3.select(this).attr("opacity");
          }
          else {
            return 0.05;
          }
        })
        .style("fill-opacity", function(d){
          if (opacity) {
            return d3.select(this).attr("opacity");
          }
          else {
            return 0.05;
          }
        });
        console.log(indexes);
        nonindexes.forEach(function(d){
          if (!(indexes.includes(d))) {
            if (opacity) {
              d3.select(".semicircle" + d).style("opacity",1);
            }
            else {
              d3.select(".semicircle" + d).style("opacity",0.2);
            }
          }
        })

  };
};
