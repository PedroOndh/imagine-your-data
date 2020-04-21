---
title: Search Term Complexity
date: 2017-10-30T16:36:32.895Z
author: clemensa@empathy.co
image: /cms_media/cover-20.png
categories:
  - User Journeys
---
<div class="col-sm-12" align="center">
	<iframe src="https://www.imagineyourdata.com/datavis/keyword-distribution/" framebimg-order="1" width="100%" height="765px"></iframe>
</div>


To get a better understanding of how complex searches by users are, we had a closer look at how many search terms users on a fashion website use in their search queries.

We started looking at the mean amount of search terms in each query that users make. Comparing the averages the 4 most queried languages on the website (Spanish, English, German and French), we saw that 

* French-speaking users are generally using more keywords in their search queries than users who speak any of the other languages
* Search queries in German appear to have fewer words.

To investigate whether there are certain times during the day where the amount of words in search queries might vary, we grouped the data by the hour of the day the query was made. Plotting this data on a line chart, it became clear that 

* there aren't any significant trends visible, though the mean search term amount seems to slightly increase as the day progresses
* particularly in French queries, the mean search term amount per query increases in the afternoon from 3pm onwards

To get a deeper understanding beyond only mean value of search term used in a search field, we further investigated the distribution of search term amounts used for each hour of the day. When comparing histograms of search term amounts for each hour and each language, we can see that 

* in English, Spanish and French search queries, using two words in a search is the most prominent at all time during the day
* in German search queries, single word searches are most prominent during all times of the day

This deeper understanding of how users of different languages use search can help us and our customers improve and personalise the experience of the search bar and its suggestive features.

Other ways of plotting this information could be by

* using a <a href="https://en.wikipedia.org/wiki/Box_plot" target="_blank">box plot</a> chart for each language
* making a grid of <a href="https://en.wikipedia.org/wiki/Small_multiple" target="_blank">small multiples</a> of each histogram of search term amount distribution by each language and hour of the day 
* plotting the all queries lengths for each language and hour as dots on a <a href="https://en.wikipedia.org/wiki/Scatter_plot" target="_blank">scatter plot</a>
