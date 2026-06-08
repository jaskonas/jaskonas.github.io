# jaskonas.com — "Signal" Redesign

**Date:** 2026-06-08
**Status:** Design approved; pending spec review
**Author:** Jon Askonas (with Claude)

## 1. Purpose & Positioning

Reorient jaskonas.com from an **academic CV-site** to a **writer-and-thinker site** aimed at the **policy/political world** — people in government, think tanks, campaigns, and foundations who are evaluating Jon as a serious mind and potential collaborator.

The current site (the "Letterpress Scholarly" theme: parchment background, Cormorant Garamond, ox-blood links, animated MIRV ASCII hero) is being **retired**. The two felt problems it solves:

1. **Looks dated / unimpressive** for the target audience.
2. **Wrong emphasis** — it foregrounds academia (Research, Teaching, Data, Student Dashboard) when the priority is public writing and ideas.

Success looks like: a policy reader lands, immediately grasps who Jon is and what he thinks about, finds his essays and books fast, and comes away impressed by a confident, distinctive, *clean* presentation.

**The podcast (The Dynamist) is not mentioned anywhere on the site.**

## 2. Visual Identity — "Bold Technical (dark)"

Chosen direction: dark, spare, confident, with a single accent — terminal-flavored as a nod to Jon's technology/military themes, without costume.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0e1116` | page background (slate) |
| `--panel` | `#11151b` | raised surfaces |
| `--line` / `--line2` | `#1e242d` / `#2a323d` | hairline borders |
| `--ink` | `#e7e3da` | primary text (warm off-white) |
| `--dim` | `#9aa4b2` | secondary text |
| `--mut` | `#6b7480` | captions, hints |
| `--gold` | `#f5b942` | **single accent** — links, marker, emphasis |

**Type:**
- **Newsreader** (serif) — display headlines; italic in `--gold` for emphasis.
- **Inter** (sans) — body copy.
- **JetBrains Mono** (mono) — nav, labels, captions, kickers, the technical flourishes.

Discipline is the point: one accent color, generous negative space, the serif/sans/mono split carrying hierarchy so the page reads **clean and clear**, not busy.

Responsive: single-column, comfortable measure (~640–720px) for reading; the dark theme holds on mobile.

## 3. Signature Interaction — Arrow Navigation

Lists across the site are **keyboard-selectable** with a visible marker.

- **Marker glyph:** `❯` (prompt caret), in `--gold`.
- **Keys:** `↑/↓` and `j/k` move the marker; **Enter** follows the active item.
- **Mouse:** hover moves the marker; a plain click follows the link.
- **Scope:** every page that renders a list — the homepage menu, Writing, Publications, Speaking, Books.

**Progressive enhancement is a hard requirement.** Each item is a real `<a href>` rendered server-side by Jekyll. The page is fully usable — navigable, clickable, screen-reader accessible — with JavaScript disabled. The keyboard/marker layer is added by one small unobtrusive script on top. No content is injected by JS.

Behavior details:
- One "active" item per list; arrowing wraps at the ends.
- The marker is reserved space (no layout shift when it appears).
- Respects `prefers-reduced-motion` (no transition animation when set).
- If multiple lists are on a page, arrow keys drive the list the user is interacting with (hover/focus sets the active list); Enter follows the active item.

## 4. Information Architecture

Top navigation (mono, lowercase):

| Page | Route | Purpose | Source content |
|---|---|---|---|
| **Home** | `/` | Hero bio + arrow-nav menu (maximally spare — no essay strip) | Drafted from CV positions |
| **Writing** | `/writing/` | A **curated subset** of the strongest essays & op-eds, grouped by year, each linking out | Selected from CV "Other Writing" |
| **Book Projects** | `/books/` | The two book projects, each with a header image, title, and description | CV "Book Manuscripts in Preparation" |
| **Speaking** | `/speaking/` | Talks/presentations + conferences organized | CV "Presentations" (13) + "Conferences Organized" (7) |
| **The Machine Has No Tradition** | `/seminar/` | The summer seminar (own page) | CV "Conferences Organized" entry |
| **Publications** | `/publications/` | Academic peer-reviewed articles & chapters | CV "Peer-Reviewed Articles & Chapters" (10) |
| **About / CV** | `/about/` | Bio, appointments, education, awards, CV PDF | CV positions/education/awards |

**Dropped** as standalone pages: Teaching, Data, Student Dashboard. **Removed:** the MIRV ASCII hero, the podcast.

### Homepage composition (maximally spare)
1. Brand (mono `JON ASKONAS`) + top nav.
2. Hero: mono kicker (`// technology · war · the american future`), Newsreader headline, one-paragraph bio.
3. Arrow-nav menu (the IA above as a selectable list with one-line descriptors).

No recent-essay strip — the homepage stays clean: identity, then the menu, then footer.

