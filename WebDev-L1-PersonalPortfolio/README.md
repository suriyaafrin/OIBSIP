# Suriya Islam Afrin — Portfolio

**Project:** WebDev-L1-PersonalPortfolio (OIBSIP)

A personal portfolio website for Suriya Islam Afrin, Front-End Developer specializing in React and Next.js.

## Overview

This is a single-page portfolio site built with plain HTML, CSS, and JavaScript (no build tools or frameworks required). It presents an overview, skills, selected projects, a published research paper, and contact information.

## Folder Structure

Place all project files inside `WebDev-L1-PersonalPortfolio/`:

```
WebDev-L1-PersonalPortfolio/
├── index.html      # Page markup and content
├── styles.css      # All styling
├── script.js       # Mobile menu toggle and scroll-reveal animations
├── profile.jpg      # Profile photo (add your own image with this filename)
└── README.md       # This file
```

## Sections

- **Overview** — Name, role, and a short credentials card (location, focus area, availability)
- **About** — Short bio, profile photo, and key facts (location, education, languages, activities)
- **Skills** — Front-end, frameworks, UI libraries, back-end, tooling, and deployment platforms
- **Projects** — Four featured projects, each with a description, key points, and links to the live site and GitHub repo
- **Research** — Published IEEE conference paper with DOI link
- **Contact** — Email, phone, location, and links to GitHub and LinkedIn

## Setup

No build step is required.

1. Keep `index.html`, `styles.css`, and `script.js` in the same folder.
2. Add a profile photo named `profile.jpg` to the same folder (used in the About section).
3. Open `index.html` directly in a browser, or serve the folder with any static file server.

## Technologies Used

- HTML5
- CSS3 (custom properties, CSS Grid, Flexbox)
- Vanilla JavaScript (IntersectionObserver for scroll animations, mobile nav toggle)
- Google Fonts: Bricolage Grotesque, Manrope, JetBrains Mono

## Customization

- **Colors and spacing** — defined as CSS custom properties at the top of `styles.css` under `:root`
- **Content** — edit directly in `index.html`; each section is clearly labeled with an HTML comment-free but semantically named `id` (`#about`, `#skills`, `#projects`, `#research`, `#contact`)
- **Links** — project "Live site" and "View repo" links, GitHub, LinkedIn, email, and phone are set directly on their respective `<a>` tags

## Deployment

Since this is a static site, it can be deployed to any static hosting provider, for example:

- **Vercel** — drag and drop the folder or connect a GitHub repo
- **Netlify** — drag and drop the folder or connect a GitHub repo
- **GitHub Pages** — push to a repository and enable Pages in the repo settings

## Contact

- Email: suriyaislamafrin@gmail.com
- Phone: +880 1572-043140
- GitHub: [github.com/suriyaafrin](https://github.com/suriyaafrin)
- LinkedIn: [linkedin.com/in/suriya-islam-afrin-6376a6253](https://www.linkedin.com/in/suriya-islam-afrin-6376a6253)