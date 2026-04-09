---
layout: archive
permalink: /research/
title: "Research"
---

<pre class="ascii-art">  ─────── * ───────</pre>

<div class="tiles">
{% for post in site.categories.research %}
{% include post-grid.html %}
{% endfor %}
</div><!-- /.tiles -->
