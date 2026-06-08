---
layout: page
permalink: /writing/
title: Writing
kicker: // essays & op-eds
lead: "Selected essays and op-eds on technology, war, and the American future."
excerpt: "Selected essays and op-eds by Jon Askonas."
---

<ul class="arrow-list arrow-list--dated">
{% for item in site.data.writing %}
  <li>
    <a href="{{ item.url }}" target="_blank" rel="noopener">
      <span class="caret" aria-hidden="true">❯</span>
      <span class="al-year">{{ item.year }}</span>
      <span class="al-body">
        <span class="al-main"><span class="entry-title">{{ item.title }}</span></span>
        <span class="al-meta">{{ item.outlet }}{% if item.coauthor %} · {{ item.coauthor }}{% endif %}{% if item.note %} · {{ item.note }}{% endif %}</span>
      </span>
    </a>
  </li>
{% endfor %}
</ul>
