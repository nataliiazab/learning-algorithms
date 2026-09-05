// Sliding Window (fixed-size max-sum) — see registry.js for the shared "shape" every algorithm module follows.

// The real implementation, kept as one source of truth. generateSteps()
// below tags every animation frame with the exact line this is "executing"
// (via lineNumber lookups, so the numbers never drift out of sync if the
// code changes) plus a live snapshot of the variables — that's what powers
// the synced code tracer next to the animation.
export const CODE = `function maxSumSubarray(arr, k) {
  // Step 1: build the very first window by adding up its k numbers
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  // that first window is the best one we've seen... so far
  let bestSum = windowSum;

  // Step 2: slide the window one spot at a time
  for (let end = k; end < arr.length; end++) {
    const start = end - k;
    windowSum -= arr[start]; // drop the number leaving on the left
    windowSum += arr[end];   // add the number joining on the right
    bestSum = Math.max(bestSum, windowSum);
  }

  return bestSum;
}

console.log(maxSumSubarray([2, 1, 5, 1, 3, 2], 3));
// → 9  (the window [5, 1, 3] has the biggest sum)`;

const CODE_LINES = CODE.split('\n');
function lineNumber(snippet) {
  const idx = CODE_LINES.findIndex((l) => l.includes(snippet));
  return idx === -1 ? null : idx + 1;
}

// Line numbers, looked up by content so they can never silently drift out
// of sync with the CODE string above.
export const LINE = {
  start: lineNumber('let windowSum = 0'),
  buildAdd: lineNumber('windowSum += arr[i]'),
  bestInit: lineNumber('let bestSum = windowSum'),
  loopFor: lineNumber('for (let end = k'),
  remove: lineNumber('windowSum -= arr[start]'),
  add: lineNumber('windowSum += arr[end]'),
  compare: lineNumber('bestSum = Math.max'),
  ret: lineNumber('return bestSum'),
};

function generateSteps(input, k) {
  const array = [...input];
  const n = array.length;
  const size = Math.min(Math.max(k, 1), n);
  const steps = [];

  const snap = (extra) => ({
    array,
    windowStart: 0,
    windowEnd: size - 1,
    removing: [],
    adding: [],
    building: [],
    currentSum: 0,
    bestSum: null,
    bestStart: null,
    bestEnd: null,
    codeLine: null,
    loop: null,
    vars: {},
    ...extra,
  });

  steps.push(
    snap({
      codeLine: LINE.start,
      vars: { windowSum: 0 },
      message: `Let's find the biggest sum we can get from any ${size} numbers in a row. We'll use a window of size ${size} and slide it across the list — no re-counting needed! First, line 3 sets windowSum to 0.`,
    })
  );

  // Build the first window, one number at a time.
  let sum = 0;
  for (let i = 0; i < size; i++) {
    sum += array[i];
    steps.push(
      snap({
        windowStart: 0,
        windowEnd: i,
        building: [i],
        currentSum: sum,
        codeLine: LINE.buildAdd,
        loop: 'build',
        vars: { i, 'arr[i]': array[i], windowSum: sum },
        message: `Loop 1, round ${i + 1} of ${size}: windowSum += arr[${i}] adds ${array[i]}. Running total so far: ${sum}.`,
      })
    );
  }

  let bestSum = sum;
  let bestStart = 0;
  steps.push(
    snap({
      windowStart: 0,
      windowEnd: size - 1,
      currentSum: sum,
      bestSum,
      bestStart,
      bestEnd: bestStart + size - 1,
      codeLine: LINE.bestInit,
      loop: 'build',
      vars: { windowSum: sum, bestSum: sum },
      message: `Loop 1 is done. Line 9 saves bestSum = windowSum = ${sum} — our very first window is the best one we know about so far. 🏆`,
    })
  );

  for (let start = 1; start + size - 1 < n; start++) {
    const end = start + size - 1;
    const leaving = array[start - 1];
    const entering = array[end];

    sum -= leaving;
    steps.push(
      snap({
        windowStart: start - 1,
        windowEnd: end - 1,
        removing: [start - 1],
        currentSum: sum,
        bestSum,
        bestStart,
        bestEnd: bestStart + size - 1,
        codeLine: LINE.remove,
        loop: 'slide',
        vars: { start: start - 1, end, 'arr[start]': leaving, windowSum: sum },
        message: `Loop 2 is running (end = ${end}). Line 14: windowSum -= arr[${start - 1}] drops ${leaving} from the left edge. Running total: ${sum}.`,
      })
    );

    sum += entering;
    steps.push(
      snap({
        windowStart: start,
        windowEnd: end,
        adding: [end],
        currentSum: sum,
        bestSum,
        bestStart,
        bestEnd: bestStart + size - 1,
        codeLine: LINE.add,
        loop: 'slide',
        vars: { start, end, 'arr[end]': entering, windowSum: sum },
        message: `Line 15: windowSum += arr[${end}] adds ${entering} on the right edge. No need to re-add anything else — new total: ${sum}.`,
      })
    );

    const improved = sum > bestSum;
    if (improved) {
      bestSum = sum;
      bestStart = start;
    }
    steps.push(
      snap({
        windowStart: start,
        windowEnd: end,
        currentSum: sum,
        bestSum,
        bestStart,
        bestEnd: bestStart + size - 1,
        codeLine: LINE.compare,
        loop: 'slide',
        vars: { windowSum: sum, bestSum },
        message: improved
          ? `Line 16: Math.max(bestSum, windowSum) sees ${sum} beats our old best! bestSum updates to ${sum}. 🏆`
          : `Line 16: Math.max(bestSum, windowSum) checks ${sum} against ${bestSum} — not better, so bestSum stays ${bestSum}. We keep sliding.`,
      })
    );
  }

  steps.push(
    snap({
      windowStart: bestStart,
      windowEnd: bestStart + size - 1,
      currentSum: bestSum,
      bestSum,
      bestStart,
      bestEnd: bestStart + size - 1,
      finished: true,
      codeLine: LINE.ret,
      loop: null,
      vars: { bestSum },
      message: `Loop 2 has reached the end of the list. Line 19 returns bestSum: the biggest possible sum of ${size} numbers in a row is ${bestSum}, found starting at index ${bestStart}. 🌟`,
    })
  );

  return steps;
}

