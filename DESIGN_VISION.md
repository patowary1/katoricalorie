# KatoriCalorie — Design Vision

**Status: parked. Do not implement.** This is a direction document for a future redesign phase, written August 2026 while Batches 1–3 (technical SEO) are in progress. Revisit once the site is indexed and ranking, and only implement with Ridip's explicit go-ahead.

---

## 1. What "world-class" actually means for this site

It does not mean more animation, more gradients, or more panels. Those are what unambitious sites do when they want to look designed.

For KatoriCalorie it means three things:

1. **A grandmother in Jorhat and a gym-goer in Guwahati can both use it in under thirty seconds.**
2. **It looks like it comes from Assam** — not like a generic fitness app with Assamese words pasted in.
3. **It is faster than anything it competes with**, on a mid-range Android over patchy 4G.

Every idea below is subordinate to those. If something looks beautiful and costs clarity or speed, it loses.

The most beautiful version of this site is the clearest one.

---

## 2. The core idea: the katori is the interface

The product is already named after a bowl. Lean into it completely.

Nobody in India measures food in grams. They measure in *katoris*. Every competitor asks for grams and loses people at that first question. KatoriCalorie's entire visual and interaction language should be built on the bowl:

- Portions are bowls, not numbers
- The daily budget is a **thali** that fills up
- Adding food is placing a bowl on a plate
- Going over budget is a plate that's visibly too full

Get this right and the site needs almost no instructions. That's the goal — the interface *is* the explanation.

---

## 3. Visual language

### 3.1 Palette — move from black to brass

The current site is near-black (`--bg-base: #0D0D0D`) with orange accents. Dark UI reads as "tech product." Food reads better warm, and Assam has a far more distinctive palette available.

**Proposed: warm paper light theme, with a true dark mode as an option.**

```
/* Surfaces — warm, paper-like, not clinical white */
--bg-base:      #FDFBF7   /* warm paper */
--bg-surface:   #FFFFFF   /* cards */
--bg-sunken:    #F4EFE6   /* wells, input backgrounds */

/* Brass & bell metal — the katori itself */
--brass-900:    #6B4A1E
--brass-600:    #A97434
--brass-400:    #C9A227   /* primary accent */
--brass-100:    #F2E5C4

/* Muga silk gold — Assam's own, found nowhere else */
--muga:         #C8A951

/* Gamosa red — used sparingly, for emphasis only */
--gamosa:       #C1272D

/* Brahmaputra — cool counterweight, used for data */
--river-700:    #1F4E5F
--river-400:    #3E7C8C

/* Ink */
--ink-900:      #1A1614
--ink-600:      #4A423C
--ink-400:      #857A70
```

The discipline: **brass for the product, river-teal for data, gamosa red only for warnings and over-budget states.** Three roles, never mixed.

### 3.2 Typography — three scripts, one voice

This site carries Latin, Assamese (Bengali-Assamese script) and Devanagari. Most multilingual sites fail here: the Latin looks designed and the Indic looks like a fallback.

```
Headings (Latin):        Fraunces or Instrument Serif — warmth, editorial
Headings (Assamese):     Noto Serif Bengali
Headings (Devanagari):   Noto Serif Devanagari
Body (all scripts):      Inter / Noto Sans Bengali / Noto Sans Devanagari
Numbers:                 a tabular-figures face — calories must never shift width
```

Critical detail most people miss: **Bengali and Devanagari need more line-height than Latin.** Set `line-height: 1.5` for Latin and `1.75` for Indic scripts, per-language. Otherwise Assamese text looks cramped and cheap next to the English.

Also: never let a language switch change the layout. Same grid, same rhythm, three scripts.

### 3.3 Texture

One restrained idea: a very subtle woven texture, derived from **gamosa cloth**, at 2–3% opacity behind section breaks. Enough to feel physical. Not a background image — a tiled SVG under 2 KB.

Resist everything else. No glassmorphism, no neon glow, no floating 3D.

---

## 4. Rebuilding the homepage as a sequence

The current homepage shows a visitor six zeros and three empty panels simultaneously. Replace it with a narrative that reveals itself.

**Screen 1 — the question**

Nothing but one sentence and one input:

> **How many calories do you actually need?**
> Most Indian calorie apps guess your portions wrong. This one asks in katoris.
>
> `[ I'm male ] [ I'm female ]`

No jargon. No BMR. No sliders yet.

**Screen 2 — three questions, one at a time**

Weight, height, age. One per view, large controls, thumb-reachable. Each answered question collapses into a compact summary chip at the top, so progress is visible.

Activity level as four illustrated cards, not a dropdown:
*Desk job* · *On my feet* · *Exercise 3–5×* · *Hard physical work*

**Screen 3 — the answer, in a sentence**

> **You need about 1,850 kcal a day.**
> That's roughly **6 katoris** of food — say, 2 rice, 2 curry, 1 dal, 1 vegetable.
>
> `[ Build today's thali → ]`

