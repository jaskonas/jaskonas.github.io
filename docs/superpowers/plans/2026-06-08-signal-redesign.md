# jaskonas.com "Signal" Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild jaskonas.com as a dark, spare "writer-and-thinker" site for a policy audience, with a single amber accent, serif/sans/mono typography, and keyboard-selectable (❯) navigation on every list.

**Architecture:** Jekyll static site (GitHub Pages). Retire the Skinny Bones "Letterpress" theme entirely and replace `css/main.scss` with a small set of focused Signal partials. Lists (homepage menu, Writing, Publications, Speaking) are driven by `_data/*.yml` and rendered as `<ul class="arrow-list">`; one vanilla-JS file (`js/arrownav.js`) adds the keyboard/marker layer as progressive enhancement over real `<a>` links. No framework, no build step beyond Jekyll's Sass.

**Tech Stack:** Jekyll 3.9 (via `github-pages` gem), kramdown, Sass (compressed), vanilla ES5 JS. Local toolchain: **Homebrew `ruby@3.3`**.

---

## Prerequisites (every shell session)

All build/serve commands assume this PATH is exported first (system Ruby 2.6 and brew `ruby` 4.0 cannot build this site — see `memory/local_jekyll_toolchain.md`):

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
cd /Users/jaskonas/Dropbox/Resumes/jaskonas.github.io
```

Baseline check (should already pass; `Gemfile.lock` is committed):

```bash
bundle exec jekyll build && echo OK
```

**Conventions used by every task:**
- "Build" means `bundle exec jekyll build` from the repo root; success = exits 0 and prints `done in … seconds`.
- "Assert" steps grep the generated `_site/` to confirm output. They are the static-site stand-in for unit tests.
- Manual browser checks use `bundle exec jekyll serve` at `http://localhost:4000`.
- Commit after each task with the message shown.

---

## File Structure

**New files:**
- `_sass/_signal-tokens.scss` — CSS custom properties (colors, fonts), Sass breakpoints
- `_sass/_signal-base.scss` — reset, body, typography, links, content container
- `_sass/_signal-header.scss` — masthead brand + top nav
- `_sass/_signal-home.scss` — homepage hero + menu
- `_sass/_signal-list.scss` — `.arrow-list` component + generic list/entry styles
- `_sass/_signal-pages.scss` — page header, Writing/Publications/Speaking/Books/About specifics
- `_sass/_signal-footer.scss` — footer
- `_layouts/page.html` — generic content page (extends default)
- `_data/menu.yml` — homepage menu (label, url, desc)
- `_data/writing.yml` — curated essays
- `_data/publications.yml` — peer-reviewed articles & chapters
- `_data/speaking.yml` — conferences organized + selected talks
- `js/arrownav.js` — keyboard/marker enhancement
- `writing.md`, `publications.md`, `speaking.md`, `seminar.md`, `books.md`, `about.md` — pages
- `images/book-muse-of-fire.svg`, `images/book-shot-in-the-dark.svg` — placeholder book headers

**Modified files:**
- `css/main.scss` — import only Signal partials
- `_layouts/default.html` — new `<head>` (fonts/meta), body wiring, arrownav.js
- `_layouts/home.html` — homepage hero + menu
- `_includes/header.html` — new top nav
- `_includes/footer.html` — simplified footer
- `_data/navigation.yml` — new IA
- `_config.yml` — description/meta + OG owner fix
- `index.md` — homepage content

**Deleted files:**
- `research.md`, `teaching.md`, `data.md`, `studentdashboard.md`
- `_includes/navigation-sliding.html` (sliding menu removed)

---

## Task 1: Dark theme foundation (tokens, base, wired stylesheet)

Get a dark, typographically-correct blank page building from new Sass partials.

**Files:**
- Create: `_sass/_signal-tokens.scss`, `_sass/_signal-base.scss`
- Modify: `css/main.scss`, `_layouts/default.html`

- [ ] **Step 1: Create `_sass/_signal-tokens.scss`**

```scss
// Signal theme design tokens
:root {
  --bg:    #0e1116;
  --panel: #11151b;
  --line:  #1e242d;
  --line2: #2a323d;
  --ink:   #e7e3da;
  --dim:   #9aa4b2;
  --mut:   #6b7480;
  --gold:  #f5b942;

  --serif: "Newsreader", Georgia, "Times New Roman", serif;
  --sans:  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --mono:  "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;

  --frame:   60rem;      // outer page frame (header, hero, menu, footer)
  --measure: 42rem;      // ~672px reading column for prose
  --pad:     2rem;
}

$bp-mobile: 640px;
```

- [ ] **Step 2: Create `_sass/_signal-base.scss`**

```scss
*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 18px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1, h2, h3, h4 { font-family: var(--serif); font-weight: 500; line-height: 1.12; color: #f4f1ea; }
h1 { font-size: 2.6rem; letter-spacing: -0.01em; margin: 0 0 1rem; }
h2 { font-size: 1.9rem; margin: 2.4rem 0 0.8rem; }
h3 { font-size: 1.4rem; margin: 1.8rem 0 0.5rem; }

p { margin: 0 0 1.1rem; }

a { color: var(--gold); text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 2px; }

em { font-style: italic; }
hr { border: 0; border-top: 1px solid var(--line); margin: 2.5rem 0; }

code, pre { font-family: var(--mono); }

// shared content frame (consistent left/right edges across header, content, footer)
.container { max-width: var(--frame); margin: 0 auto; padding: 0 var(--pad); }

// mono helpers
.kicker { font-family: var(--mono); font-size: 0.78rem; letter-spacing: 0.08em; color: var(--gold); text-transform: lowercase; }
.label  { font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.08em; color: var(--mut); text-transform: uppercase; }

@media (max-width: $bp-mobile) {
  body { font-size: 17px; }
  h1 { font-size: 2.1rem; }
  h2 { font-size: 1.6rem; }
  :root { --pad: 1.25rem; }
}
```

