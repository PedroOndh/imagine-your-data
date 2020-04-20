---

title:  "Comparing three Variables on a 3D Scatter Plot"
date: 2017-11-29T16:36:32.895Z
image: /cms_media/cover-23.png
categories:
  - Data Visualizations
author: clemensa@empathy.co

description:
keywords:
---
<div class="col-sm-12" align="center">
	<iframe src="https://www.imagineyourdata.com/datavis/scatter-3D/" framebimg-order="1" width="100%" height="765px"></iframe>
</div>

In this visualisation, we are comparing three variables across our dataset of searched keywords on a fashion retailing website during autumn:

For each keyword in the recorded search queries, we are comparing
- Total count of queries that returned no results
- Zero-result-rate (ratio of queries that returned no results out of all queries)
- click-through-rate (click-through-rate of results from queries with the keyword)

In addition, the size of each circle represents the length of the keyword and its colour the language of the search.

To make the 3-dimensional layer of the chart easier to navigate, we added buttons to move the viewing perspective to each pair of variable combinations. The chart flattens and we can see the variable-pair combination on a 2-dimensional scatter plot. It is also possible to make the chart less busy by focusing only on keywords with a zero-result-rate of 75% or more.

### Findings

When investigating the chart from different angles we can see the following:
- it looks like there are slightly more English keywords in the higher zero-result region than Spanish keywords.
- it looks as if Spanish keywords have a higher click-through-rate
- there does not seem to be a relation between the length of a keyword and its zero-result rate
- expectedly, there are no queries with high click-through-rate and high zero-result rate
- there seems to be no linear relationship between click-through-rate and zero result rate
- a strong outliner is the keyword "with", with a very high query count and zero-result-rate. Not as outlying, but still notable is the Spanish equivalent keyword "con". It appears that users often try and combine keywords using "with" or "con" and receive no results when trying to do so.

### Further Investigations

These observations could inspire to for further investigate
- whether there is an actual difference in zero-result-rate and/or click-through-rate between English and Spanish keywords, by determining the significance of the difference between the mean value for English and Spanish keyword results
- the exact search queries containing the keyword "with" / "con" to understand how users use this keyword

### About the Chart

Using 3D in charts has been frowned upon in the data visualisation community for quite some time. Particularly the infamous 3d pie chart or any other chart where the third dimension is added for mere eye-candy is usually regarded a bad way to display data, especially because

 - the viewing perspective onto the three dimensional shapes can distort their relative sizes and hence the value they represent, making them difficult to compare
 - the 3D effect does not convey any additional information and therefore adds unnecessary <a href="https://en.wikipedia.org/wiki/Chartjunk" target="_blank">chartjunk</a>
 

There are however, certain 3D chart types where the third dimension conveys an additional layer of information. One example are 3-dimensional scatter plots.

A traditional scatter plot displays the relationship between two variables across a data set. A nice and playful example is <a href="https://vega.github.io/editor/#/" target="_blank">this basic scatter plot</a> created with  <a href="https://vega.github.io/vega/" target="_blank">VegaJs</a>, showing the relationship between IMDB and Rotten Tomatoes ratings across many films.

To display the relationship between three different variables, we can add a third axis (z-axis) to our scatter plot, creating a 3-dimensional chart, just like in the visualisation of this post above.

Finally, if three dimensions for still aren't enough and we'd want to add even more variable into the mix, there are ways for scatter plots to contain even more than three dimensions! Using <a href="https://en.wikipedia.org/wiki/Scatter_plot#Scatterplot_matrices" target="_blank">scatterplot matrices</a>, it is possible to compare the relationships of lots of different variables!

