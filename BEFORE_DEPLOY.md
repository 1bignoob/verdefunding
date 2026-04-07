# Before Deploy Checklist

Use this checklist before pushing a production update.

## 1) Paths and Routing
- Confirm internal links are relative, not root-absolute.
- On home page use `services/`, `about/`, `faq/`, `contact/`.
- On subpages use `../` style links where needed.
- Verify no `href="/something"` remains for internal routes.

## 2) Local QA
- Open all primary pages and test navigation:
  - Home
  - Services
  - About
  - FAQ
  - Contact
  - Privacy
  - Terms
  - Thank You
- Submit test form on Home and Contact and confirm redirect works.
- Validate mobile nav toggle on phone width.

## 3) SEO and Metadata
- Ensure each page has a unique title and meta description.
- Confirm canonical links are correct.
- Confirm robots and sitemap are present and updated:
  - `robots.txt`
  - `sitemap.xml`

## 4) Accessibility
- Confirm one H1 per page.
- Confirm keyboard navigation and visible focus states.
- Confirm all links have `title` attributes.
- Confirm all form fields have labels.

## 5) Performance and Visual QA
- Check desktop, tablet, and mobile layouts.
- Check button hover/focus interactions.
- Check no layout overlap or clipping.

## 6) Git and Deploy
- Review changes:
  - `git status`
  - `git diff --stat`
- Commit:
  - `git add .`
  - `git commit -m "Update site before deploy"`
- Push:
  - `git push`

## 7) Post-Deploy Smoke Test
- Open live URL and hard refresh.
- Re-test nav, forms, and key sections.
- Re-check any previously reported 404 links.