export const slidingWindow = {
  slug: 'sliding-window',
  type: 'window',
  title: 'Sliding Window',
  category: 'Sliding Window',
  emoji: '🐛',
  accent: 'honey',
  difficulty: 'Intermediate',
  minutes: 10,
  tagline: 'Find the biggest sum of any k numbers in a row — without re-counting a thing.',
  analogy:
    "Picture your favorite playlist queued up before a party. Each song has an \"energy score,\" and you want the best possible 3-song run to hype up the room — but you can't skip around, you can only play songs that are next to each other in the queue. So you check the first 3 songs' combined energy. Then, instead of re-adding three whole songs for the next group, you just do two quick moves: drop the energy score of the song that's no longer in your 3-song run, and add the score of the next song that just entered it. That tiny move — drop the old edge, add the new edge — is the entire trick behind a sliding window.",
  howItWorks: [
    'Decide how big your window should be — call that size k (in the playlist example, k = 3 songs).',
    'Add up the first k numbers. That’s your starting window sum.',
    'Remember that sum as your best one so far.',
    'Slide the window one step right: subtract the number that just left on the left edge, and add the new number that just joined on the right edge.',
    'Compare the new sum to your best — keep whichever is bigger.',
    'Keep sliding until the window reaches the end of the list. Whatever sum you kept is the biggest possible!',
  ],
  complexity: { best: 'n', average: 'n', worst: 'n', space: '1' },
  complexityPlain: {
    best: 'Even in the best case, we still glance at each number about once — but that’s already wonderfully fast.',
    average: 'Every number gets added exactly once and removed at most once — one smooth pass through the list.',
    worst: 'No matter the numbers inside it, sliding window never redoes work — always roughly one pass, start to finish.',
  },
  defaultInput: [2, 1, 5, 1, 3, 2],
  defaultWindowSize: 3,
  minSize: 5,
  maxSize: 9,
  minValue: 1,
  maxValue: 20,
  minWindow: 2,
  generateSteps,
  code: CODE,
  quiz: [
    {
      question: "What's the main trick behind a sliding window?",
      options: [
        'Recompute the sum from scratch for every window',
        'Reuse the previous sum: remove the old edge, add the new one',
        'Sort the array first',
        'Only ever look at the first k numbers',
      ],
      correctIndex: 1,
      explanation: 'Exactly — sliding window avoids repeating work by updating the running sum instead of rebuilding it every time.',
    },
    {
      question: 'When the window slides one step to the right, which number is removed?',
      options: ['The rightmost number of the new window', 'The leftmost number of the old window', 'A random number inside the window', 'The largest number in the window'],
      correctIndex: 1,
      explanation: 'The window drops its old leftmost number as it shifts, and gains a new rightmost number.',
    },
    {
      question: 'In the code, what does the FIRST loop (the one with `i`) actually do?',
      options: [
        'It slides the window across the whole list',
        'It builds the very first window by adding up its first k numbers',
        'It sorts the array',
        'It prints every number',
      ],
      correctIndex: 1,
      explanation: 'The first loop just runs k times to total up the starting window — the real "sliding" happens in the second loop.',
    },
    {
      question: 'In the SECOND loop, what do `windowSum -= arr[start]` and `windowSum += arr[end]` do together?',
      options: [
        'Nothing — they cancel out',
        'They rebuild the sum completely from scratch',
        'They update the running sum for the new window position: drop the old left edge, add the new right edge',
        'They sort arr[start] and arr[end]',
      ],
      correctIndex: 2,
      explanation: 'That pair of lines is the entire "slide" — one subtraction, one addition, and the sum is correct for the new window.',
    },
    {
      question: 'If the window size k equals the length of the whole list, how many possible windows are there?',
      options: ['Just 1', 'Exactly k', 'n minus 1', 'Infinitely many'],
      correctIndex: 0,
      explanation: 'When the window is as big as the whole list, there’s only one place it can go — covering everything.',
    },
  ],
};