This sentence is the most important text on the site. It's where a visitor decides whether this was worth their time. A bare number fails; a bare number translated into katoris of real food succeeds.

**Screen 4 — the thali**

A circular steel thali, top-down. Empty wells for bowls. Tap a well → choose a food → a bowl fills it. The ring around the plate fills as you approach your budget, turning gamosa red past 100%.

Pre-loaded with a sample Assamese thali on first visit, with "Clear and start mine."

---

## 5. Signature moments

Every memorable product has three or four moments people describe to friends. Candidates:

1. **The filling bowl.** Increasing portion size pours into the bowl rather than incrementing a number. S/M/L shown as actual fill levels with ml labels.
2. **The plate that's too full.** Going over budget makes bowls visibly overflow the rim. No red error text needed — the plate says it.
3. **The shareable thali card.** One tap produces a clean image of today's plate with calories, ready for WhatsApp. This is the growth loop; it should be beautiful enough that people share it unprompted.
4. **The accuracy badge.** "Precise to the centimetre" with a tap-through explaining the decimal-height bug other calculators have. It's a real, checkable differentiator and nobody else can claim it.

---

## 6. Working with zero photographs

This is a constraint that can become the identity.

**The dish card system** — one parameterised SVG, rendered to raster where needed:

- A top-down katori, drawn not photographed, in brass tones
- Contents suggested with 4–6 flat shapes: rice grains, curry surface, greens, fish
- Category-coded: rice = warm cream · fish = pale river blue · greens = green · sweets = amber · fermented = deep ochre
- Dish name in both scripts, calorie figure, macro ring

Because every card comes from one template, the whole site looks intentional rather than scraped. Photo-led food sites all look alike; an illustrated one is instantly recognisable.

**When Ridip has photographs**, they slot into the same frame — same aspect ratio, same corner radius, same caption block. The card becomes the fallback, not the plan. Build the swap in from the start.

A hybrid is the eventual ideal: real photograph on the hero of each dish page, illustrated cards in listings and the food browser. Consistency in the grid, reality where it counts.

---

## 7. Motion

- **Purposeful only.** Motion should explain a change of state, never decorate.
- 180–240ms, ease-out. Anything slower feels sluggish on a mid-range phone.
- One signature easing curve used everywhere: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- The bowl fill is the one place a longer, more expressive animation (~400ms) is earned.
- Respect `prefers-reduced-motion` completely.

---

## 8. Non-negotiable constraints

This is where most redesigns quietly fail. Write these into the brief as hard budgets:

| Constraint | Target |
|---|---|
| Largest Contentful Paint, mobile 4G | < 2.0s |
| Cumulative Layout Shift | < 0.05 |
| Total JS, initial load | < 120 KB gzipped |
| Total webfont payload | < 180 KB across all three scripts |
| Works with JavaScript disabled | All content pages must still render and be readable |
| Colour contrast | WCAG AA minimum, AAA for body text |
| Touch targets | 44×44px minimum |
| Tested on | A ₹12,000 Android phone, not a MacBook |

The audience is largely on mid-range Android in Assam. A design that's beautiful on a fast laptop and slow on a Redmi has failed.

---

## 9. Language parity

Currently `/hi` is well translated, `/as` is roughly half English, and the compliance pages differ between languages. Before any redesign:

- Every UI string in one i18n file — no hardcoded text in templates
- All three languages reach 100% coverage, verified by a script that fails on missing keys
- Compliance pages exist in all three languages
- Language switcher present on every page, including compliance pages
- Design reviewed in Assamese first, not English first — if it works in the longest script, it works everywhere

Designing in English and translating afterwards is how the Indic version ends up looking like an afterthought. Invert it.

---

## 10. Worth studying

Not to copy — to understand why they work.

- **Serious Eats / Bon Appétit** — editorial food layout, how recipe pages hold dense information without feeling dense
- **Oatly** — an unmistakable illustrated identity with almost no photography
- **Monzo, Wise** — turning numeric data into plain-language sentences
- **Duolingo** — one question per screen, progress made visible
- **Are.na, Linear** — restraint; how much can be removed
- **Indian:** Zomato's nutrition views, Cult.fit's onboarding — worth knowing what your audience already expects

---

## 11. When to do this

**Not yet.** Order matters:

1. ✅ Batch 1 — crawlability *(done)*
2. Batch 2 — remove broken/placeholder content, fix Recipe schema
3. Batch 3 — titles, metadata, author identity, dates
4. Get indexed. Get first rankings. **Learn from real Search Console data which pages people actually land on.**
5. *Then* redesign — informed by what's working rather than by guesswork

Redesigning before there's traffic means designing for an imagined user. Two months of Search Console data will tell you whether people arrive for the calculator or for the food pages — and those two answers imply very different homepages.

**One thing worth doing now, cheaply:** when Ridip has 30 minutes, cook one dish and photograph it in a real katori by a window. One good photograph will teach us more about the visual direction than any amount of planning.
