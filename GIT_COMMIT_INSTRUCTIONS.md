# Git Commit Instructions

## Files Modified for Production

### Critical Production Files (Must Commit)
1. `src/utils/seo.ts` - Added structured data (JSON-LD)
2. `src/main.ts` - Added SEO updates on navigation
3. `public/sitemap.xml` - Enhanced with all pages and priorities
4. `index.html` - Enhanced footer with internal links
5. `src/utils/pdfJpgUtils.ts` - Removed "coming soon" message
6. `src/pages/pdfJpgConverter.ts` - Removed "in development" message
7. `dist/index.html` - Updated About, Terms, PDF JPG pages (if you keep dist/ in git)

### Documentation Files (Optional - for your reference)
- `ADSENSE_AUDIT_REPORT.md`
- `RESUBMISSION_CHECKLIST.md`
- `IMPLEMENTATION_SUMMARY.md`
- `PRODUCTION_FILES.md`
- `FINAL_FIXES_SUMMARY.md`
- `GIT_COMMIT_INSTRUCTIONS.md` (this file)

---

## Git Commands to Run

### Option 1: Commit All Changes (Recommended)

```bash
# Stage all modified files
git add .

# Or stage specific production files only:
git add src/utils/seo.ts
git add src/main.ts
git add public/sitemap.xml
git add index.html
git add src/utils/pdfJpgUtils.ts
git add src/pages/pdfJpgConverter.ts

# Commit with descriptive message
git commit -m "Fix AdSense compliance issues: Add structured data, enhance SEO, update sitemap, remove 'coming soon' messages, update About/Terms pages"

# Push to remote
git push
```

### Option 2: Commit Production Files Only (Exclude Documentation)

```bash
# Stage only production files
git add src/utils/seo.ts
git add src/main.ts
git add public/sitemap.xml
git add index.html
git add src/utils/pdfJpgUtils.ts
git add src/pages/pdfJpgConverter.ts

# Commit
git commit -m "Fix AdSense compliance: Add structured data, SEO updates, sitemap enhancement, remove incomplete features"

# Push
git push
```

### Option 3: Commit Documentation Separately

```bash
# First commit production files
git add src/ public/ index.html
git commit -m "Fix AdSense compliance: Add structured data, SEO, sitemap, remove incomplete features"

# Then commit documentation (optional)
git add *.md
git commit -m "Add AdSense audit documentation and checklists"

# Push all
git push
```

---

## Recommended Commit Message

```
Fix AdSense compliance issues

- Add JSON-LD structured data (Organization + WebSite schema)
- Implement SEO metadata updates on page navigation
- Enhance sitemap.xml with all tool pages and priorities
- Add footer with internal links for better site structure
- Remove "coming soon" messages from PDF JPG converter
- Update About page to show current tools (not future plans)
- Update Terms page to reflect all tool categories
- Fix duplicate content in PDF JPG converter page

All changes improve AdSense approval chances by:
- Adding trust signals (structured data)
- Ensuring site appears complete (no "coming soon")
- Improving SEO and crawlability
- Enhancing content quality and accuracy
```

---

## If Git is Not in PATH

If you get "git is not recognized", you can:

1. **Use Git Bash** (if installed):
   - Open Git Bash
   - Navigate to your project: `cd /c/Users/nzayi/Gedeon/DEV/age-calculator`
   - Run the git commands above

2. **Use VS Code Git Integration**:
   - Open Source Control panel (Ctrl+Shift+G)
   - Stage files
   - Commit with message
   - Push

3. **Use GitHub Desktop** (if installed):
   - Open GitHub Desktop
   - Review changes
   - Commit with message
   - Push

4. **Add Git to PATH**:
   - Find Git installation (usually `C:\Program Files\Git\cmd`)
   - Add to Windows PATH environment variable
   - Restart terminal

---

## Verify Before Pushing

Before pushing, verify:

```bash
# Check what will be committed
git status

# Review the changes
git diff --staged

# If everything looks good, push
git push
```

---

## After Pushing

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Deploy to production** (Vercel/your hosting)

3. **Submit sitemap to Google Search Console:**
   - Go to Google Search Console
   - Submit: `https://smartagetools.com/sitemap.xml`

4. **Request indexing** for important pages

5. **Wait 1-2 weeks** for Google to re-crawl

6. **Resubmit to AdSense** following `RESUBMISSION_CHECKLIST.md`

---

## Quick Copy-Paste Commands

**For Production Files Only:**
```bash
git add src/utils/seo.ts src/main.ts public/sitemap.xml index.html src/utils/pdfJpgUtils.ts src/pages/pdfJpgConverter.ts
git commit -m "Fix AdSense compliance: Add structured data, SEO updates, sitemap, remove incomplete features"
git push
```

**For All Changes:**
```bash
git add .
git commit -m "Fix AdSense compliance issues: Add structured data, enhance SEO, update sitemap, remove 'coming soon' messages"
git push
```