- [ ] **Step 3: Replace `css/main.scss` entirely**

```scss
---
sitemap: false
---

/* jaskonas.com — Signal theme */

@import "signal-tokens";
@import "signal-base";
@import "signal-header";
@import "signal-home";
@import "signal-list";
@import "signal-pages";
@import "signal-footer";
```

- [ ] **Step 4: Create placeholder partials so the import doesn't fail**

The remaining partials are filled in later tasks. Create each with a one-line comment so Sass can compile now:

```bash
for p in header home list pages footer; do echo "// signal-$p (filled in later task)" > _sass/_signal-$p.scss; done
```

- [ ] **Step 5: Update `<head>` fonts in `_layouts/default.html`**

Replace the Cormorant `<link>` (line ~27) with the Signal font set. Find:

```html
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet">
```

Replace with:

```html
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

- [ ] **Step 6: Build and assert the theme is wired**

Run:
```bash
bundle exec jekyll build && grep -q "Newsreader" _site/index.html && grep -q "var(--bg)" _site/css/main.css && echo PASS
```
Expected: `PASS` (font link present in output; CSS variable compiled into main.css).

- [ ] **Step 7: Commit**

```bash
git add _sass/_signal-*.scss css/main.scss _layouts/default.html
git commit -m "Signal theme: tokens, base typography, wired stylesheet"
```

---

## Task 2: Header & top navigation

**Files:**
- Modify: `_data/navigation.yml`, `_includes/header.html`, `_sass/_signal-header.scss`

- [ ] **Step 1: Rewrite `_data/navigation.yml` to the new IA**

```yaml
# Top navigation (Signal IA)
- title: Writing
  url: /writing/
- title: Books
  url: /books/
- title: Speaking
  url: /speaking/
- title: The Seminar
  url: /seminar/
- title: Publications
  url: /publications/
- title: About
  url: /about/
```

- [ ] **Step 2: Rewrite `_includes/header.html`**

```html
<header id="masthead">
  <div class="container masthead-inner">
    <a href="{{ site.url }}/" class="brand">JON ASKONAS</a>
    <nav class="top-nav" role="navigation" aria-label="Primary">
      {% for link in site.data.navigation %}<a href="{{ site.url }}{{ link.url }}">{{ link.title }}</a>{% endfor %}
    </nav>
  </div>
</header>
```

- [ ] **Step 3: Fill `_sass/_signal-header.scss`**

```scss
#masthead {
  border-bottom: 1px solid var(--line);
}
.masthead-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.15rem;
  padding-bottom: 1.15rem;
  gap: 1rem;
}
.brand {
  font-family: var(--mono);
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  color: var(--gold);
}
.brand:hover { text-decoration: none; }
.top-nav { display: flex; flex-wrap: wrap; gap: 1.25rem; }
.top-nav a {
  font-family: var(--mono);
  font-size: 0.8rem;
  letter-spacing: 0.02em;
  color: var(--dim);
  text-transform: lowercase;
}
.top-nav a:hover { color: var(--gold); text-decoration: none; }

@media (max-width: $bp-mobile) {
  .masthead-inner { flex-direction: column; align-items: flex-start; gap: 0.6rem; }
  .top-nav { gap: 0.9rem 1rem; }
}
```

- [ ] **Step 4: Remove the sliding-menu include from `_layouts/default.html`**

Delete this line from the body:
```html
    {% include navigation-sliding.html %}
```

- [ ] **Step 5: Build and assert**

Run:
```bash
bundle exec jekyll build && grep -q 'class="brand"' _site/index.html && grep -q '/writing/' _site/index.html && echo PASS
```
Expected: `PASS`.

- [ ] **Step 6: Commit**

```bash
git add _data/navigation.yml _includes/header.html _sass/_signal-header.scss _layouts/default.html
git commit -m "Signal theme: header and top navigation"
```

---

## Task 3: Footer

**Files:**
- Modify: `_includes/footer.html`, `_sass/_signal-footer.scss`

- [ ] **Step 1: Rewrite `_includes/footer.html`**

```html
<footer id="site-footer">
  <div class="container">
    <p class="foot-meta">
      <span>Washington, DC</span>
      <span aria-hidden="true">·</span>
      <a href="mailto:askonas@cua.edu">askonas@cua.edu</a>
    </p>
    <p class="copyright">© {{ site.time | date: '%Y' }} Jon Askonas</p>
  </div>
</footer>
```

- [ ] **Step 2: Fill `_sass/_signal-footer.scss`**

```scss
#site-footer {
  border-top: 1px solid var(--line);
  margin-top: 5rem;
  padding: 2.5rem 0 4rem;
}
.foot-meta {
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--dim);
  display: flex;
  gap: 0.6rem;
  margin: 0 0 0.4rem;
}
.copyright { font-family: var(--mono); font-size: 0.75rem; color: var(--mut); margin: 0; }
```

- [ ] **Step 3: Build and assert**

Run:
```bash
bundle exec jekyll build && grep -q 'site-footer' _site/index.html && grep -q 'askonas@cua.edu' _site/index.html && echo PASS
```
Expected: `PASS`.

- [ ] **Step 4: Commit**

```bash
git add _includes/footer.html _sass/_signal-footer.scss
git commit -m "Signal theme: footer"
```

---

## Task 4: Arrow-list component (CSS + keyboard JS)

The signature interaction. Any `<ul class="arrow-list">` becomes keyboard-selectable; it degrades to plain links without JS.

**Markup contract** (used by all later list pages). Two shapes:

Plain (homepage menu, Speaking) — `[caret] [main / meta]`:
```html
<ul class="arrow-list">
  <li>
    <a href="URL">
      <span class="caret" aria-hidden="true">❯</span>
      <span class="al-main">Primary text</span>
      <span class="al-meta">Secondary text</span>
    </a>
  </li>
