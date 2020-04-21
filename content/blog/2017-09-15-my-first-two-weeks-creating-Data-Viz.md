---

title:  "My First Data Visualization with StatsAPI"
date: 2017-09-15T16:36:32.895Z
image:
      /cms_media/cover-9.png
categories:
  - Data Visualizations

author: davidm@empathy.co

---

<iframe src="/local-data-vis/2017-09-15-my-first-two-weeks-creating-Data-Viz/bars.html" framebimg-order="1" width="100%" height="620px"    max-height="720px" ></iframe>

This is my first post, where to start? after working roughly 2 weeks with the __STATS API__ I would like to share my experience.

As the way I see it, __Empathy’s StatsAPI__ is aimed to process the data available in Empathy Search & Navigation eCommerce customers (queries, clicks, add2carts and all aspects of the search & navigation journey) and give insights, and shorten the distance between raw data and usable information.

Data, information and insights are not synonyms. Many companies struggle to make sense of their data, and create added value from their data investments, offering big data services is more than just collecting data, and this is where such tool does shine.

On the technical side, **StatsAPI** is divided in 2 parts: Reports and Exports.

From Reports by setting a list of filters and a timeframe we can get key metrics, such as Term Success that allows to calculate the “success” for queries, Top Queries that displays a list of most relevant queries , Opportunities to see how most relevant queries perform through time, or Distribution that allows to get global metrics (click count, findability, etc) for a specific timeframe (Hourly or Daily).

<iframe src="/local-data-vis/2017-09-15-my-first-two-weeks-creating-Data-Viz/bubbles.html" framebimg-order="1" width="100%" height="620px"    max-height="720px" ></iframe>

From Exports we can generate csv files directly based on the reports provided by the service.

Said that, albeit heavily documented, there is space to extend these resources with examples on how to call each method, or documentation showing clearly what represents each uri parameter, or each field on the json response, this would give more independence to the creation of __Reports and Visualizations__ on first arrival. In any case, the **STATS API** resources are growing as we speak with the help of these interactions with **Jose Santorum** (product owner) and **Noelia Vigil** (experienced colleague on STATS API development).

I have tried at some point to get the locations from the API, which is not available yet, after discussing it with the team, we decided to use the stores codes for each language as a proxy to the location with which I intend to compose some value geo-relations that although lack of the precision of true locations, serves as a work around to expand my experience and our understanding of what can be done and what needs to be done.
