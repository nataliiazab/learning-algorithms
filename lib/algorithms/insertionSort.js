// Insertion Sort - see registry.js for the shared "shape" every algorithm module follows.

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
      sortedIndices: [0],
      message: `Here's our hand of cards: ${items.map((i) => i.value).join(", ")}. We'll treat the first card as already "sorted" and pick up one new card at a time.`,
    }),
  );

  for (let i = 1; i < n; i++) {
    steps.push(
      snap({
        comparing: [i],
        sortedIndices: Array.from({ length: i }, (_, k) => k),
        message: `Picking up the next card: ${items[i].value}. Let's slide it left until it finds its spot.`,
      }),
    );
    let j = i;
    while (j > 0 && items[j - 1].value > items[j].value) {
      steps.push(
        snap({
          comparing: [j - 1, j],
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          message: `${items[j - 1].value} is bigger than ${items[j].value}, so we slide ${items[j].value} one step left.`,
        }),
      );
      [items[j - 1], items[j]] = [items[j], items[j - 1]];
      j -= 1;
      steps.push(
        snap({
          swapping: [j, j + 1],
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          message: `Slid it over. Let's keep checking to the left.`,
        }),
      );
    }
    steps.push(
      snap({
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
        message: `${items[j].value} has found its home. The first ${i + 1} cards are now sorted. 🌟`,
      }),
    );
  }

  steps.push(
    snap({
      sortedIndices: items.map((_, idx) => idx),
      message: `That's every card placed! Our hand is perfectly sorted: ${items.map((it) => it.value).join(", ")} 🎉`,
    }),
  );

  return steps;
}

export const insertionSort = {
  slug: "insertion-sort",
  type: "sort",
  title: "Insertion Sort",
  category: "Sorting",
  emoji: "🍃",
  accent: "lavender",
  difficulty: "Beginner",
  minutes: 6,
  tagline: "Sort your numbers the way you sort a hand of playing cards.",
  analogy:
    "Think about sorting a hand of playing cards. You start with one card (already 'sorted' - just one card!). Then you pick up the next card and slide it left, past any bigger cards, until it lands in the right spot. Keep picking up cards one by one, and soon your whole hand is in order.",
  howItWorks: [
    "Treat the very first item as a tiny sorted pile all on its own.",
    "Pick up the next item from the unsorted part.",
    "Slide it left past any bigger neighbors, one step at a time.",
    "Drop it in as soon as the item to its left is smaller (or there is no one left).",
    "Repeat with each remaining item until the whole list is sorted.",
  ],
  complexity: { best: "n", average: "n^2", worst: "n^2", space: "1" },
  complexityPlain: {
    best: "If the list is already sorted, each new card only needs a quick glance - very fast!",
    average:
      "Most cards need to slide back a little bit - still fine for smaller lists.",
    worst:
      "If the list is sorted backwards, every new card has to slide all the way to the front - slower.",
  },
  defaultInput: [6, 3, 7, 2, 5],
  minSize: 4,
  maxSize: 8,
  minValue: 1,
  maxValue: 50,
  generateSteps,
  code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    let j = i - 1;
    // slide bigger neighbors one step to the right
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current; // drop the card into its spot
  }
  return arr;
}

console.log(insertionSort([6, 3, 7, 2, 5]));
// → [2, 3, 5, 6, 7]`,
  quiz: [
    {
      question: "In insertion sort, what do we do with the very first item?",
      options: [
        "Delete it",
        "Treat it as an already-sorted pile of one",
        "Always move it to the end",
        "Compare it to every other item immediately",
      ],
      correctIndex: 1,
      explanation:
        'One item is always "in order" by itself, so it becomes the start of our sorted pile.',
    },
    {
      question: "When we 'pick up' a new card, where does it go?",
      options: [
        "To a random spot",
        "It slides left past bigger cards until it finds its correct spot",
        "It always stays exactly where it was",
        "It swaps with the very first card only",
      ],
      correctIndex: 1,
      explanation:
        "That's the heart of insertion sort - sliding the new item left until everything to its left is smaller or equal.",
    },
    {
      question: "Which is closest to how insertion sort feels in real life?",
      options: [
        "Shuffling a deck randomly",
        "Sorting a hand of playing cards as you pick them up",
        "Rolling dice",
        "Alphabetizing by throwing books in the air",
      ],
      correctIndex: 1,
      explanation:
        "Exactly like sorting a hand of cards - that's the analogy this algorithm is named after in spirit!",
    },
    {
      question:
        "Is insertion sort a good pick for a list that is already almost sorted?",
      options: [
        "Yes - very few cards need to move, so it is fast",
        "No, it always takes the same long time no matter what",
        "It cannot handle sorted lists",
        "It only works on sorted lists",
      ],
      correctIndex: 0,
      explanation:
        "When the list is nearly sorted already, each new item barely has to slide - insertion sort shines here!",
    },
  ],
};
