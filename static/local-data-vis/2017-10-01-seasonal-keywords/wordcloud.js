var json_path = '/local-data-vis/2017-10-01-seasonal-keywords'

d3.json(json_path + '/data/pullbear_en.json', function(jsondata) {
    var texter;
    var tevent;
    var int = 1;
    var dict = {};
    dict['int'] = int;
    var rotation = {};
    var timeoutAnimation = 3000;
    var toggleSelected = true;

    var colors = ['#E4A62F','#67A5B0','#81848B','#BD0B49','#B6C630','#414649'];

    function scales(arr,minval,maxval) {
        var max = d3.max(arr);
        var min = d3.min(arr);
        return d3.scale.linear().domain([min, max]).range([minval, maxval]);
    }
    function opacityscale(arr,minval,maxval) {
        var max = d3.max(arr);
        var min = d3.min(arr);
        return s3.scale.linear().domain([min, max]).range([minval, maxval])
    }

    function colorscale(arr) {
        return d3.scale.ordinal().domain(Array.from(new Set(arr.map(function(d){return d;})))).range(colors);
    }

    //renders playing and pause button
    function rendering() {
        if (toggleSelected) return '\uf04c';
        else return '\uf152';
    }

    function wordCloud(selector) {

        var container = d3.select(selector).append('svg')
            .attr('width', '100%')
            .attr('height', 550);

        var texter = container.append('text')
            .attr('class','texter')
            .attr('x',100)
            .attr('y',70)
            .attr('font-family','\'Ubuntu\',\'Open Sans\',sans-serif')
            .style('fill','darkOrange')
            .style('font-size','40px');
        var player = container.append('text')
            .attr('class','player')
            .attr('x',400)
            .attr('y',70)
            .attr('font-family', 'FontAwesome')
            .attr('font-size', '40px' )
            .style('cursor','pointer')
            .text(rendering());

        player.on('click', function() {
            if (toggleSelected == true) {
                toggleSelected = false;
                timeoutAnimation = 90000;
                player.text(rendering());
                clearTimeout(tevent)
            }
            else
            {
                toggleSelected = true;
                timeoutAnimation = 3000;
                player.text(rendering());
                clearTimeout(tevent);
                d3.select(selector).html('');
                iterateWords(wordCloud(selector), dict['int']);
            }
        });

    var svg = container.append('g')
        .attr('transform', 'translate(450,350)')
        .style('border','1px solid black');


    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll('g text')
                        .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append('text')
            .style('font-family', '\'Ubuntu\'')
            .style('fill', function(d) { return d.color; })
            .attr('text-anchor', 'middle')
            .attr('font-size', 1)
            .transition()
            .duration(2000)
            .attr('transform',function(d) {
                var far = 1500 * (Math.random() > 0.5 ? +1 : -1);
                if(d.rotate === 0)
                    return 'translate('+far+',0)rotate('+d.rotate+')';
                else
                    return 'translate(0,'+far+')rotate('+d.rotate+')';
            })
            .text(function(d) { return d.text; });

        cloud.on('click',function(d) {console.log(d.text);})

        cloud
            .transition()
                .duration(600)
                .style('font-size', function(d) { return d.size + 'px'; })
                .attr('transform', function(d) {
                    return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
                })
                .style('opacity',function(d) {return d.opacity; });

        //Remove words
        cloud.exit()
            .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    }

    return {

        update: function(words) {
            d3.layout.cloud().size([1100, 700])
                .words(words)
                .padding(5)
                .rotate(function(d) { return d.rotation })
                .font('\'Ubuntu\'')
                .spiral('archimedean')
                .fontSize(function(d) { return d.size; })
                .on('end', draw)
                .start();
            }
        }

    }

    function objectContainsKey(object,key) {
        return object ? hasOwnProperty.call(object,key) : false;
    }

    function getSeasonSign(key) {
    var symbol,seasoncolor;
	switch (key) {
	    case 'Winter':
		symbol = '\uf2dc';
                seasoncolor = 'blue';
        	break;
	    case 'Summer':
		symbol = '\uf185';
		seasoncolor = 'red';
                break;
	    case 'Autumn':
		symbol = '\uf0e9';
		seasoncolor = 'brown';
                break;
	    case 'Spring':
		symbol = '\uf18c';
                seasoncolor = 'green';
                break;
	}
        return [symbol,seasoncolor];
    }

    function fetchWords(value) {
        var data = jsondata[value];
        var key = Object.keys(data)[0];
        var seasondata = getSeasonSign(key);
        var symbol = seasondata[0];
        var seasoncolor = seasondata[1];
        d3.select('.texter').attr('font-family', 'FontAwesome').style('fill',seasoncolor)
            .text(symbol + ' ' + key);
        var queries_counts = data[key].map(function(d){ return d.weight; });
        var scaled = scales(queries_counts,15,95);
        var opacity = scales(queries_counts,0.5,1)
        var colorscaled = colorscale(queries_counts);
        return data[key]
                .map(function(d) {
                    if (!(objectContainsKey(rotation,d.item)))
                        {
                            rotation[d.item] = 0;
                        }
                    return {text: d.item, size: scaled(d.weight), opacity: opacity(d.weight), rotation: rotation[d.item], color:colorscaled(d.weight)};
                })
    }


    function iterateWords(vis, int) {
        dict['int'] = int || 1;

        dict['int'] = dict['int'] + 1;
        vis.update(fetchWords(dict['int'] % jsondata.length))
        tevent = setTimeout(function() { iterateWords(vis, dict['int'])}, timeoutAnimation);
    }

    //Create a new instance of the word cloud visualisation.
    var myWordCloud = wordCloud('.wordcloud');

    iterateWords(myWordCloud);
});

