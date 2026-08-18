# Ada Lovelace — Tribute Page

A responsive tribute page dedicated to **Ada Lovelace** (1815–1852), mathematician and writer, widely credited with publishing the first algorithm intended for a machine. Built for Task 2 of the tribute page exercise.

## Live Preview

Open `index.html` in any modern browser. No build step, no dependencies to install.

## File Structure

```
├── index.html   → page structure and content
├── style.css    → all styling (layout, colors, typography, responsiveness)
├── script.js    → scroll-reveal animation (IntersectionObserver)
└── README.md    → this file
```

Keep all three files in the same folder — `index.html` links to `style.css` and `script.js` by relative path.

## Design Concept

- **Theme:** Victorian-era paper meets punch-card computing, reflecting Ada's world (1840s London) and her legacy (early computing).
- **Colors:** deep ink-navy and brass gold for the hero and timeline sections, aged paper cream for the biography and legacy sections, wine red for the quote block — three background tones total, tied together by a brass accent.
- **Typography:** Cormorant Garamond (serif, headlines) + Lora (serif, body copy) + Space Mono (labels, dates, eyebrows) — the monospace face nods to punch-cards/binary.
- **Signature element:** the achievements section is framed as "The Notes," lettered A→G. This mirrors real history — Ada's 1843 annotations on the Analytical Engine were literally lettered A through G, with Note G containing her famous algorithm.

## Features (Checklist)

- [x] Page title with subject's name + one-line tagline
- [x] Prominent image — 1836 portrait by Margaret Sarah Carpenter, public domain, via Wikimedia Commons
- [x] Biography section — 4 original paragraphs
- [x] Timeline / achievements section — 8 styled "Note" cards (A–G plus legacy notes)
- [x] Distinctly styled quote block — Ada's own 1843 quote on the Analytical Engine
- [x] 3 background colors (ink-navy, paper cream, wine red)
- [x] 3 font styles (Cormorant Garamond, Lora, Space Mono)
- [x] Responsive layout — grid collapses to single column on mobile, hero image reorders above the text

## Tech Stack

- HTML5
- CSS3 (Grid, Flexbox, media queries, CSS custom properties)
- Vanilla JavaScript (`IntersectionObserver` for scroll-reveal — no libraries)
- Google Fonts CDN (Cormorant Garamond, Lora, Space Mono)

## Sources

- Biographical content researched and paraphrased from Wikipedia and Britannica entries on Ada Lovelace.
- Portrait: Margaret Sarah Carpenter, 1836, Government Art Collection — public domain, sourced from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ada_Lovelace.jpg).
- Quote: Ada Lovelace, *Notes on the Analytical Engine*, 1843 (public domain).