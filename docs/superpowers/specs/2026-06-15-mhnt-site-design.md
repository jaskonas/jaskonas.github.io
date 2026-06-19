# MHNT Site Design Spec
**Date:** 2026-06-15  
**Project:** mhnt.org — The Machine Has No Tradition  
**Owner:** Jon Askonas  

---

## Overview

A public-facing site for the MHNT seminar. Informational for now — advertises the seminar, profiles faculty, collects email interest, and serves as a private alumni hub. Phase 2 adds a live application form.

**Stack:** Eleventy (static site generator) + Netlify (hosting, forms, DNS)  
**Domain:** mhnt.org (already owned)

---

## Visual Identity

### Core aesthetic
Pure black and white. No color. Dense, historical, typographically bold. The site should feel like a document from inside the machine — not a startup, not a university department page.

### MHNT Typelogo
The primary identity mark. "MHNT" set in Helvetica Neue 900 at large scale, used as a clipPath mask over a full-bleed background etching. Three SVG layers:
1. Background image — desaturated grayscale
2. Same image — inverted grayscale, clipped to the letter shapes
3. White 30% opacity rect — also clipped to letter shapes (lifts legibility)

Each page load selects a random image from the 99-image library. Pressing J/← or K/→ cycles through the full set as an easter egg (no UI affordance; discoverable by curious users).

### Image library
99 AI-generated etchings in the combined tradition of Gustave Doré (drama, chiaroscuro), Albrecht Dürer (cross-hatching, precision), and John James Audubon (naturalistic scene-setting). All black and white, full-bleed, no labels or schematic elements. Subjects span transportation, communications, energy, and manufacturing from 1800 to the present.

**Roadmap:** Generate Doré/Dürer/Audubon-style portrait treatments for each of the three faculty members to use as profile images.

### Typography
| Role | Typeface |
|------|----------|
| MHNT logomark | Helvetica Neue 900 |
| Display headings | Helvetica Neue 700 |
| Navigation, labels, UI | Helvetica Neue 500 |
| Body copy, metadata | IBM Plex Mono 400 |
| Subheadings in body | IBM Plex Mono 500 |

IBM Plex Mono is free (Google Fonts / open license). No other typefaces.

### Color
Black (`#000`) and white (`#fff`) only. Gray used only for muted UI states (e.g., inactive nav links at ~`#555`).

---

## Site Structure

### Pages

| Page | Path | Purpose |
|------|------|---------|
| Home | `/` | Hero typelogo, pitch, email capture, faculty |
| About | `/about/` | Full seminar description |
| Alumni | `/alumni/` | Alumni profiles + private Signal link |
| Apply | `/apply/` | Placeholder; live form in Phase 2 |

### Navigation
Top nav: **About · Alumni · Apply**. No logo in the nav — the typelogo is the hero, not a persistent header element. Nav links in Helvetica Neue 500, uppercase, tight letter-spacing.

---

## Page Specs

### Home (`/`)

**Section 1 — Hero**

*Desktop (L3 — Split Panel):* Two-column hero divided by a vertical rule. Left column: large MHNT typelogo (SVG etching treatment, see Visual Identity). Right column: seminar kicker ("SEMINAR · RETURNING SUMMER 2027"), tagline, and email capture CTA.

*Mobile (M2 — Collapse to Editorial):* Switches to a single-column broadsheet layout. Kicker in muted small caps above a heavy top rule, MHNT title below it (full width), a lighter rule beneath, then tagline and CTA. Same content, editorial punch without the split column.

The typelogo SVG layers (grayscale background, inverted+grayscale clipped to letters, white 30% rect over letters) apply in both breakpoints — only the surrounding layout changes.

**Section 2 — Pitch**  
2–3 paragraphs (to be written) describing the seminar: what it is, who it's for, what participants do. IBM Plex Mono body at comfortable reading width (~65ch). Helvetica Neue 700 for any section headings.

**Section 3 — Email capture**  
Netlify Form. Single email input + submit. Label: "Get notified when applications open." No name field. Submission sends to Netlify's form dashboard; configure notification email to jon.askonas@gmail.com.