</ul>
```

Dated (Writing, Publications) — `[caret] [year] [main+meta]`, year as a scannable gutter:
```html
<ul class="arrow-list arrow-list--dated">
  <li>
    <a href="URL">
      <span class="caret" aria-hidden="true">❯</span>
      <span class="al-year">2025</span>
      <span class="al-body">
        <span class="al-main">Primary text</span>
        <span class="al-meta">Secondary text (no year — it's in the gutter)</span>
      </span>
    </a>
  </li>
</ul>
```

**Files:**
- Fill: `_sass/_signal-list.scss`
- Create: `js/arrownav.js`
- Modify: `_layouts/default.html` (script tags)

- [ ] **Step 1: Fill `_sass/_signal-list.scss`**

```scss
.arrow-list { list-style: none; margin: 0; padding: 0; }
.arrow-list > li { border-bottom: 1px solid var(--line); }
.arrow-list > li:last-child { border-bottom: 0; }

.arrow-list > li > a {
  display: grid;
  grid-template-columns: 1.4rem 1fr;
  align-items: baseline;
  column-gap: 0.4rem;
  padding: 0.95rem 0.5rem;
  color: var(--ink);
  border-left: 2px solid transparent;
}
.arrow-list > li > a:hover { text-decoration: none; }

.arrow-list .caret {
  font-family: var(--mono);
  color: var(--gold);
  opacity: 0;
  transform: translateX(-3px);
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.arrow-list .al-main { font-size: 1.05rem; }
.arrow-list .al-meta {
  grid-column: 2;
  font-family: var(--mono);
  font-size: 0.78rem;
  color: var(--mut);
  margin-top: 0.1rem;
}

// dated variant: year as a scannable left gutter (Writing, Publications).
// Turns a flat list into a comparative time display (Tufte: range-frame /
// "compared to what?"). Year sits in its own mono column; title+meta stack
// in .al-body (a normal block, so the base .al-meta grid rule is inert here).
.arrow-list--dated > li > a { grid-template-columns: 1.4rem 3.4rem 1fr; }
.arrow-list--dated .al-year {
  font-family: var(--mono);
  font-size: 0.82rem;
  color: var(--mut);
}
.arrow-list--dated .al-body { display: block; }
.arrow-list--dated > li.is-active .al-year { color: var(--gold); }

// active (keyboard/hover) state
.arrow-list > li.is-active > a { background: var(--panel); border-left-color: var(--gold); }
.arrow-list > li.is-active .caret { opacity: 1; transform: translateX(0); }
.arrow-list > li.is-active .al-main { color: var(--gold); }
.arrow-list > li.is-active .al-meta { color: var(--dim); }

// keyboard focus parity (no-JS / tabbing)
.arrow-list > li > a:focus-visible { outline: none; background: var(--panel); border-left-color: var(--gold); }
.arrow-list > li > a:focus-visible .caret { opacity: 1; transform: translateX(0); }

@media (prefers-reduced-motion: reduce) {
  .arrow-list .caret { transition: none; }
}
```

- [ ] **Step 2: Create `js/arrownav.js`**

```js
/* Signal arrow navigation — progressive enhancement over real <a> links. */
(function () {
  "use strict";

  var lists = Array.prototype.slice.call(document.querySelectorAll(".arrow-list"));
  if (!lists.length) return;

  var activeList = null;

  function setup(list) {
    var items = Array.prototype.slice.call(list.children).filter(function (el) {
      return el.tagName === "LI";
    });
    if (!items.length) return;
    list._items = items;
    list._idx = -1;

    list._move = function (n, scroll) {
      if (n < 0) n = items.length - 1;
      if (n >= items.length) n = 0;
      for (var i = 0; i < items.length; i++) {
        if (i === n) items[i].classList.add("is-active");
        else items[i].classList.remove("is-active");
      }
      list._idx = n;
      if (scroll && items[n]) items[n].scrollIntoView({ block: "nearest" });
    };

    items.forEach(function (li, i) {
      li.addEventListener("mouseenter", function () {
        activeList = list;
        list._move(i, false);
      });
    });
  }

  lists.forEach(setup);
  activeList = lists[0];

  document.addEventListener("keydown", function (e) {
    if (!activeList || !activeList._items) return;
    var k = e.key;
    if (k === "ArrowDown" || k === "j") {
      e.preventDefault();
      activeList._move(activeList._idx + 1, true);
    } else if (k === "ArrowUp" || k === "k") {
      e.preventDefault();
      activeList._move(activeList._idx - 1, true);
    } else if (k === "Enter") {
      // If a link is already focused, let the browser follow it natively.
      if (document.activeElement && document.activeElement.tagName === "A") return;
      var i = activeList._idx;
      if (i >= 0) {
        var a = activeList._items[i].querySelector("a");
        if (a) { e.preventDefault(); a.click(); }
      }
    }
  });
})();
```

- [ ] **Step 3: Swap the script tags in `_layouts/default.html`**

Find:
```html
    <script src="{{ site.url }}/js/vendor/jquery-1.9.1.min.js"></script>
    <script src="{{ site.url }}/js/main.js"></script>
```
Replace with:
```html
    <script src="{{ site.url }}/js/arrownav.js" defer></script>
```

- [ ] **Step 4: Build and assert the JS ships and CSS compiled**

Run:
```bash
bundle exec jekyll build && test -f _site/js/arrownav.js && grep -q 'arrow-list' _site/css/main.css && grep -q 'arrownav.js' _site/index.html && echo PASS
```
Expected: `PASS`.

- [ ] **Step 5: Commit**

```bash
git add _sass/_signal-list.scss js/arrownav.js _layouts/default.html
git commit -m "Signal theme: arrow-list component and keyboard navigation"
```

---

## Task 5: Homepage (hero + menu)

**Files:**
- Create: `_data/menu.yml`
- Modify: `_layouts/home.html`, `index.md`, `_sass/_signal-home.scss`

- [ ] **Step 1: Create `_data/menu.yml`**

```yaml
# Homepage destination menu
- title: Writing
  url: /writing/
  desc: Essays & op-eds
- title: Book Projects
  url: /books/
  desc: Two books in progress
- title: Speaking
  url: /speaking/
  desc: Talks & interviews
- title: The Machine Has No Tradition
  url: /seminar/
  desc: Summer seminar on the philosophy of technology
- title: Publications
  url: /publications/
  desc: Peer-reviewed work
- title: About
  url: /about/
  desc: Bio & CV
```

- [ ] **Step 2: Rewrite `_layouts/home.html`**

```html
---
layout: default
---

<main id="main" role="main">
  <section class="hero container">
    <p class="kicker">// technology · war · the american future</p>
    <h1 class="hero-head">How nations learn, forget, and <em>remake themselves</em> under technological pressure.</h1>
    <div class="hero-bio">
      {{ content }}
    </div>
  </section>

  <section class="home-menu container" aria-label="Site sections">
    <p class="label menu-label">Sections</p>
    <ul class="arrow-list">
      {% for link in site.data.menu %}
      <li>
        <a href="{{ site.url }}{{ link.url }}">
          <span class="caret" aria-hidden="true">❯</span>
          <span class="al-main">{{ link.title }}</span>
          <span class="al-meta">{{ link.desc }}</span>
        </a>
      </li>
      {% endfor %}
    </ul>
  </section>
</main>
```

- [ ] **Step 3: Replace `index.md`**

```markdown
---
layout: home
permalink: /
title: ""
image:
  feature: mirv3.png
---

Jon Askonas writes about technology, war, and the American future — how nations and institutions learn, forget, and remake themselves under technological pressure, and what statecraft requires in an age of disruption. He is a member of the Policy Planning Staff at the U.S. Department of State, an Assistant Professor of Politics at the Catholic University of America, and a Senior Fellow at the Foundation for American Innovation. He is completing two books on the U.S. military's struggle to remember what it learns in war.
```

> Note: the MIRV `<script>`/`<pre>` hero block and the funder list are intentionally dropped. `image.feature` stays only for the social-card image.

- [ ] **Step 4: Fill `_sass/_signal-home.scss`**

```scss
.hero { padding: 4.5rem 0 1rem; }
.hero .kicker { display: block; margin-bottom: 1.4rem; }
.hero-head {
  font-size: 3rem;
  line-height: 1.06;
  letter-spacing: -0.015em;
  max-width: 56rem;
  margin: 0 0 1.6rem;
}
.hero-head em { color: var(--gold); }
.hero-bio { color: var(--dim); font-size: 1.12rem; max-width: var(--measure); }
.hero-bio a { border-bottom: 1px solid rgba(245, 185, 66, 0.4); }
.hero-bio a:hover { text-decoration: none; border-bottom-color: var(--gold); }

.home-menu { padding: 2.5rem 0 1rem; }
.menu-label { margin: 0 0 0.5rem 0.5rem; }

@media (max-width: $bp-mobile) {
  .hero { padding-top: 3rem; }
  .hero-head { font-size: 2.1rem; }
}
```

- [ ] **Step 5: Build and assert**

Run:
```bash
bundle exec jekyll build && grep -q 'hero-head' _site/index.html && grep -q 'arrow-list' _site/index.html && grep -q 'remake themselves' _site/index.html && echo PASS
```
Expected: `PASS`.

- [ ] **Step 6: Manual check**

```bash
bundle exec jekyll serve
```
Open `http://localhost:4000`. Confirm: dark hero, amber italic in headline, menu below; pressing ↓/↑ moves the ❯ marker; Enter follows; hover highlights; clicking a row navigates. Stop the server (Ctrl-C) when done.

- [ ] **Step 7: Commit**

```bash
git add _data/menu.yml _layouts/home.html index.md _sass/_signal-home.scss
git commit -m "Signal theme: spare homepage with hero and arrow-nav menu"
```

---

## Task 6: Generic page layout + page styles

A single `page.html` for all content pages, plus shared page-header/content styles.

**Files:**
- Create: `_layouts/page.html`
- Fill: `_sass/_signal-pages.scss`

- [ ] **Step 1: Create `_layouts/page.html`**

```html
---
layout: default
---

<main id="main" role="main">
  <article class="page container">
    <header class="page-head">
      <p class="kicker">{{ page.kicker | default: "//" }}</p>
      <h1>{{ page.title }}</h1>
      {% if page.lead %}<p class="page-lead">{{ page.lead }}</p>{% endif %}
    </header>
    <div class="page-body">
      {{ content }}
    </div>
  </article>
</main>
```

- [ ] **Step 2: Fill `_sass/_signal-pages.scss`**

```scss
.page { padding: 3.5rem 0 0; }
.page-head { margin-bottom: 2.5rem; }
.page-head .kicker { display: block; margin-bottom: 1rem; }
.page-head h1 { margin: 0; }
.page-lead {
  color: var(--dim);
  font-size: 1.15rem;
  max-width: var(--measure);
  margin: 1rem 0 0;
}
.page-body { max-width: var(--measure); }
.page-body h2 { font-size: 1.5rem; }

// book projects
.book { margin: 0 0 3.5rem; }
.book-img {
  width: 100%;
  border: 1px solid var(--line2);
  border-radius: 6px;
  display: block;
  margin-bottom: 1.2rem;
}
.book h2 { margin: 0 0 0.6rem; }
.book .status { font-family: var(--mono); font-size: 0.78rem; color: var(--gold); }

// publications / speaking entries (non-link rich text inside arrow-list main)
.entry-title { color: var(--ink); }
.entry-venue { color: var(--dim); font-style: italic; }
```

- [ ] **Step 3: Build (no page yet uses it; just confirm Sass compiles)**

Run:
```bash
bundle exec jekyll build && grep -q 'page-head' _site/css/main.css && echo PASS
```
Expected: `PASS`.

- [ ] **Step 4: Commit**

```bash
git add _layouts/page.html _sass/_signal-pages.scss
git commit -m "Signal theme: generic page layout and page styles"
```

---

## Task 7: Writing page (curated, data-driven, grouped by year)

**Files:**
- Create: `_data/writing.yml`, `writing.md`

- [ ] **Step 1: Create `_data/writing.yml` (curated shortlist — Jon trims later)**

```yaml
# Curated essays & op-eds (strongest, policy-facing). Newest first.
- title: The New Control Society
  outlet: The New Atlantis
  year: 2025
  url: https://www.thenewatlantis.com/publications/the-new-control-society
- title: Technology for the American Family
  outlet: National Affairs
  year: 2025
  coauthor: with Michael Toscano
  url: https://www.nationalaffairs.com/publications/detail/technology-for-the-american-family
- title: How to Free Elon Musk's SpaceX From Federal Red Tape
  outlet: Wall Street Journal
  year: 2024
  coauthor: with Jonathan Berry
  url: https://www.wsj.com/opinion/how-to-free-elon-musks-spacex-from-federal-red-tape-nepa-faa-3b4e9dbd
- title: Technological Stagnation Is a Choice
  outlet: American Affairs
  year: 2023
  url: https://americanaffairsjournal.org/2023/11/technological-stagnation-is-a-choice/
- title: Common Sense on AI
  outlet: American Affairs
  year: 2023
  coauthor: with Samuel Hammond
  url: https://americanaffairsjournal.org/2023/05/common-sense-on-ai/
- title: How Gamers Eclipsed Spies as an Intelligence Threat
  outlet: Foreign Policy
  year: 2023
  coauthor: with Renée DiResta
  url: https://foreignpolicy.com/2023/04/15/ukraine-leak-intelligence-discord-espionage-gamers-internet-online/
- title: "Reality: A Post-Mortem"
  outlet: The New Atlantis
  year: 2022
  note: eight-part media-ecology series
  url: https://www.thenewatlantis.com/collections/reality-a-post-mortem
- title: Why Conservatism Failed
  outlet: Compact
  year: 2022
  url: https://compactmag.com/article/why-conservatism-failed
- title: You Are Already in the Metaverse
  outlet: UnHerd
  year: 2022
  url: https://unherd.com/2022/09/you-are-already-in-the-metaverse/
- title: With Finland and Sweden in NATO, the U.S. Can Finally Pivot to the Pacific
  outlet: Foreign Policy
  year: 2022
  coauthor: with Gil Barndollar
  url: https://foreignpolicy.com/2022/07/12/finland-sweden-nato-us-europe-pacific-military-pivot-strategy-geopolitics/
- title: Why Speech Platforms Can Never Escape Politics
  outlet: National Affairs
  year: 2020
  coauthor: with Ari Schulman
  url: https://www.nationalaffairs.com/why-speech-platforms-can-never-escape-politics
- title: How Tech Utopia Fostered Tyranny
  outlet: The New Atlantis
  year: 2019
  url: https://www.thenewatlantis.com/publications/how-tech-utopia-fostered-tyranny
```

- [ ] **Step 2: Create `writing.md`**

```markdown
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
```

- [ ] **Step 3: Build and assert**

Run:
```bash
bundle exec jekyll build && grep -q 'The New Control Society' _site/writing/index.html && grep -q 'arrow-list' _site/writing/index.html && echo PASS
```
Expected: `PASS`.

- [ ] **Step 4: Commit**

```bash
git add _data/writing.yml writing.md
git commit -m "Signal theme: Writing page (curated, data-driven)"
```

---

## Task 8: Publications page

**Files:**
- Create: `_data/publications.yml`, `publications.md`

- [ ] **Step 1: Create `_data/publications.yml`**

```yaml
# Peer-reviewed articles & chapters. Newest first.
- title: "From the Passion to the Hydrogen Bomb: René Girard and the Eschatological Problem of Technology"
  venue: "In Be Not Conformed, ed. Luke Burgis (Catholic University of America Press)"
  year: 2026
  url: https://www.cuapress.org/9780813240381/be-not-conformed/
- title: The Abolition of the Division of Labor in the Work of Karl Marx
  venue: "In The Concept of Work in the History of European Philosophy, ed. Gene Callahan (Palgrave Macmillan)"
  year: 2025
  url: https://doi.org/10.1007/978-3-031-96547-0_11
- title: "A World of Amusement: Entertainment, Sacrifice, and the Possibility of Politics"
  venue: "In Politics and Poetics (forthcoming)"
  year: 2025
  url:
- title: "Introduction to Special Section on Virtue in the Loop: Virtue Ethics and Military AI"
  venue: Journal of Military Ethics 23.3–4
  coauthor: with Paul Scherz
  year: 2024
  url: https://www.tandfonline.com/doi/full/10.1080/15027570.2024.2441050
- title: "Atomic Signaling: Exploring Likelihood of Success and Military Necessity through the Bargaining Model of War"
  venue: The Review of Faith & International Affairs 22.2
  coauthor: with Joshua Hastey
  year: 2024
  url: https://www.tandfonline.com/doi/full/10.1080/15570274.2024.2335065
- title: Digital Voodoo Dolls
  venue: Proceedings of the 2021 AAAI/ACM Conference on AI, Ethics, and Society
  coauthor: with Marija Slavkovik et al.
  year: 2021
  url: https://doi.org/10.1145/3461702.3462626
- title: "Thinking Failure in the War in Iraq: The Cultural Turn and the Concept of \"World\""
  venue: "In Why Philosophy?, eds. Bubbio & Malpas (De Gruyter)"
  coauthor: with Katherine Withy
  year: 2019
  url: https://www.degruyter.com/view/books/9783110650990/9783110650990-008/9783110650990-008.xml
- title: "The Triple Helix after Communism: Russia and China Compared"
  venue: Triple Helix 3.1
  coauthor: with Harley Balzer
  year: 2016
  url: https://link.springer.com/article/10.1186/s40604-015-0031-4
- title: Innovation in Russia & China Compared
  venue: Russian Analytical Digest 155
  coauthor: with Harley Balzer
  year: 2014
  url:
- title: "From Soviet Revolution to Socialist Realism: The Historical Context of Zamyatin's We and Platonov's The Foundation Pit"
  venue: Troika 2.1
  year: 2012
  url:
```

- [ ] **Step 2: Create `publications.md`**

```markdown
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
    {% if item.url %}<a href="{{ item.url }}" target="_blank" rel="noopener">{% else %}<a href="#" aria-disabled="true">{% endif %}
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
```

- [ ] **Step 3: Build and assert**

Run:
```bash
bundle exec jekyll build && grep -q 'Hydrogen Bomb' _site/publications/index.html && echo PASS
```
Expected: `PASS`.

- [ ] **Step 4: Commit**

```bash
git add _data/publications.yml publications.md
git commit -m "Signal theme: Publications page"
```

---

## Task 9: Speaking page

**Files:**
- Create: `_data/speaking.yml`, `speaking.md`

- [ ] **Step 1: Create `_data/speaking.yml`**

```yaml
conferences:
  - title: Generative AI and National Security
    role: Organizer
    detail: Day-long conference with speakers from DoD and CDAO; keynote by Michael Kratsios
    year: 2024
  - title: Virtue in the Loop — Military AI Ethics
    role: Co-Organizer (with Paul Scherz)
    detail: Developing a virtue-ethics framework for autonomous systems in military contexts
    year: 2022
  - title: American Democracy in the Internet Age
    role: Organizer
    detail: Seminar for the Templeton World Foundation and public conference with The New Atlantis
    year: 2019
  - title: Peaceful Coexistence? Russian Grand Strategy beyond Putin
    role: Organizer
    detail: Interdisciplinary colloquium on Russian visions of world order
    year: 2018

talks:
  - title: Morality in Tech
    venue: Invitation-Only Seminar, Princeton University
    year: 2023
  - title: AI and the Problem of Military Judgment
    venue: Virtue in the Loop Conference, Catholic University of America
    year: 2022
  - title: "Money Is Not a Weapons System: Inflation, Economic Distortion, and Counterinsurgency Failure"
    venue: Political Economy of Security Workshop, Boston University
    year: 2020
  - title: "The Owl of Minerva Flies at Dusk: The Organizational Sources of Military Optimism"
    venue: APSA Annual Conference, Washington, DC
    year: 2019
  - title: Finding the Common Good in the Age of the Infinite Self
    venue: Citizenship in a Networked Age Conference (Templeton World Foundation)
    year: 2019
  - title: How Tech Utopia Fostered Tyranny
    venue: Hertog Free Speech and the Internet Seminar, Washington, DC
    year: 2019
```

- [ ] **Step 2: Create `speaking.md`**

```markdown
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
    <a href="#" aria-disabled="true">
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
    <a href="#" aria-disabled="true">
      <span class="caret" aria-hidden="true">❯</span>
      <span class="al-main"><span class="entry-title">{{ item.title }}</span></span>
      <span class="al-meta">{{ item.venue }} · {{ item.year }}</span>
    </a>
  </li>
{% endfor %}
</ul>
```

> Note: Speaking entries have no outbound links, so they use `href="#"`. They still participate in arrow-key/hover highlighting; the two lists on the page are independent (hovering one makes it the active list). This is acceptable for v1; Jon can add links later.

- [ ] **Step 3: Build and assert**

Run:
```bash
bundle exec jekyll build && grep -q 'Generative AI and National Security' _site/speaking/index.html && grep -q 'Selected Talks' _site/speaking/index.html && echo PASS
```
Expected: `PASS`.

- [ ] **Step 4: Commit**

```bash
git add _data/speaking.yml speaking.md
git commit -m "Signal theme: Speaking page"
```

---

## Task 10: Book Projects page (with placeholder header images)

**Files:**
- Create: `images/book-muse-of-fire.svg`, `images/book-shot-in-the-dark.svg`, `books.md`

- [ ] **Step 1: Create `images/book-muse-of-fire.svg` (duotone-on-slate placeholder)**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 480" role="img" aria-label="A Muse of Fire — placeholder cover">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#11151b"/>
      <stop offset="1" stop-color="#1e242d"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="480" fill="url(#g1)"/>
  <text x="48" y="120" fill="#6b7480" font-family="monospace" font-size="22" letter-spacing="3">// BOOK PROJECT</text>
  <text x="48" y="250" fill="#f5b942" font-family="Georgia, serif" font-style="italic" font-size="72">A Muse of Fire</text>
  <text x="48" y="320" fill="#9aa4b2" font-family="Georgia, serif" font-size="30">Why the U.S. Military Forgets What It Learns in War</text>
</svg>
```

- [ ] **Step 2: Create `images/book-shot-in-the-dark.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 480" role="img" aria-label="The Shot in the Dark — placeholder cover">
  <defs>
    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#11151b"/>
      <stop offset="1" stop-color="#241a12"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="480" fill="url(#g2)"/>
  <text x="48" y="120" fill="#6b7480" font-family="monospace" font-size="22" letter-spacing="3">// BOOK PROJECT</text>
  <text x="48" y="250" fill="#f5b942" font-family="Georgia, serif" font-style="italic" font-size="64">The Shot in the Dark</text>
  <text x="48" y="320" fill="#9aa4b2" font-family="Georgia, serif" font-size="28">A History of the U.S. Army Asymmetric Warfare Group, 2006–2021</text>
</svg>
```

- [ ] **Step 3: Create `books.md`**

```markdown
---
layout: page
permalink: /books/
title: Book Projects
kicker: // books in progress
lead: "Two books on military memory, adaptation, and the institutions of war."
excerpt: "Book projects by Jon Askonas."
---

<div class="book">
  <img class="book-img" src="{{ site.url }}/images/book-muse-of-fire.svg" alt="A Muse of Fire">
  <h2><em>A Muse of Fire: Why the U.S. Military Forgets What It Learns in War</em></h2>
  <p class="status">Manuscript completed · in conversation with publishers</p>
  <p>A study of organizational learning and forgetting in the U.S. military — why hard-won lessons of war decay once the fighting stops, and what that pattern reveals about innovation, adaptation, and the limits of institutional memory. Drawn from the author's Oxford doctoral research.</p>
</div>

<div class="book">
  <img class="book-img" src="{{ site.url }}/images/book-shot-in-the-dark.svg" alt="The Shot in the Dark">
  <h2><em>The Shot in the Dark: A History of the U.S. Army Asymmetric Warfare Group, 2006–2021</em></h2>
  <p class="status">Under contract with the U.S. Army</p>
  <p>A history of the Asymmetric Warfare Group, the Army's experiment in rapid battlefield adaptation, from its founding through its 2021 disestablishment — based on extensive interviews and archival research. To be published by the Center of Military History or Army University Press.</p>
</div>
```

- [ ] **Step 4: Build and assert**

Run:
```bash
bundle exec jekyll build && grep -q 'A Muse of Fire' _site/books/index.html && test -f _site/images/book-muse-of-fire.svg && echo PASS
```
Expected: `PASS`.

- [ ] **Step 5: Commit**

```bash
git add images/book-muse-of-fire.svg images/book-shot-in-the-dark.svg books.md
git commit -m "Signal theme: Book Projects page with placeholder headers"
```

---

## Task 11: The Machine Has No Tradition (seminar) page

**Files:**
- Create: `seminar.md`

- [ ] **Step 1: Create `seminar.md`**

```markdown
---
layout: page
permalink: /seminar/
title: The Machine Has No Tradition
kicker: // summer seminar
lead: "A week-long intensive seminar on the philosophy of technology."
excerpt: "The Machine Has No Tradition — a summer seminar on the philosophy of technology, co-taught at Harvard."
---

*The Machine Has No Tradition* is a week-long intensive seminar on the philosophy of technology, co-taught each summer with **Nathan Pinkoski** and **Mary Harrington** at Harvard. It is intended for graduate students, advanced undergraduates, young professionals, and early-career scholars.

The seminar takes its title from the observation that modern technology is uniquely self-justifying and tradition-dissolving — and asks what this means for politics, family, faith, and the good life. Across a week of close reading and discussion, participants work through classic and contemporary texts on technology and the human person.

Past guest speakers have included **Matthew Crawford**, **Andy Crouch**, and **Erica Bachiochi**.

<hr>

Applications typically open in the spring. To be notified, email <a href="mailto:askonas@cua.edu">askonas@cua.edu</a> with a short note about your background and interest.
```

- [ ] **Step 2: Build and assert**

Run:
```bash
bundle exec jekyll build && grep -q 'Machine Has No Tradition' _site/seminar/index.html && grep -q 'Nathan Pinkoski' _site/seminar/index.html && echo PASS
```
Expected: `PASS`.

- [ ] **Step 3: Commit**

```bash
git add seminar.md
git commit -m "Signal theme: The Machine Has No Tradition seminar page"
```

---

## Task 12: About / CV page

**Files:**
- Create: `about.md`

- [ ] **Step 1: Create `about.md`**

```markdown
---
layout: page
permalink: /about/
title: About
kicker: // bio & cv
excerpt: "About Jon Askonas — writer, political theorist, and strategist."
---

Jon Askonas is a writer and political theorist working at the intersection of technology, war, and American grand strategy. His central preoccupation is organizational learning and forgetting — why institutions, from armies to states to firms, fail to retain and apply hard-won knowledge.

He is a member of the **Policy Planning Staff** at the U.S. Department of State, an **Assistant Professor of Politics** at the Catholic University of America, and a **Senior Fellow** at the Foundation for American Innovation, where he leads the Defense Innovation portfolio and co-leads the AI and Copyright for National Security project.

He holds a **DPhil in Politics** from the University of Oxford and a **B.S.F.S.** *summa cum laude* from Georgetown University's School of Foreign Service.

## Appointments

- Member, Policy Planning Staff, U.S. Department of State (2025–present)
- Senior Fellow, Foundation for American Innovation (2022–present)
- Assistant Professor of Politics, Catholic University of America (2018–present)
- Fellow & Director of Programs, Center for the Study of Statesmanship, CUA

## Education

- DPhil, Politics (International Relations), University of Oxford, 2019
- MPhil, Politics (International Relations), University of Oxford, 2015
- B.S.F.S., International Politics, Georgetown University, 2013

## Selected Honors

- Emerging Public Intellectual Award, John Templeton Foundation, 2024
- The Beinecke Scholarship, 2014

<hr>

<p><a href="{{ site.url }}/jaskonas_cv.pdf" target="_blank" rel="noopener">Download full CV (PDF) ❯</a></p>
```

> Open item §7.4: the CV PDF (`/jaskonas_cv.pdf`) is supplied by Jon. Until then the link 404s gracefully. (An older `jaskonaspublic_cv.pdf` exists in the repo root and can be renamed/copied as a stopgap.)

- [ ] **Step 2: Build and assert**

Run:
```bash
bundle exec jekyll build && grep -q 'Policy Planning Staff' _site/about/index.html && grep -q 'cv.pdf' _site/about/index.html && echo PASS
```
Expected: `PASS`.

- [ ] **Step 3: Commit**

```bash
git add about.md
git commit -m "Signal theme: About / CV page"
```

---

## Task 13: Config, meta, OG fix, and removal of old pages/includes

**Files:**
- Modify: `_config.yml`
- Delete: `research.md`, `teaching.md`, `data.md`, `studentdashboard.md`, `_includes/navigation-sliding.html`

- [ ] **Step 1: Fix owner/Twitter in `_config.yml`**

The OG template reads `site.owner.twitter` and prepends `@`, but `owner` is a string and `twitter` is top-level. Replace these lines:

```yaml
#Site owner
avatar: jaskonas_portrait.png
name: "Jon Askonas"
owner: "Jon Askonas"
twitter: "@jonaskonas"
```

with:

```yaml
#Site owner
avatar: jaskonas_portrait.png
name: "Jon Askonas"
owner:
  name: "Jon Askonas"
  twitter: jonaskonas
```

- [ ] **Step 2: Update the site description in `_config.yml`**

Replace:
```yaml
description: "Jon Askonas — political scientist, military historian, and technology scholar at the Catholic University of America and the U.S. Department of State Policy Planning Staff."
```
with:
```yaml
description: "Jon Askonas — writer and political theorist on technology, war, and the American future."
```

- [ ] **Step 3: Delete retired pages and the sliding-menu include**

```bash
git rm research.md teaching.md data.md studentdashboard.md _includes/navigation-sliding.html
```

- [ ] **Step 4: Build and assert old routes are gone, OG is correct**

Run:
```bash
bundle exec jekyll build \
  && test ! -d _site/research \
  && test ! -d _site/teaching \
  && grep -q 'twitter:site" content="@jonaskonas"' _site/index.html \
  && echo PASS
```
Expected: `PASS` (no double `@@`, no leftover routes).

- [ ] **Step 5: Commit**

```bash
git add _config.yml
git commit -m "Signal theme: config, meta, OG owner fix; remove retired pages"
```

---

## Task 14: Full verification pass

No code changes unless a check fails. Confirms the spec's acceptance criteria (§6 of the spec).

- [ ] **Step 1: Clean build with no warnings of concern**

```bash
bundle exec jekyll build 2>&1 | tee /tmp/jekyll-build.log
grep -iE "error|warning" /tmp/jekyll-build.log || echo "no errors/warnings"
```
Expected: build completes; no Liquid errors. (A benign Sass deprecation notice is acceptable.)

- [ ] **Step 2: Route inventory**

```bash
for r in index writing books speaking seminar publications about; do
  f="_site/$r/index.html"; [ "$r" = index ] && f="_site/index.html"
  test -f "$f" && echo "ok: /$r" || echo "MISSING: /$r"
done
```
Expected: all `ok`.

- [ ] **Step 3: No-JS pass (links work without the script)**

```bash
bundle exec jekyll serve &
sleep 3
# Every nav + menu item is a real <a href> in the served HTML:
curl -s http://localhost:4000/ | grep -c 'class="arrow-list"'        # >= 1
curl -s http://localhost:4000/writing/ | grep -c 'href="https'        # >= 10
kill %1
```
Expected: counts > 0; confirms content renders server-side independent of JS.

- [ ] **Step 4: Manual browser pass**

```bash
bundle exec jekyll serve
```
At `http://localhost:4000`, verify in the browser:
- Homepage: ↑/↓ and j/k move the ❯ marker; Enter follows; hover highlights; click navigates.
- Writing/Publications: arrow-keys traverse the list; Enter opens the essay in a new tab.
- Resize to mobile width (~375px): header wraps, hero/headline scale down, lists remain readable.
- Tab key alone (no arrows): focus ring + caret appear on each link (no-JS-equivalent accessibility).
- Reduced motion: with OS "reduce motion" on, the caret appears without transition.

Stop the server when done.

- [ ] **Step 5: Link audit (outbound essay/publication URLs resolve)**

```bash
grep -rhoE 'https://[^" ]+' _data/writing.yml _data/publications.yml | sort -u \
  | while read u; do code=$(curl -s -o /dev/null -w "%{http_code}" -L "$u"); echo "$code  $u"; done
```
Expected: mostly `200`. Note any `404`/`403` for Jon to fix (some outlets block bots with 403 — verify those manually).

- [ ] **Step 6: Final commit (if any fixes were made)**

```bash
git add -A
git commit -m "Signal theme: verification fixes" || echo "nothing to commit"
```

---

## Post-implementation: open items for Jon (from spec §7)

These are content decisions, not code, and can be handled after the build is live:
1. **Bio wording** — edit `index.md` and `about.md`.
2. **Book projects** — confirm titles/status in `books.md`.
3. **Writing curation** — trim/extend `_data/writing.yml`.
4. **CV PDF** — drop the real file at repo root as `jaskonas_cv.pdf` (About links to it).
5. **Book header images** — replace the two SVG placeholders in `images/` with real artwork.

---

## Notes on conventions followed

- **DRY:** one `.arrow-list` component (CSS + JS) serves every list; pages only emit markup + data. The shared piece is the *behavior* (CSS + `arrownav.js`), not a Liquid partial — the spec's mooted `arrow-list.html` include was dropped because each list has different fields (menu vs. essay vs. publication), which a single parametrized include would handle awkwardly. Inlined markup per page is simpler and still DRY.
- **No post migration needed:** `_posts/research/` contains no posts, so there is nothing to fold into Writing or elsewhere.
- **YAGNI:** no search, RSS authoring, light/dark toggle, or command-line nav (explicitly cut in the spec).
- **Progressive enhancement:** all navigation is real `<a>` links; `arrownav.js` only adds keyboard/marker affordances and never injects content.
- **Frequent commits:** one commit per task, each leaving the site in a buildable state.
