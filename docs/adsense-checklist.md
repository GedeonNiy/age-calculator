# AdSense Readiness Checklist

This document tracks AdSense verification assets and requirements for Smart Tools Hub.

## Verification Assets Location

### robots.txt
- **Location:** `public/robots.txt`
- **URL:** https://smartagetools.com/robots.txt
- **Status:** ✅ Present
- **Contains:** Sitemap reference to https://smartagetools.com/sitemap.xml
- **Validation:** Visit `/robots.txt` in browser or use: `curl https://smartagetools.com/robots.txt`

### sitemap.xml
- **Location:** `public/sitemap.xml`
- **URL:** https://smartagetools.com/sitemap.xml
- **Status:** ✅ Present
- **Contains:** All 4 tool pages + static pages (Home, About, Contact, Privacy, Terms)
- **Validation:** Visit `/sitemap.xml` in browser or use: `curl https://smartagetools.com/sitemap.xml`
- **Note:** Updated to only include implemented tools (Age Calculator, Date Difference, BMI Calculator, Mortgage Calculator)

### ads.txt
- **Location:** `public/ads.txt`
- **URL:** https://smartagetools.com/ads.txt
- **Status:** ✅ Present (placeholder)
- **Content:** Placeholder file ready for publisher ID
- **Action Required:** After AdSense approval, update with format:
  ```
  google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
  ```
- **Validation:** Visit `/ads.txt` in browser

## Meta Tags

### AdSense Meta Tag
- **Location:** `index.html` (head section)
- **Status:** ⚠️ Commented placeholder
- **Current:** `<!-- <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXX"> -->`
- **Action Required:** After approval, uncomment and replace `XXXXXXXXXXXXXXX` with your publisher ID

### AdSense Script
- **Location:** Not yet added
- **Action Required:** After approval, add to `index.html` head:
  ```html
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
  ```

## SEO & Indexing

### Noindex Tags
- **Status:** ✅ Removed from all pages
- **Previous:** Privacy, Terms, Contact had `noindex: true`
- **Current:** All pages are indexable (noindex removed from SEO config)

### Canonical URLs
- **Status:** ✅ Implemented
- **Location:** `src/utils/seo.ts` - `updateSEO()` function
- **Behavior:** Self-referencing canonical for all pages
- **Format:** `https://smartagetools.com{path}`

### Open Graph Tags
- **Status:** ✅ Implemented
- **Location:** `src/utils/seo.ts` - `updateSEO()` function
- **Tags:** og:title, og:description, og:url, og:type, og:site_name

### Twitter Card Tags
- **Status:** ✅ Implemented
- **Location:** `src/utils/seo.ts` - `updateSEO()` function
- **Tags:** twitter:card, twitter:title, twitter:description

## Page Requirements

### Unique Titles & Descriptions
- **Status:** ✅ Complete
- **Location:** `src/config/seo.ts`
- **Coverage:** All pages have unique titles and descriptions

### Internal Linking
- **Status:** ✅ Complete
- **Home Tool Cards:** Use `<a href="/path">` for crawlability
- **Header Dropdown:** All tools linked
- **Footer:** All main pages linked

### Scroll to Top
- **Status:** ✅ Implemented
- **Location:** `src/main.ts` - `showView()` function
- **Behavior:** Smooth scroll to top on all route changes

## Contact Email

### Support Email
- **Status:** ✅ Updated everywhere
- **Email:** support@smartagetools.com
- **Locations:**
  - Footer
  - Contact page
  - Structured data (Organization schema)

## Validation Steps

1. **Test robots.txt:**
   ```bash
   curl https://smartagetools.com/robots.txt
   ```

2. **Test sitemap.xml:**
   ```bash
   curl https://smartagetools.com/sitemap.xml
   ```

3. **Test ads.txt:**
   ```bash
   curl https://smartagetools.com/ads.txt
   ```

4. **Verify no noindex:**
   - Check page source for `<meta name="robots" content="noindex">`
   - Should not appear on any main pages

5. **Verify canonical URLs:**
   - Check page source for `<link rel="canonical" href="...">`
   - Should be self-referencing for each page

6. **Test internal links:**
   - Click all tool cards on home page
   - Click all header dropdown items
   - Click all footer links
   - All should navigate and scroll to top

## Post-Approval Actions

1. Uncomment AdSense meta tag in `index.html` and add publisher ID
2. Add AdSense script to `index.html` head
3. Update `public/ads.txt` with actual publisher ID
4. Test ad placements (if adding manually)

## Notes

- All verification files are in `public/` folder (Vite serves these at root)
- SEO metadata is dynamically updated via `src/utils/seo.ts`
- Route changes trigger scroll to top automatically
- Footer includes verification links (Sitemap, Robots, Ads.txt) for easy access


