# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a personal academic website for Jon Askonas, built with [Jekyll](https://jekyllrb.com/) using the Skinny Bones theme. It is hosted via GitHub Pages at jaskonas.github.io.

## Commands

```bash
# Serve locally with live reload
bundle exec jekyll serve

# Build the site
bundle exec jekyll build

# Compile and minify JS (watches for changes)
grunt scripts

# Optimize images
grunt images
```

## Architecture

This is a standard Jekyll static site. Key conventions:

- **Pages** are Markdown files at the root (`index.md`, `research.md`, `teaching.md`, `data.md`, `studentdashboard.md`). Each uses a `layout` in front matter.
- **Posts/Projects** live in `_posts/research/` and use the `article` layout. They appear as tiles on the homepage via `{% for post in site.posts %}`.
- **Layouts** (`_layouts/`) compose via inheritance: `article.html` and `home.html` extend `default.html`. The `default.html` layout wires in header, sliding navigation, and footer includes.
- **Navigation** is data-driven: `_data/navigation.yml` controls the top nav links. Footer links are in `_data/footer.yml`.
- **Sass** source is in `_sass/`, compiled to `css/main.css`. Style is `compressed` per `_config.yml`.
- **JS** source files are in `js/_*.js` and `js/plugins/`. Grunt uglifies them into `js/main.js`, which is then prepended with Jekyll front matter (`---\n---`) via `grunt-surround` so Jekyll passes it through without modification.
- **Images** go in `images/`. Feature images for pages/posts are referenced by filename in front matter (`image.feature`).

## Front Matter Reference

For posts in `_posts/research/`:
```yaml
---
layout: article
title: "Post Title"
category: research
image:
  feature: filename.jpg   # optional hero image from images/
excerpt: "Short description"
---
```

For root pages:
```yaml
---
layout: home   # or: article, archive, media
permalink: /slug
title: "Page Title"
---
```
