---

title:  "Instant Search Comparison"
date: 2017-11-15T16:36:32.895Z
image:
      /cms_media/cover-21.png
tags: [Viz,Search,Instant Search, Search Engine,search result,Data visualisation,Data visualization,infographics, Interflora]
categories:
  - Data Visualizations
typology: Lines

author: clemensa@empathy.co

---

<iyd-iframe src="https://www.imagineyourdata.com/datavis/instantsearch-comparison-public/" desktop-height="635px" tablet-height="" mobile-height="" framebimg-order="1"></iyd-iframe>


### The Question
At <a href="https://empathy.co" target="_blank">Empathy</a>, we wanted to understand better how users engage with the instant search feature differently compared to a "normal" search experience. __Instant Search__ is a feature where search results are populated as the user types without having to specifically "submit" a search query.



>Instant-Motion for eCommerce Search results (Interflora.es) powered by EmpathyLayer Universal Search UI


For the two different user experiences, we wanted to compare search behaviour in different languages across desktop and mobile devices. We also wanted to see how some of our quality metrics CTR (Click Through Rate) and findability (Click Through Rate specifically on the first page of __search results__) would be affected.

### The Approach
To get an overview of how search queries are structured in all these different segments, we calculated the distribution of lengths and amount of words used in search queries over their relative count, __CTR and findability__ by language and devices. We did this for across different clients in the same industry who have the instant search enabled and others who does not use the __instant search feature__.

### The Visualisation
To present this data, we sketched out several approaches to show the differences.


![Sketch Image"]( /cms_media/sketch_image.jpg )

Since there are many different metrics and dimensions, (5 languages, 2 device types, 3 metrics and 2 distributions, making a total of 60 different combinations), it became clear very early that presenting all the data at once would be quite overwhelming. Therefore we chose to create an interactive and more exploratory piece where we can select different metrics and languages and compare different combinations against each other.

### Findings
When comparing the distribution of the percent of total queries over the lengths of search queries in instant and non-instant searches, there does not appear to be a significant difference in how users phrase their searches in any languages or any particular device. In fact, queries using __instant search__ seem to be (surprisingly) slightly longer. Particularly in searches in English, non-instant searches have a higher amount of searches with 4 or less characters than searches where instant search is enabled. Across all devices and languages, the most common queries have one word and are between 4-8 characters long.
Investigating how findability and CTR distribute over query length, we can see that in most cases for instant and non-instant searches, the percent of clicks on products per search increases with the query length. An exception are __instant searches on mobile__ , where CTR surprisingly decreases as the search queries get longer. On Desktop devices, searches with instant search enabled seem to perform better in regards to CTR and findability, particularly for shorter search queries. On Mobile devices, a normal search experience appears to perform better than the instant search experience.

### Conclusions
Mapping our success metrics such as __CTR and findability__ over query lengths gives an idea on what successful queries look like. Additionally comparing device types and/or languages gives an idea on how  users search differently on each device and language and what behaviour is most likely to result in a successful search. Finally, when comparing these distributions across different features, we can quantify the impact of these features and how the change user's search behaviour:

- instant search over-performs on desktop and under-performs on mobile devices, particularly for shorter search queries and languages where adjectives go before nouns (such as English or German)
- instant search has little effect on the lengths of search queries (most queries have one word and are between 4-8 characters long)
- on desktop devices, instant and normal search both show a positive linear relationship between search query length and CTR/findability