### Book Projects page (`/books/`)
Framed as **book projects** (not "books in preparation"). Each project is a block with:
1. A **header / hero image** (full-width within the content measure).
2. A **title** (Newsreader display) — italicized book title + subtitle.
3. A **description paragraph** (status woven in, not a separate label).

Two projects:
- ***A Muse of Fire: Why the U.S. Military Forgets What It Learns in War.***
- ***The Shot in the Dark: A History of the U.S. Army Asymmetric Warfare Group, 2006–2021.***

Images are an open item (§7.5) — Jon provides, or we scaffold tasteful placeholders (e.g. a duotone-on-slate treatment) until he does.

### Bio (draft, to be edited by Jon)
> Jon Askonas writes about technology, war, and the American future — how nations and institutions learn, forget, and remake themselves under technological pressure, and what statecraft requires in an age of disruption. He is a member of the Policy Planning Staff at the U.S. Department of State, an Assistant Professor of Politics at the Catholic University of America, and a Senior Fellow at the Foundation for American Innovation. He is completing two books on the U.S. military's struggle to remember what it learns in war.

## 5. Implementation Approach

Stays on **Jekyll / GitHub Pages**. No framework change.

### Content as data
- New `_data/writing.yml` — list of `{ title, outlet, year, date, url, note? }` for the Writing page (populated from the CV "Other Writing" section, with live URLs).
- New `_data/publications.yml` — `{ authors, title, venue, year, url, doi? }` for academic work.
- New `_data/speaking.yml` — presentations and conferences organized.
- `_data/navigation.yml` — rewritten to the new IA.
- Books and the Seminar are simple enough to live as page Markdown; not data files.

Driving lists from data keeps them maintainable and lets the arrow-nav `_include` render any list uniformly from a loop.

### Files touched
- `_sass/` — retire Letterpress styles; introduce the dark "Signal" theme (variables, base, nav, hero, list/arrow-nav, footer). Recompile to `css/main.css` (compressed).
- `_layouts/` — `default.html` (head: new fonts, theme, favicon; header/nav; footer), plus `home.html` and a generic list/article layout. Retire `archive.html`/`media.html` if unused after the rework.
- `_includes/` — a reusable `arrow-list.html` partial (renders a `<ul>` of `<a>` items with the marker) used by every list page; header/footer partials updated.
- `js/` — one small `_arrownav.js` source compiled into `js/main.js` via the existing Grunt pipeline (uglify + front-matter surround). No other JS behavior depends on it.
- Root pages — rewrite `index.md`; add `writing.md`, `books.md`, `speaking.md`, `seminar.md`, `publications.md`, `about.md`. Remove `research.md`, `teaching.md`, `data.md`, `studentdashboard.md` (content migrated where relevant).
- `_config.yml` — update title/description/meta; fix the pre-existing Twitter/OG owner bug noted in project memory while we're in there.
- A CV PDF link on About (point at an exported `jaskonas_CV.pdf` in the repo; Jon refreshes the file).

### Existing `_posts/research/`
The existing post/article machinery is **not** central to the new IA. The Writing list comes from `_data/writing.yml`. Any genuine long-form content currently in `_posts/research/` will be reviewed during implementation and either folded into a page or dropped. (Directory currently appears empty of posts.)

## 6. Testing & Verification

- `bundle exec jekyll build` succeeds with no errors; `jekyll serve` renders every route.
- **No-JS pass:** with JavaScript disabled, every nav item and list item is a working link; pages are fully readable.
- **JS pass:** arrow keys move the `❯` marker, Enter follows, hover + click work; wrap-around correct; no layout shift; `prefers-reduced-motion` honored.
- **Responsive pass:** homepage, Writing, and About look correct at mobile and desktop widths.
- **Link audit:** every Writing/Publications/Speaking URL resolves.
- **Accessibility smoke test:** keyboard-only traversal of the homepage; visible focus states; sufficient contrast of `--gold`/`--dim` on `--bg`.

## 7. Open Items (need Jon's content/decisions)

1. **Bio wording** (§4) — Jon edits the draft.
2. **Book projects** — confirm titles/status (CV: *A Muse of Fire*, manuscript complete; *The Shot in the Dark*, under Army contract).
3. **Writing curation** — implementation will propose a curated shortlist (~10–12 of the strongest, e.g. the New Atlantis pieces, *Technology for the American Family*, the WSJ SpaceX op-ed, *Technological Stagnation Is a Choice*, *Why Conservatism Failed*, the Foreign Policy pieces); Jon confirms/trims the final list.
4. **CV PDF** — Jon provides the public CV file to host at `/about/`.
5. **Book project header images** — Jon provides images, or we scaffold duotone-on-slate placeholders until he does.

## 8. Out of Scope (YAGNI)

- No CMS, search, comments, analytics dashboard, or newsletter signup in this pass.
- No blog/RSS authoring workflow — Writing links out to where essays already live.
- No light/dark toggle — the dark theme is the brand.
- No command-line/REPL navigation (explicitly simplified to the arrow-marker menu).
