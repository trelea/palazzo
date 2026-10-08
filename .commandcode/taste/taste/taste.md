# Taste
- Prefers compact content bands over full-viewport (`min-h-svh`) sections — call-to-action blocks should feel like a section band, not a full-height screen. Confidence: 0.6
- Wants new UI sections to have a distinct visual treatment rather than cloning an existing pattern (e.g. not a copy of the existing appointment band), while still keeping it simple and polished. Confidence: 0.6
- When two CTAs sit side by side, they must be exactly the same width and height (e.g. a two-column grid or equal flex basis), not sized by their own content. Confidence: 0.7
- When asked to remove a feature/UI element, remove it completely — no commenting out or hiding; also clean up the now-unused imports and i18n keys it introduced. Confidence: 0.6
- Cares about SEO/metadata rigor — expects feature/branch changes to be reviewed against the full SEO surface (canonical + hreflang, OG/Twitter, JSON-LD, sitemap, alt text) and asks for a prioritized gap analysis of what's missing or could be improved, not just a confirmation. Confidence: 0.55
- Wants websites attributed to the agency that built them and its founder/lead developer — inject as much of it as possible: `Organization` + `Person` (with LinkedIn) JSON-LD, `author`/`creator`/`developer` meta tags, and a visible footer credit linking the agency site, the developer's LinkedIn, and contact email/phone. Confidence: 0.6
