---
layout: page
permalink: /speaking/
title: Speaking
kicker: // talks & convenings
lead: "Selected talks, plus conferences and seminars I have organized."
excerpt: "Talks and conferences by Jon Askonas."
---

## Conferences & Seminars Organized

<ul class="arrow-list">
{% for item in site.data.speaking.conferences %}
  <li>
    <a aria-disabled="true">
      <span class="caret" aria-hidden="true">❯</span>
      <span class="al-main"><span class="entry-title">{{ item.title }}</span> — {{ item.role }}</span>
      <span class="al-meta">{{ item.detail }} · {{ item.year }}</span>
    </a>
  </li>
{% endfor %}
</ul>

## Selected Talks

<ul class="arrow-list">
{% for item in site.data.speaking.talks %}
  <li>
    <a aria-disabled="true">
      <span class="caret" aria-hidden="true">❯</span>
      <span class="al-main"><span class="entry-title">{{ item.title }}</span></span>
      <span class="al-meta">{{ item.venue }} · {{ item.year }}</span>
    </a>
  </li>
{% endfor %}
</ul>
