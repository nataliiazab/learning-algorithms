// ─────────────────────────────────────────────────────────────────────────
// The algorithm registry - the single place you touch to add a new lesson.
//
// Every algorithm module (see bubbleSort.js / insertionSort.js /
// binarySearch.js / slidingWindow.js for real examples) exports an object
// shaped like this:
//
// {
//   slug: 'bubble-sort',        // unique, used in the URL /algorithms/:slug
//   type: 'sort' | 'search' | 'window', // picks which <Visualizer> to render
//   title: 'Bubble Sort',
//   category: 'Sorting',        // groups cards on the home page
//   emoji: '🫧',
//   accent: 'sage',             // a key from lib/accentStyles.js
//   difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
//   minutes: 6,                 // rough time to work through the lesson
//   tagline: 'One short friendly sentence.',
//   analogy: 'A longer, plain-language everyday comparison.',
//   howItWorks: ['Step 1 in plain words', 'Step 2', ...],
//   complexity: { best, average, worst, space },       // e.g. 'n', 'n^2', 'log n'
//   complexityPlain: { best, average, worst },          // plain-language versions
//   defaultInput: [5, 2, 8, 1, 9, 3],
//   minSize / maxSize / minValue / maxValue: bounds for the "try it yourself" controls,
//   defaultTarget: 25,          // search algorithms only
//   defaultWindowSize / minWindow: 3, 2, // window algorithms only
//   generateSteps(input, target?) => [ frame, frame, ... ],
//   code: 'function bubbleSort(arr) { ... }', // optional - a real runnable
//         implementation, shown in a collapsible "see the code" section
//   codeConcepts: { intro, loops: [{ emoji, name, code, explanation }],
//         variables: [{ emoji, name, nickname, explanation }] }, // optional
//         "meet the cast" primer, rendered by <CodeConcepts> before the
//         learner is expected to trace the code themselves
//   conceptGame: [{ term, isCode, answer: 'loop'|'variable'|'pointer',
//         feedback }, ...], // optional - quickfire classification game
//         rendered by <LoopVariableGame>, drilling the vocabulary above
//   quiz: [{ question, options: [...], correctIndex, explanation }, ...],
// }
//
// To add a new algorithm:
//   1. Create lib/algorithms/yourAlgorithm.js following the shape above.
//   2. Import it below and add it to the `algorithms` array.
//   3. If it needs a new kind of visualization, add a `case` in
//      components/visualizers/index.js.
//   4. (Optional) If one idea in the lesson needs extra hands-on repetition
//      beyond the end quiz, add a practice component and register it by
//      `type` in components/exercises/index.js - see SlidingWindowChallenge
//      for an example.
// That's it - the home page, detail page, quiz, and progress tracker all
// pick it up automatically.
// ─────────────────────────────────────────────────────────────────────────

import { slidingWindow } from "./slidingWindow";

// Bubble Sort, Insertion Sort, and Binary Search are written and working
// (lib/algorithms/bubbleSort.js, insertionSort.js, binarySearch.js) but are
// deliberately left out of the catalog for now, so the whole app can focus
// on teaching Sliding Window really well before spreading thin again.
// Bring them back any time by importing and adding them below.
export const algorithms = [slidingWindow];

export function getAlgorithm(slug) {
  return algorithms.find((a) => a.slug === slug);
}

export function getAdjacentAlgorithms(slug) {
  const index = algorithms.findIndex((a) => a.slug === slug);
  if (index === -1) return { prev: null, next: null };
  const prev = algorithms[(index - 1 + algorithms.length) % algorithms.length];
  const next = algorithms[(index + 1) % algorithms.length];
  return { prev, next };
}

export const categories = Array.from(
  new Set(algorithms.map((a) => a.category)),
);
