// Binary Search - see registry.js for the shared "shape" every algorithm module follows.

function generateSteps(input, target) {
  const array = [...input].sort((a, b) => a - b);
  const steps = [];
  let low = 0;
  let high = array.length - 1;

  const snap = (extra) => ({
    array,
    low,
    high,
    mid: null,
    found: null,
    eliminated: [],
    ...extra,
  });

  steps.push(
    snap({
      message: `We're hunting for ${target} in a sorted lineup. Since it's sorted, we can peek at the middle instead of checking one by one!`,
    }),
  );

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push(
      snap({
        mid,
        message: `Let's check the middle of what's left: index ${mid} holds ${array[mid]}.`,
      }),
    );
    if (array[mid] === target) {
      steps.push(
        snap({
          mid,
          found: mid,
          message: `Found it! ${target} was hiding at index ${mid}. 🎯`,
        }),
      );
      return steps;
    } else if (array[mid] < target) {
      const eliminated = Array.from(
        { length: mid - low + 1 },
        (_, k) => low + k,
      );
      steps.push(
        snap({
          mid,
          eliminated,
          message: `${array[mid]} is smaller than ${target}, so ${target} must be to the right. We toss out the whole left half - no need to check it!`,
        }),
      );
      low = mid + 1;
    } else {
      const eliminated = Array.from(
        { length: high - mid + 1 },
        (_, k) => mid + k,
      );
      steps.push(
        snap({
          mid,
          eliminated,
          message: `${array[mid]} is bigger than ${target}, so ${target} must be to the left. We toss out the whole right half!`,
        }),
      );
      high = mid - 1;
    }
  }

  steps.push(
    snap({
      found: -1,
      message: `We've run out of places to look - ${target} simply isn't in this lineup.`,
    }),
  );
  return steps;
}

export const binarySearch = {
  slug: "binary-search",
  type: "search",
  title: "Binary Search",
  category: "Searching",
  emoji: "🔎",
  accent: "terracotta",
  difficulty: "Beginner",
  minutes: 6,
  tagline: "Find anything in a sorted list by always checking the middle.",
  analogy:
    "Think of looking up a word in a paper dictionary. You don't start at page 1 - you flip to the middle. If your word comes before that page, you only search the first half from now on. If it comes after, you only search the second half. Each guess cuts the pile in half, so you find things shockingly fast - as long as the list is sorted!",
  howItWorks: [
    "Make sure the list is sorted - binary search only works on sorted lists!",
    "Look at the middle item of the current range.",
    "If it matches what you want, you’re done!",
    "If your target is smaller, forget the right half and keep only the left.",
    "If your target is bigger, forget the left half and keep only the right.",
    "Repeat with the smaller range until you find it (or run out of items).",
  ],
  complexity: { best: "1", average: "log n", worst: "log n", space: "1" },
  complexityPlain: {
    best: "If the very first middle guess is correct, we are done instantly!",
    average:
      "Every guess cuts the remaining list in half, so it only takes a handful of guesses even for big lists.",
    worst:
      "Even in the worst case, doubling the list size only adds one more guess - that's the magic of halving!",
  },
  defaultInput: [3, 8, 12, 19, 25, 33, 41, 47],
  minSize: 6,
  maxSize: 10,
  minValue: 1,
  maxValue: 60,
  defaultTarget: 25,
  generateSteps,
  code: `function binarySearch(sortedArr, target) {
  let low = 0;
  let high = sortedArr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedArr[mid] === target) return mid; // found it!
    if (sortedArr[mid] < target) low = mid + 1; // search the right half
    else high = mid - 1; // search the left half
  }
  return -1; // not found
}

console.log(binarySearch([3, 8, 12, 19, 25, 33, 41, 47], 25));
// → 4`,
  quiz: [
    {
      question:
        "What does binary search require that regular (linear) search does not?",
      options: [
        "A sorted list",
        "A list of only even numbers",
        "At least 100 items",
        "A list with no duplicates",
      ],
      correctIndex: 0,
      explanation:
        "Binary search only works because the list is sorted - that’s what lets us safely ignore half the list each time.",
    },
    {
      question:
        "If the middle item is smaller than what we’re looking for, what do we do?",
      options: [
        "Search the left half next",
        "Search the right half next",
        "Start over from index 0",
        "Give up immediately",
      ],
      correctIndex: 1,
      explanation:
        "Since the list is sorted, anything bigger than the middle must live in the right half.",
    },
    {
      question:
        "Why is binary search so much faster than checking every item one by one?",
      options: [
        "It uses more memory to cheat",
        "It cuts the remaining search area in half with every guess",
        "It only searches even indexes",
        "It sorts the list again each time",
      ],
      correctIndex: 1,
      explanation:
        "Halving the possibilities each guess means even a list of a million items takes about 20 guesses, not a million!",
    },
    {
      question:
        "What happens if binary search runs out of range without finding the target?",
      options: [
        "It crashes",
        "It concludes the target is not in the list",
        "It restarts from the middle again",
        "It returns a random index",
      ],
      correctIndex: 1,
      explanation:
        "Once low passes high, there is nowhere left to look - that tells us for certain the value isn’t there.",
    },
  ],
};