**Section 4 — Faculty**  
Three cards in a row (stacking to single column on mobile). Each card:
- Portrait photo (eventually: Doré/Dürer/Audubon treatment; initially: standard photo)
- Name in Helvetica Neue 700
- Title + institution in IBM Plex Mono, muted
- 2-sentence bio in IBM Plex Mono

**Faculty:**
- Jon Askonas
- Mary Harrington
- Nathan Pinkowski

---

### About (`/about/`)

Long-form seminar description. Topics to cover (copy TBD):
- The seminar's intellectual premise
- Format (intensive, duration, location)
- Who should apply
- What past participants have said or done

Typelogo hero at top (same random/cycling behavior). Reading-width body in IBM Plex Mono. No sidebar.

---

### Alumni (`/alumni/`)

**Section 1 — Hero**  
Typelogo treatment (same as other pages).

**Section 2 — Alumni profiles**  
Static list maintained in Eleventy data file (`_data/alumni.json`). Each entry: name, cohort year, current affiliation, optional one-line note. Rendered as a simple grid or ruled list. Public; no authentication required.

**Section 3 — Signal group (password-protected)**  
At the bottom of the page, a locked section. A password prompt (single text input) is revealed with a subtle horizontal rule and label like "Alumni · Private" in IBM Plex Mono small caps. On correct entry, a QR code image (provided by Jon) is revealed.

Implementation: client-side JS only. Password is hashed (SHA-256) and compared against a stored hash in the page. Adequate for this use case — the Signal group invite is convenience-private, not security-sensitive. Password and QR code provided by Jon at implementation time.

---

### Apply (`/apply/`)

**Phase 1 (now):**  
Typelogo hero. Short text: "Applications for the next cohort will open Summer 2027. Leave your email to be notified." Netlify Form (email only, same as home page form — Netlify deduplicates submissions).

**Phase 2 (future):**  
Full application form. Fields TBD. Still on Netlify Forms or migrated to a form backend depending on complexity.

---

## Email Capture

Netlify Forms handles submission storage. No backend required.

- Form name: `mhnt-interest`
- Fields: `email` only
- Success state: inline confirmation message ("You're on the list.")
- Notification: Netlify sends to jon.askonas@gmail.com on each submission

---

## Eleventy Architecture

```
mhnt/
├── src/
│   ├── index.njk           # Home
│   ├── about.njk           # About
│   ├── alumni.njk          # Alumni
│   ├── apply.njk           # Apply
│   ├── _data/
│   │   ├── faculty.json    # Faculty name/title/bio/photo
│   │   └── alumni.json     # Alumni name/year/affiliation
│   ├── _includes/
│   │   ├── base.njk        # Base layout: <head>, nav, footer
│   │   ├── hero.njk        # Typelogo SVG hero (shared)
│   │   └── email-form.njk  # Netlify form partial
│   └── assets/
│       ├── css/main.css    # Hand-written; no framework
│       ├── js/main.js      # Image cycling + alumni password
│       └── images/         # 99 etching PNGs + faculty photos
├── .eleventy.js
├── netlify.toml
└── package.json
```

**Image cycling JS** (`main.js`):
- On page load: pick a random index from `window.MHNT_IMAGES` (array of filenames injected by the template)
- On `keydown`: J or ArrowLeft → previous; K or ArrowRight → next (wrapping)
- Swap `href` attributes on both `<image>` elements inside the SVG hero

**Alumni password JS** (`main.js`):
- On submit: SHA-256 hash the input, compare to stored hash constant
- On match: remove `hidden` class from QR code container, hide the form
- On mismatch: shake animation on input, clear value

---

## Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npx @11ty/eleventy"
  publish = "_site"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 404
```

Custom domain: mhnt.org → configure DNS A record to Netlify's load balancer IP, or use Netlify's nameservers. HTTPS provisioned automatically.

---

## Roadmap (Phase 2)

- Live application form with structured fields
- Doré/Dürer/Audubon portrait images for each faculty member (generated alongside the 99-image library process)
- Possible: individual alumni profile pages
- Possible: reading list or syllabus page

---

## Open at Implementation Time

- Seminar description copy (About page body)
- Faculty photos and 2-sentence bios
- Alumni list (names, years, affiliations)
- Signal group QR code + alumni password
- Final faculty titles and institutions
