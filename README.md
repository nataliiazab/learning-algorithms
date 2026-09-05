# 🌱 AlgoGarden

An interactive, beginner-friendly Next.js app for learning algorithms - plain language, playful animation, and hands-on exercises instead of intimidating jargon.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## What's here

The catalog is deliberately narrowed to **one lesson right now - Sliding Window** - so the whole app can go deep instead of spreading thin. (Bubble Sort, Insertion Sort, and Binary Search are fully built and just paused - see "Bringing a lesson back", below.)

The Sliding Window lesson includes:

- A real-life analogy (queuing the best 3-song run in a playlist) that maps directly onto the algorithm.
- An animated step-by-step **visualizer** with play/pause/step/speed controls and a "try it yourself" panel to run it on your own numbers and window size.
- A **synced code tracer** - the actual JavaScript function, with the exact line currently "executing" highlighted and live variable values, moving in lockstep with the animation above it. This is how the two loops actually get explained, not just the concept.
- A collapsible **full code reference** with a one-click copy button.
- A plain-language complexity explainer (no bare Big-O - translated into what it actually means).
- **✍️ Now you write it** - a progressive, tutor-style exercise where you rebuild the real function yourself, one meaningful line at a time, with a hint and instant feedback at each step.
- **🎯 Practice the slide** - an unlimited-retry drill isolating the one move (drop the old edge, add the new edge) that sliding window is built on, with a fresh random puzzle every time.
- A short interactive quiz at the end.
- A friendly mascot ("Sprout") who narrates what's happening throughout.
- Lightweight progress tracking via `localStorage` (no backend needed).
- A warm, natural color palette (sage, terracotta, blush, lavender, honey, cream) and rounded, playful UI - built with Tailwind CSS and Framer Motion.

## Project structure

```
app/                          Next.js App Router pages
  page.js                     Home page (lesson grid)
  algorithms/[slug]/page.js   Algorithm detail page
components/                   Reusable UI (cards, visualizers, quiz, mascot, ...)
lib/algorithms/               The actual algorithm "content" - see below
lib/accentStyles.js           Tailwind class lookup per accent color
lib/progress.js               localStorage progress helpers
```

## Bringing a lesson back

Bubble Sort, Insertion Sort, and Binary Search still exist and work - they're just not imported. To bring one back, open [`lib/algorithms/registry.js`](lib/algorithms/registry.js), import it, and add it to the `algorithms` array. That's the only change needed; the home page grid, detail page, quiz, and progress tracking all pick it up automatically.

## Adding a new algorithm

This project is built so a new lesson is _just data_ - no page or routing changes needed. Open [`lib/algorithms/registry.js`](lib/algorithms/registry.js) for the full contract, but in short:

1. Create `lib/algorithms/yourAlgorithm.js` exporting an object with:
   - metadata (`slug`, `title`, `category`, `emoji`, `accent`, `difficulty`, `tagline`, `analogy`, `howItWorks`, `complexity`, `complexityPlain`, `defaultInput`, size/value bounds)
   - a `generateSteps(input)` function that returns an array of step "frames" for the visualizer - optionally tag each frame with `codeLine` (which line of your `code` it corresponds to) and `vars` (a snapshot of variable values) to get the synced code tracer for free
   - optionally, a `code` string with a real runnable implementation (shown in a collapsible code block, and in the live tracer if frames carry `codeLine`/`vars`)
   - a `quiz` array of multiple-choice questions
2. Import it in `lib/algorithms/registry.js` and add it to the `algorithms` array.
3. If your algorithm needs a new kind of visualization (e.g. a graph or tree instead of bars/cells), add a new component under `components/visualizers/` and register it in `components/visualizers/index.js`.
4. If an idea in the lesson needs extra hands-on repetition beyond the quiz, add one or more practice components under `components/exercises/` and register them by `type` in `components/exercises/index.js` (see `CodeBuilder.jsx` and `SlidingWindowChallenge.jsx` for working examples).

That's it - the home page grid, the detail page, the quiz, and progress tracking all pick up the new algorithm automatically.

## Tech

- Next.js 14 (App Router, plain JavaScript)
- Tailwind CSS (custom natural color palette)
- Framer Motion (animations)
- No backend - everything runs client-side, progress is stored in the browser only.
