# CLAUDE_REVIEW.md — Batch 2 review, round 2

**Branch:** `repair/batch-2-cleanup`
**Verdict: close. Three fixes, all in the card generator.** Everything outside the cards is approved and unchanged from my last review.

---

## Real progress

The cards are now genuinely cards. I verified:

- All 18 images have **distinct hashes** — the duplication is gone
- All are **1200×900**, 106–114 KB
- Real rendered text: dish name, category label, calorie figure, branding, footer attribution
- Category colour coding works — amber for Til Pitha, river blue for Masor Tenga
- The layout is clean and looks intentional

Good recovery. Three defects remain, and the first is serious.

---

## 🔴 FIX 1 — Assamese renders as tofu boxes

On every card, the Assamese line renders as empty rectangles:

```
Masor Tenga (Assamese Fish Curry)
▯▯▯▯ ▯▯▯▯                          ← should read মাছৰ টেঙা

Til Pitha (Sesame Rice Roll)
▯▯▯ ▯▯▯▯                           ← should read তিল পিঠা
```

The data is correct — `scripts/generate-card-images.js` line 17 has `assamese: 'মাছৰ টেঙা'`. The problem is the renderer.

`@napi-rs/canvas` is loaded but **`GlobalFonts.registerFromPath()` is never called**, and no Bengali-Assamese font exists in the build environment. Canvas falls back to `.notdef` glyphs — the tofu box. This is the exact silent-font-fallback failure I flagged as the risk with this approach.

This matters more than any other item in the batch. Assamese-language search is the least contested space this site can win, and a card that renders Assamese as broken squares is worse than one that omits it — it signals the site can't handle the language it claims to serve.

**Fix — vendor the font, don't rely on the system:**

1. Download **Noto Sans Bengali** (SIL Open Font License, free to redistribute) and commit the TTFs to `assets/fonts/`:
   ```
   assets/fonts/NotoSansBengali-Regular.ttf
   assets/fonts/NotoSansBengali-Bold.ttf
   ```
2. Register before drawing:
   ```js
   const { GlobalFonts } = require('@napi-rs/canvas');
   const ok = GlobalFonts.registerFromPath(
     path.join(projectRoot, 'assets/fonts/NotoSansBengali-Bold.ttf'),
     'Noto Sans Bengali'
   );
   if (!ok) throw new Error('Bengali font failed to register — aborting');
   ```
   **Throw on failure.** Never let the generator continue with a missing font — that's how this shipped in the first place.
3. Use that family for the Assamese line specifically. The Latin face is fine as-is.

Note `assets/fonts/` will be served publicly. That's fine — the OFL permits it — but exclude it from the sitemap.

If you later add Hindi cards, register **Noto Sans Devanagari** the same way.

---

## 🟠 FIX 2 — Two of the three macro chips are empty

Every card shows:

```
[ PROTEIN ]   [ CARBS ]   [ FAT / TYPE ]
[  14.5g   ]  [         ] [            ]
```

Only protein has a value. `CARBS` and `FAT / TYPE` are bare labels.

The data exists — the Recipe schema you wrote in this same batch has `carbohydrateContent: 4.0g` and `fatContent: 6.8g` for Masor Tenga. Pull all three from the same source rather than hardcoding one into the card spec.

Also rename `FAT / TYPE` to just `FAT`. "TYPE" appears to be a leftover template token.

---

## 🟠 FIX 3 — The "NUTRITION PROFILE" ring is decoration, not data

The large circle on the right contains the literal words "NUTRITION PROFILE" inside two plain rings. It looks like a chart but conveys nothing.

Either:

- **Make it real** — a macro donut where the arc segments are proportional to protein/carbs/fat by calorie contribution, with the calorie figure in the centre. This is the single element that would make these cards genuinely useful at a glance. Or
- **Remove it** and let the layout breathe.

A ring that pretends to be a chart is the weakest option. Given you already have all three macros, making it real is a small amount of work.

---

## Fix the test alongside the code

The current assertions now catch duplicates and dimensions — good, that's the improvement I asked for. Add two more that would have caught this round's defects:

```
- Font registration returns true, else the build fails (assert in the generator itself)
- No rendered card contains .notdef glyphs
    → simplest reliable proxy: after registering the font, assert
      ctx.measureText('মাছৰ').width differs measurably from the
      unregistered-fallback width, and fail if it doesn't
- Every macro chip has a non-empty numeric value
    → assert the spec object for each card has protein, carbs AND fat
      before rendering; throw on any missing
```

The principle from last time still applies: assert the outcome, not the attempt.

---

## Everything else stays approved

No changes needed to: Recipe schema on the six food guides, homepage schema removal, recipe step formatting, social link removal, `og-banner.jpg`, or any Batch 1 guarantee.

---

## To do

1. Vendor Noto Sans Bengali, register it, throw on failure
2. Populate carbs and fat; rename `FAT / TYPE` → `FAT`
3. Make the ring a real macro donut, or remove it
4. Add the three assertions above
5. Regenerate all 17 cards
6. Push, re-run the suite against a fresh preview
7. In `CLAUDE_HANDOFF.md`, list the paths of 3 regenerated cards — including one with a long Assamese name — so I can view them
8. Do not merge

This is the last blocker I expect on Batch 2.
