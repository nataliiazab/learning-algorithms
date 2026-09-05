// Bubble Sort - see registry.js for the shared "shape" every algorithm module follows.

function sortedTailIndices(n, count) {
  return Array.from({ length: count }, (_, k) => n - 1 - k);
}

// Turns a plain number array into step-by-step "frames" a visualizer can
// render one at a time. Each item keeps a stable `id` (its starting index)
// so the UI can smoothly animate items as they move around.
function generateSteps(input) {
  const items = input.map((value, id) => ({ id, value }));
  const n = items.length;
  const steps = [];

  const snap = (extra) => ({
    array: items.map((it) => ({ ...it })),
    comparing: [],
    swapping: [],
    sortedIndices: [],
    ...extra,
  });

  steps.push(
    snap({
      message: `Here's our lineup: ${items.map((i) => i.value).join(", ")}. Let's bubble the biggest numbers to the end, one gentle swap at a time!`,
    }),
  );

  let swappedAny = true;
  let i = 0;
  while (swappedAny && i < n - 1) {
    swappedAny = false;
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push(
        snap({
          comparing: [j, j + 1],
          sortedIndices: sortedTailIndices(n, i),
          message: `Comparing ${items[j].value} and ${items[j + 1].value} - is the left one bigger?`,
        }),
      );
      if (items[j].value > items[j + 1].value) {
        [items[j], items[j + 1]] = [items[j + 1], items[j]];
        swappedAny = true;
        steps.push(
          snap({
            swapping: [j, j + 1],
            sortedIndices: sortedTailIndices(n, i),
            message: `Yes! ${items[j].value} is bigger than ${items[j + 1].value}, so they swap places. 🔄`,
          }),
        );
      } else {
        steps.push(
          snap({
            sortedIndices: sortedTailIndices(n, i),
            message: `Nope - ${items[j].value} is already smaller than ${items[j + 1].value}. No swap needed, moving on!`,
          }),
        );
      }
    }
    i += 1;
    steps.push(
      snap({
        sortedIndices: sortedTailIndices(n, i),
        message: `${items[n - i].value} has floated all the way to its home. 🎉 One more number locked in!`,
      }),
    );
  }

  steps.push(
    snap({
      sortedIndices: items.map((_, idx) => idx),
      message: `All done! Our lineup is perfectly sorted: ${items.map((it) => it.value).join(", ")} 🌟`,
    }),
  );

  return steps;
}

export const bubbleSort = {
  slug: "bubble-sort",
  type: "sort",
  title: "Bubble Sort",
  category: "Sorting",
  emoji: "🫧",
  accent: "sage",
  difficulty: "Beginner",
  minutes: 6,
  tagline: "Bubble the biggest number to the top, one comparison at a time.",
  analogy:
    "Imagine a row of little plants of different heights. You walk down the row and whenever you spot a shorter plant standing right after a taller one, you swap them. Then you walk the whole row again, and again - until you make a full walk with no swaps at all. That's bubble sort: the tallest 'bubble up' to the end, one step at a time.",
  howItWorks: [
    "Look at the first two neighbors in the list.",
    "If the left one is bigger than the right one, swap them.",
    "Move one step to the right and repeat, all the way down the list.",
    'By the end of one full pass, the biggest number has "bubbled" to the very end.',
    "Repeat the whole walk, ignoring the sorted part at the end, until nothing needs swapping anymore.",
  ],
  complexity: { best: "n", average: "n^2", worst: "n^2", space: "1" },
  complexityPlain: {
    best: "If the list is already sorted, bubble sort notices no swaps happen and finishes early - nice and fast!",
    average:
      "Usually, it has to walk the list over and over, comparing most pairs - fine for small lists.",
    worst:
      "If the list is sorted backwards, it has to compare (and swap) almost everything - slow for big lists.",
  },
  defaultInput: [5, 2, 8, 1, 9, 3],
  minSize: 4,
  maxSize: 8,
  minValue: 1,
  maxValue: 50,
  generateSteps,
  code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // swap the neighbors
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted - no need to keep going
  }
  return arr;
}

console.log(bubbleSort([5, 2, 8, 1, 9, 3]));
// → [1, 2, 3, 5, 8, 9]`,
  quiz: [
    {
      question:
        "What does bubble sort do when the left number is bigger than its right neighbor?",
      options: [
        "Swaps them",
        "Deletes the smaller one",
        "Skips both",
        "Restarts the whole list",
      ],
      correctIndex: 0,
      explanation:
        "Exactly - whenever the left neighbor is bigger, they trade places. That single rule is the whole trick!",
    },
    {
      question: "Why is it called 'bubble' sort?",
      options: [
        "Because it uses soap",
        'Because big values slowly float ("bubble up") to the end of the list',
        "Because it sorts bubbles specifically",
        "Because it randomly shuffles first",
      ],
      correctIndex: 1,
      explanation:
        "Just like a bubble rising in water, the largest remaining number rises to its correct spot each pass.",
    },
    {
      question: "How do we know bubble sort is finished?",
      options: [
        "After exactly 2 passes, always",
        "When a full pass happens with zero swaps",
        "When every number is even",
        "It never really finishes",
      ],
      correctIndex: 1,
      explanation:
        "If we walk the whole list and swap nothing, everything must already be in order - done!",
    },
    {
      question:
        "Is bubble sort a fast choice for a huge list of a million numbers?",
      options: [
        "Yes, it scales beautifully",
        "Not really - it compares pairs over and over, which gets slow",
        "Doesn't matter, all sorts are equal",
        "Only if the numbers are negative",
      ],
      correctIndex: 1,
      explanation:
        "Bubble sort is great for learning, but for huge lists it's slow (n² comparisons) - smarter sorts exist for that!",
    },
  ],
};
