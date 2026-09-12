# CIPHER brand files

**Decode. Build. Evolve.**

## Files
| File | Use |
|---|---|
| `logo-on-dark.svg` / `logo-on-light.svg` | Primary lockup (mark + wordmark). "on-dark" = bone artwork for dark backgrounds; "on-light" = ink artwork for light backgrounds. |
| `logo-slogan-on-dark.svg` / `-on-light.svg` | Lockup with slogan — proposals, invoices, email signature, website footer. |
| `mark-on-dark.svg` / `mark-on-light.svg` | Icon only — favicons, avatars, watermarks, tight spaces. |
| `wordmark-on-dark.svg` / `-on-light.svg` | Text only — nav bars where the mark is shown elsewhere. |
| `icon-512.png`, `icon-192.png`, `apple-icon-180.png`, `icon-32.png`, `icon-16.png`, `favicon.ico` | Website / PWA icons. In Next.js: copy `favicon.ico`, rename `icon-512.png` → `app/icon.png`, `apple-icon-180.png` → `app/apple-icon.png`. |
| `social-avatar-1080.png` | Instagram, LinkedIn, Upwork, WhatsApp Business profile picture. |
| `og-cover-1200x630.png` | Open Graph / link preview image, LinkedIn page cover base. |
| `email-signature@2x.png` | Email signature — insert at 50% width (≈ 450 px). |
| `logo-on-dark@2x.png`, `logo-on-light@2x.png` | Raster fallbacks for tools that don't accept SVG (Canva, Google Docs). |
| `Logo.tsx` | React component with the "decode" fill-in animation for the CIPHER website. |

## Colours
Ink `#0F1013` · Bone `#F2EFE8` · Copper `#E0A45C` (accent — the one copper cell, buttons, links) · Slate `#8B9099` (secondary text on dark) / `#5E636B` (on light).

## Type
Space Grotesk 500 for the wordmark and headings (tracking +10 % on the wordmark only). Manrope 500 for body and UI. Both are free on Google Fonts. The logo files have the text outlined, so the fonts are only needed for new material.

## Rules
- Clear space: keep a margin of at least one cell (the height of one square) around the logo.
- Minimum sizes: lockup 120 px wide; mark 16 px.
- Don't stretch, rotate, recolour, add gradients/shadows/outlines, or change the copper cell's position.
- One logo per surface — don't combine the mark and the lockup on the same page.
- Never place the CIPHER logo on a client's website or app.
