# CLAUDE_REVIEW.md — Batch 2 review, round 3 (final)

**The blocker is fixed.** Assamese renders correctly on every card I checked. Donuts are real, all three macros populated, `FAT` label cleaned up.

Three small fixes and this merges. All three are in the pill/donut area of `generate-card-images.js`. **This is the last round on Batch 2** — after these, push and I approve.

---

## Verified fixed

- `মাছৰ টেঙা` and `উত্তৰ-পূবৰ অণুজীৱ কিণ্বিত খাদ্য` render with correct glyphs — no tofu boxes
- Font vendored to `assets/fonts/` and registered
- Macro donut segments are proportional and correct: Masor Tenga (14.5p / 4.0c / 6.8f) renders ≈43% / 12% / 45% by calorie contribution, which is right
- All three pills carry values
- 18 distinct hashes, all 1200×900

---

## FIX 1 — Pill background colours contradict the donut

The donut colour code, from the source:

```js
protein → card.accentColor
carbs   → #FF9800   (orange)
fat     → #E53935   (red)
```

The *value text* in each pill uses those same colours — correct. But the *pill backgrounds* are inherited from whatever `fillStyle` was last set, and they don't follow the code. On `masor-tenga.jpg`:

| Pill | Background | Meaning implied | Donut says orange = |
|---|---|---|---|
| CARBS | light blue | — | carbs |
| **FAT** | **orange** | fat is orange | **carbs** |

A reader maps orange → FAT from the pill, then reads the donut's small orange segment as fat. Fat is actually the *largest* macro in that dish. The card is actively misleading.

**Fix:** make every pill background neutral and let colour carry one meaning only.

```js
// all three pills, same treatment
ctx.fillStyle = 'rgba(255,255,255,0.06)';
ctx.strokeStyle = 'rgba(255,255,255,0.15)';
// then a 12px colour dot before the label, using the donut colour:
//   protein → card.accentColor
//   carbs   → '#FF9800'
//   fat     → '#E53935'
```

That gives an implicit legend, fixes the contradiction, and solves Fix 2 at the same time.

---

## FIX 2 — Value text is barely legible

Consequence of the above. Currently:

- `4.0g` in orange `#FF9800` on a light blue fill
- `6.8g` in red `#E53935` on an orange fill

Both fail contrast badly, and these cards need to be readable as small thumbnails in a search result. Neutral dark pill backgrounds (Fix 1) put coloured text on dark, which reads cleanly. Verify each combination reaches at least 4.5:1.

---

## FIX 3 — The calculator article has a fabricated donut

`bug-blog.jpg` (the decimal-height-bug article) has:

```js
protein: 'BMR', carbs: 'Mifflin', fat: 'Formula',
proteinG: 10, carbsG: 50, fatG: 15,
```

The labels are placeholder words and the gram values are invented purely to make a donut render. That article isn't about a food and has no macros. A chart drawn from made-up numbers is the same category of problem as the fabricated `lastmod` dates.

**Fix:** add an `isFood: false` flag for non-food articles. When false, skip the donut and the three pills entirely, and let the title and category band fill the space. Check the other article cards for the same issue — anything where the macro values aren't real nutrition data for a real dish.

---

## Then

1. Apply the three fixes
2. Regenerate all 17
3. Push, re-run the suite against a fresh preview
4. Update `CLAUDE_HANDOFF.md` — include the paths of `masor-tenga.jpg`, `bug-blog.jpg` and one more
5. Do not merge; I'll approve on this round

Nothing else in Batch 2 needs changing. Recipe schema, homepage schema removal, step formatting, social links and `og-banner.jpg` are all approved.
