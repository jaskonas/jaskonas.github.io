---
layout: page
permalink: /publications/
title: Publications
kicker: // peer-reviewed articles & chapters
lead: "Academic articles and book chapters."
excerpt: "Peer-reviewed articles and chapters by Jon Askonas."
---

## Book Projects

See [Book Projects](/books/) for *A Muse of Fire* and *The Shot in the Dark*.

## Articles & Chapters

<ul class="arrow-list arrow-list--dated">
{% for item in site.data.publications %}
  <li>
    {% if item.url %}<a href="{{ item.url }}" target="_blank" rel="noopener">{% else %}<a aria-disabled="true">{% endif %}
      <span class="caret" aria-hidden="true">❯</span>
      <span class="al-year">{{ item.year }}</span>
      <span class="al-body">
        <span class="al-main"><span class="entry-title">{{ item.title }}</span></span>
        <span class="al-meta">{{ item.venue }}{% if item.coauthor %} · {{ item.coauthor }}{% endif %}</span>
      </span>
    </a>
  </li>
{% endfor %}
</ul>
