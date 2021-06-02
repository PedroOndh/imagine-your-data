var colors = ['#E4A62F','#67A5B0','#81848B','#BD0B49','#B6C630','#414649'];
var linkindex = 0;

var margin = {top: 20, right: 120, bottom: 20, left: 220},
    width = 1020 - margin.right - margin.left,
    height = 865 - margin.top - margin.bottom;

var scalesize = d3.scale.linear().domain([0,1]).range([4,200]);
var scalesizecircles = d3.scale.linear().domain([0,1]).range([4,200]);

var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var container = d3.select('.tree');

var svg = container.append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

console.log();

d3.json('data/tree.json', function(data) { 
  console.log(data);

  root = data;
  root.x0 = height / 2;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  root.children.forEach(collapse);
  update(root);


d3.select(self.frameElement).style('height', '865px');

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  console.log(links);

  var scalecolors = d3.scale.ordinal().domain(Array.from(new Set(links.map(function(d){return d.target.size;})))).range(colors);
  //var scalesize = d3.scale.linear().domain(Array.from(new Set(links.map(function(d){return d.target.size;})))).range([4,12]);
  //var scalesizecircles = d3.scale.linear().domain(Array.from(new Set(links.map(function(d){return d.target.size;})))).range([2,6]);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', function(d) { return 'translate(' + source.y0 + ',' + source.x0 + ')'; })
      .style('cursor','pointer');

  nodeEnter.append('circle')
      .attr('r', 1e-6)
      .style('fill','#fff')
      .style('stroke','steelblue')
      .style('stroke-width', '1.5')
      //.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
      .style('fill',function(d,i) {return d.color}).on('click', click)
            .on('mouseover', toggle)
            .on('mouseout', function(d) {

        
        tooltipDiv.transition()
          .duration(100)
          .style('opacity', 0);
          svg.selectAll('path.link').classed('opacityclass',false);
          svg.selectAll('path.link').classed('lessopacityclass',true);
          d3.select(this).style('stroke',function(d) { return d.children ? 'steelblue' : '#999'; })
      });

  nodeEnter.append('text')
      .attr('x', function(d) {
        console.log(d.name);
        if (!(d.parent)) {
          return 15}

        else {return d.children || d._children ? -20 : 15;}
        //console.log(d.parent || d._parent ? "y" : "n");
        //return d.children || d._children ? -20 : 15;
      })
      .attr('dy', '.35em')
      .style('font', '11px sans-serif')
      .attr('text-anchor', function(d) { return d.children || d._children ? 'end' : 'start'; })
      .text(function(d) { return d.name; })
      .style('fill-opacity', 1e-6)
      .on('click', function(d) {
        if (!(d.parent)) 
        {
          click(d);
        }
      })
      .on('mouseover', toggle)
      .on('mouseout', function(d) {
        tooltipDiv.transition()
          .duration(100)
          .style('opacity', 0);
          svg.selectAll("path.link").classed("opacityclass",false);
          svg.selectAll("path.link").classed("lessopacityclass",true);
      });

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });

  nodeUpdate.select('circle')
      .attr('r',  function(d) {
           if (d.size) {
               var r = scalesizecircles(d.size) / 2.0; 
               if (r < 2)
               {r=1}
           }
           else {var r= 5;}
           return r; })
      .style('fill',function(d) {return d.color});


  nodeUpdate.select('text')
      .style('fill-opacity', 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr('transform', function(d) { return 'translate(' + source.y + ',' + source.x + ')'; })
      .remove();

  nodeExit.select('circle')
      .attr('r', 1e-6);

  nodeExit.select('text')
      .style('fill-opacity', 1e-6);

  // Update the links…
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
      .attr('id', function(d,i){
        ++linkindex;
        d.id = linkindex;
        d.class = 'link-'+linkindex;
        return 'link-'+d.target.id;
      })
      .style('fill','none')
      .style('stroke',function(d) {
        console.log(d);
        console.log(d.target.size);
        return d.target.color;
      })
      .style('stroke-width', function(d) {return scalesize(d.target.size) + 'px';})
      .classed('lessopacityclass', true);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr('d', diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

  // Define the div for the tooltip
var tooltipDiv = container.append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('text-align', 'left')
    .style('width', '150px')
    .style('height', '60px')
    .style('padding', '10px')
    .style('font', '12px sans-serif')
    .style('background', 'white')
    .style('border', '1px')
    .style('border-style', 'solid')
    .style('border-color', 'black')
    .style('border-radius', '3px')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('top', 0)
    .style('left', 0);

// Toggle children on click.
function click(d,i) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }

  update(d);
}

function toggle(d,i) {

    if (d.freq) {
          
        tooltipDiv.transition()
            .duration(100)
            .style('opacity', 0.9);
        var html = '<h4 style=\'margin: 0; border-bottom: 1px solid black; padding: 5px; padding-left: 5px;\'>' + d.oname + '</h4>';
        if (d.size) {
            html += '<p> Frequency : ' + d.freq + '</p>';
        }

        tooltipDiv.html(html)
         //.style('left', (d3.event.pageX) + 'px')
         //.style('top', (d3.event.pageY - 28) + 'px');
         .style('left', (d3.event.pageX + 100) + 'px')
         .style('top', (d3.event.pageY) + 'px');
         }
         if (d3.select(this)[0][0].nodeName == "circle") 
          {d3.select(this).style('stroke',function(d) { return d.children ? "#ADFF3A" : "#999"; })}

    // Walk parent chain
   var ancestors = [];
   var parent = d;
   while (!_.isUndefined(parent)) {
       ancestors.push(parent);
       parent = parent.parent;
   }

   // Get the matched links
   if (d.find) {
   var matchedLinks = [];
   svg.selectAll('path.link')
       .filter(function(d, i)
       {
           return _.any(ancestors, function(p)
           {
               return p === d.target;
           });
       })
       .each(function(d)
       {
           matchedLinks.push(d.target.id);
       });

   animateParentChain(matchedLinks);
   }
}
})

function animateParentChain(links)
 {
     var linkRenderer = d3.svg.diagonal()
         .projection(function(d)
         {
            return [d.y, d.x];
         });
 
     // Links
     svg.selectAll('path.selected')
              .data([])
         .exit().remove();
 
     svg
         .selectAll('path.selected')
         .data(links)
         .enter().append('svg:path')
         .attr('class', 'selected');
     console.log('---------');
     console.log(links);

     links.forEach(function(d) {
      d3.select('#link-'+d).classed('lessopacityclass',false);
      d3.select('#link-'+d).classed('opacityclass',true);
     })

}
