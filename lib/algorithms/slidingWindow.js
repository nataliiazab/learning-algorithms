// Sliding Window (fixed-size max-sum) - see registry.js for the shared "shape" every algorithm module follows.

// The real implementation, kept as one source of truth. Names are chosen
// to match the playlist analogy directly (songScores/songsPerRun/runScore/
// bestRunScore) rather than generic arr/k/windowSum/bestSum - the whole
// point of this lesson is that the code should read like the story, not
// like an abstract math wall. generateSteps() below tags every animation
// frame with the exact line this is "executing" (via lineNumber lookups,
// so the numbers never drift out of sync if the code changes) plus a live
// snapshot of the variables - that's what powers the synced code tracer
// next to the animation.
export const CODE = `function bestSongRun(songScores, songsPerRun) {
  // Step 1: build the very first run by adding up its songsPerRun scores
  let runScore = 0;
  for (let i = 0; i < songsPerRun; i++) {
    runScore += songScores[i];
  }

  // that first run is the best one we've heard... so far
  let bestRunScore = runScore;

  // Step 2: slide the run one spot at a time
  for (let end = songsPerRun; end < songScores.length; end++) {
    const start = end - songsPerRun;
    runScore -= songScores[start]; // drop the song leaving on the left
    runScore += songScores[end];   // add the song joining on the right
    bestRunScore = Math.max(bestRunScore, runScore);
  }

  return bestRunScore;
}

console.log(bestSongRun([2, 1, 5, 1, 3, 2], 3));
// → 9  (the run [5, 1, 3] has the biggest combined score)`;

// The same function, comments translated - identifiers, operators, and
// punctuation stay untouched because they have to remain valid JavaScript.
// Line-for-line identical to CODE above (same blank lines, same order) so
// the `LINE.*` numbers computed below stay correct no matter which one is
// actually being displayed.
const CODE_UK = `function bestSongRun(songScores, songsPerRun) {
  // Крок 1: побудувати найперший прогін, додавши перші songsPerRun рівнів
  let runScore = 0;
  for (let i = 0; i < songsPerRun; i++) {
    runScore += songScores[i];
  }

  // цей перший прогін поки що найкращий, який ми чули...
  let bestRunScore = runScore;

  // Крок 2: ковзати прогоном по одній пісні за раз
  for (let end = songsPerRun; end < songScores.length; end++) {
    const start = end - songsPerRun;
    runScore -= songScores[start]; // прибираємо пісню, що виходить зліва
    runScore += songScores[end];   // додаємо пісню, що приєднується справа
    bestRunScore = Math.max(bestRunScore, runScore);
  }

  return bestRunScore;
}

console.log(bestSongRun([2, 1, 5, 1, 3, 2], 3));
// → 9  (прогін [5, 1, 3] має найбільшу сумарну оцінку)`;

const CODE_LINES = CODE.split("\n");
function lineNumber(snippet) {
  const idx = CODE_LINES.findIndex((l) => l.includes(snippet));
  return idx === -1 ? null : idx + 1;
}

// Line numbers, looked up by content so they can never silently drift out
// of sync with the CODE string above.
export const LINE = {
  start: lineNumber("let runScore = 0"),
  buildAdd: lineNumber("runScore += songScores[i]"),
  bestInit: lineNumber("let bestRunScore = runScore"),
  loopFor: lineNumber("for (let end = songsPerRun"),
  remove: lineNumber("runScore -= songScores[start]"),
  add: lineNumber("runScore += songScores[end]"),
  compare: lineNumber("bestRunScore = Math.max"),
  ret: lineNumber("return bestRunScore"),
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
      vars: { runScore: 0 },
      message: `Let's find the biggest score we can get from any ${size} songs in a row. We'll use a run of size ${size} and slide it across the list - no re-counting needed! First, line 3 sets runScore to 0.`,
    }),
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
        loop: "build",
        vars: { i, "songScores[i]": array[i], runScore: sum },
        message: `Loop 1, round ${i + 1} of ${size}: runScore += songScores[${i}] adds ${array[i]}. Running total so far: ${sum}.`,
      }),
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
      loop: "build",
      vars: { runScore: sum, bestRunScore: sum },
      message: `Loop 1 is done. Line 9 saves bestRunScore = runScore = ${sum} - our very first run is the best one we know about so far. 🏆`,
    }),
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
        loop: "slide",
        vars: {
          start: start - 1,
          end,
          "songScores[start]": leaving,
          runScore: sum,
        },
        message: `Loop 2 is running (end = ${end}). Line 14: runScore -= songScores[${start - 1}] drops ${leaving} from the left edge. Running total: ${sum}.`,
      }),
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
        loop: "slide",
        vars: { start, end, "songScores[end]": entering, runScore: sum },
        message: `Line 15: runScore += songScores[${end}] adds ${entering} on the right edge. No need to re-add anything else - new total: ${sum}.`,
      }),
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
        loop: "slide",
        vars: { runScore: sum, bestRunScore: bestSum },
        message: improved
          ? `Line 16: Math.max(bestRunScore, runScore) sees ${sum} beats our old best! bestRunScore updates to ${sum}. 🏆`
          : `Line 16: Math.max(bestRunScore, runScore) checks ${sum} against ${bestSum} - not better, so bestRunScore stays ${bestSum}. We keep sliding.`,
      }),
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
      vars: { bestRunScore: bestSum },
      message: `Loop 2 has reached the end of the list. Line 19 returns bestRunScore: the biggest possible score of ${size} songs in a row is ${bestSum}, found starting at index ${bestStart}. 🌟`,
    }),
  );

  return steps;
}

export const slidingWindow = {
  slug: "sliding-window",
  type: "window",
  title: "Sliding Window",
  category: "Sliding Window",
  emoji: "🐛",
  accent: "honey",
  difficulty: "Intermediate",
  minutes: 10,
  tagline:
    "Find the biggest score of any songsPerRun songs in a row - without re-counting a thing.",
  analogy:
    "Picture your favorite playlist queued up before a party. Each song has an \"energy score,\" and you want the best possible 3-song run to hype up the room - but you can't skip around, you can only play songs that are next to each other in the queue. So you check the first 3 songs' combined energy. Then, instead of re-adding three whole songs for the next group, you just do two quick moves: drop the energy score of the song that's no longer in your 3-song run, and add the score of the next song that just entered it. That tiny move - drop the old edge, add the new edge - is the entire trick behind a sliding window.",
  howItWorks: [
    "Decide how many songs fit in a run at once - the code calls this songsPerRun (in our example, songsPerRun = 3).",
    "Add up the scores of the first songsPerRun songs. That's your starting runScore.",
    "Remember that score as your bestRunScore so far.",
    "Slide the run one step right: subtract the score that just left on the left edge, and add the new score that just joined on the right edge.",
    "Compare the new runScore to your bestRunScore - keep whichever is bigger.",
    "Keep sliding until you reach the end of the list. Whatever score you kept in bestRunScore is the biggest possible!",
  ],
  complexity: { best: "n", average: "n", worst: "n", space: "1" },
  complexityPlain: {
    best: "Even in the best case, we still glance at each number about once - but that’s already wonderfully fast.",
    average:
      "Every number gets added exactly once and removed at most once - one smooth pass through the list.",
    worst:
      "No matter the numbers inside it, sliding window never redoes work - always roughly one pass, start to finish.",
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
  // A linear, worked-through explanation using one fixed example
  // ([2, 1, 5, 1, 3, 2], songsPerRun = 3 - the same example CodeBuilder
  // uses) so the numbers in every table below are real and checkable by
  // hand. This is the direct answer to "I still don't get the loops and
  // variables": no clicking required, just a tutor walking through it
  // round by round.
  walkthrough: {
    title: "📖 Let's read the code together, step by step",
    intro:
      "We'll use one example the whole way through: the song scores [2, 1, 5, 1, 3, 2] with songsPerRun = 3. Every number below is real - you can check it with a calculator if you want.",
    parts: [
      {
        heading: "Part 1 - Wait, what even ARE songScores and songsPerRun?",
        paragraphs: [
          "Before we talk about anything happening INSIDE the function, let's clear up the two names sitting in the parentheses: function bestSongRun(songScores, songsPerRun). These are called parameters - they're just placeholders for whatever you hand the function when you call it.",
          "When you write bestSongRun([2, 1, 5, 1, 3, 2], 3), you're saying: 'let songScores be the list [2, 1, 5, 1, 3, 2], and let songsPerRun be the number 3.' From that point on, anywhere the code says songScores, it means that exact list. Anywhere it says songsPerRun, it means that exact number, 3.",
          "So songScores isn't some special magic word - it's just a label WE chose for \"the list of numbers this function was given.\" We could have called it anything (numbers, list, playlist) - songScores just reminds us what those numbers represent in our story: one energy score per song.",
        ],
        note: "Try it: if you called bestSongRun([10, 20, 30], 2) instead, songScores would be [10, 20, 30] and songsPerRun would be 2 - same code, completely different numbers plugged in.",
      },
      {
        heading: "Part 2 - What's a variable, really?",
        paragraphs: [
          "Let's slow all the way down. A variable is just a labeled box that holds one value - and that value is allowed to change over time. In our code, runScore is a variable. Right now, imagine an empty box labeled runScore with a 0 written inside it.",
          "Every time we write runScore += something, we're not creating a new box - we're opening the SAME box, adding a number to whatever's already inside, and writing the new total back in. That's the entire idea of a variable: one labeled box, one value at a time, updated whenever we say so.",
        ],
      },
      {
        heading: "Part 3 - How does a for-loop actually run?",
        paragraphs: [
          "A for-loop looks intimidating because it packs three instructions into one line, separated by semicolons: for (let i = 0; i < songsPerRun; i++) { ... }",
          "1️⃣ let i = 0 - before anything else happens, create a counter named i and set it to 0.",
          "2️⃣ i < songsPerRun - this is the bouncer at the door. Before EVERY round, it checks: is i still less than songsPerRun? If yes, the round happens. If no, stop immediately - don't even start another round.",
          "3️⃣ i++ - after each round finishes, add 1 to i. Then go back and ask the bouncer again.",
          "That's genuinely all a for-loop is: start somewhere, check a yes/no question before each round, do something, take one step, check again. Let's watch it happen for real (songsPerRun = 3):",
        ],
        table: {
          columns: [
            "Round",
            "i",
            "Is i < 3?",
            "What happens",
            "runScore after",
          ],
          rows: [
            [
              "1",
              "0",
              "0 < 3 → yes",
              "runScore += songScores[0] = 2",
              "0 + 2 = 2",
            ],
            [
              "2",
              "1",
              "1 < 3 → yes",
              "runScore += songScores[1] = 1",
              "2 + 1 = 3",
            ],
            [
              "3",
              "2",
              "2 < 3 → yes",
              "runScore += songScores[2] = 5",
              "3 + 5 = 8",
            ],
            ["-", "3", "3 < 3 → NO, stop", "(loop ends here)", "stays 8"],
          ],
        },
        note: "Notice i only ever exists to count rounds - it never appears anywhere else in the code. By the time the loop stops, runScore = 8 (that's 2 + 1 + 5, the first 3 song scores).",
      },
      {
        heading: "Part 4 - Why do we need a SECOND variable, bestRunScore?",
        paragraphs: [
          "Here's the part that trips people up: runScore is about to keep changing as we slide through the rest of the playlist. If we only had runScore, we'd lose track of how good our earlier runs were - each new value would just overwrite the last.",
          "So right after the first loop, we make a copy: let bestRunScore = runScore;. Think of it like writing today's high score on a whiteboard before you keep playing a game. runScore keeps playing and changing. bestRunScore just stands next to the whiteboard, only updating the number when someone actually beats the current record.",
          "Right now: runScore = 8, and bestRunScore = 8 too - they start out equal, because our very first run IS the best one we've heard so far (it's the ONLY one we've heard so far).",
        ],
      },
      {
        heading: "Part 5 - The second loop: sliding, one song at a time",
        paragraphs: [
          "for (let end = songsPerRun; end < songScores.length; end++) follows the exact same three-part pattern as before - start end at songsPerRun, keep going while end is less than the playlist's length, add 1 to end each round.",
          "Inside, const start = end - songsPerRun; - start is never given its own counting rule; it's always calculated as \"songsPerRun steps behind end.\" That's because the run is always exactly songsPerRun songs wide, so once you know where the right edge (end) is, the left edge (start) is automatically songsPerRun steps to the left.",
          "Each round does the SAME two moves: subtract the score leaving on the left (songScores[start]), add the score joining on the right (songScores[end]). Then it checks: did this new runScore just beat bestRunScore? Let's trace every round for real:",
        ],
        table: {
          columns: [
            "Round",
            "end",
            "start (end − 3)",
            "Leaving: songScores[start]",
            "Entering: songScores[end]",
            "runScore: before → after",
            "New best?",
          ],
          rows: [
            ["1", "3", "0", "2", "1", "8 − 2 + 1 = 7", "7 < 8 → no"],
            [
              "2",
              "4",
              "1",
              "1",
              "3",
              "7 − 1 + 3 = 9",
              "9 > 8 → YES, bestRunScore = 9",
            ],
            ["3", "5", "2", "5", "2", "9 − 5 + 2 = 6", "6 < 9 → no"],
          ],
        },
        note: "bestRunScore only changed once - on the round where 9 beat 8. Every other round, runScore changed, but bestRunScore quietly stayed exactly the same.",
      },
      {
        heading: "Part 6 - Quick reference: what's used, and why",
        table: {
          columns: ["Variable", "Lives in", "Why it exists", "Changes when..."],
          rows: [
            [
              "songScores",
              "the whole function (a parameter)",
              "The actual list of numbers you handed the function",
              "Never - parameters just get read, they don't change",
            ],
            [
              "songsPerRun",
              "the whole function (a parameter)",
              "The run size, chosen by whoever calls the function",
              "Never - stays fixed for the whole function call",
            ],
            [
              "runScore",
              "both loops",
              "Tracks the score of whatever songs are in the run RIGHT NOW",
              "Every single round",
            ],
            [
              "bestRunScore",
              "set after loop 1, updated in loop 2",
              "Remembers the best runScore ever seen",
              "Only when runScore beats it",
            ],
            [
              "i",
              "loop 1 only",
              "Walks through positions 0..songsPerRun-1 to build the first run",
              "Every round of loop 1, then gone for good",
            ],
            [
              "end",
              "loop 2 only",
              "Marks the new right edge sliding into the run",
              "Every round of loop 2",
            ],
            [
              "start",
              "loop 2 only",
              "Marks the old left edge sliding out of the run",
              "Automatically, since start = end − songsPerRun",
            ],
          ],
        },
      },
    ],
    closing:
      "That's the whole algorithm: two loops, two running totals, and one rule (Math.max) that only updates the record when it's actually broken. Scroll back up and watch the animation again - it should look completely different now.",
  },
  // Content for the "meet the cast" explainer and the loop/variable
  // classification game - both optional fields, rendered only when present.
  codeConcepts: {
    intro:
      "Before we trace the code line by line, let's actually meet the two loops and the handful of variables that make this whole thing tick. Once you know who's who, the code stops looking like a wall of symbols.",
    loops: [
      {
        emoji: "🏗️",
        name: 'Loop 1 - "The Builder"',
        code: "for (let i = 0; i < songsPerRun; i++)",
        explanation:
          "Runs exactly songsPerRun times, adding one song's score each round. It's queuing up the first songsPerRun songs before anything ever starts moving.",
      },
      {
        emoji: "🚶",
        name: 'Loop 2 - "The Walker"',
        code: "for (let end = songsPerRun; end < songScores.length; end++)",
        explanation:
          "Runs once for every position still left to check, sliding the run forward one song at a time - like someone walking down a hallway, dropping the flyer behind them and grabbing a new one ahead.",
      },
    ],
    variables: [
      {
        emoji: "🎵",
        name: "songScores",
        nickname: "The Playlist",
        explanation:
          "This is simply the list of numbers you hand the function - like [2, 1, 5, 1, 3, 2]. Each number is one song's energy score, in order. It's called a parameter: a value you provide when you call the function, and it never changes while the function runs.",
      },
      {
        emoji: "🔢",
        name: "songsPerRun",
        nickname: "The Run Size",
        explanation:
          "How many songs count as one run - you choose this number before calling the function, like 3. It's also a parameter, fixed for the whole function call.",
      },
      {
        emoji: "🫙",
        name: "runScore",
        nickname: "The Tally Jar",
        explanation:
          "Holds the running total of whatever songs are currently in the run. It never stops changing - pour a new score in, scoop an old one out.",
      },
      {
        emoji: "🏆",
        name: "bestRunScore",
        nickname: "The Trophy Keeper",
        explanation:
          "Only updates when runScore beats it. The rest of the time it just sits there, quietly holding onto the record.",
      },
      {
        emoji: "👶",
        name: "i",
        nickname: "The Newborn Counter",
        explanation:
          "Only exists inside Loop 1, counting 0, 1, 2... up to songsPerRun. The moment that loop ends, i vanishes for good - it never shows up again.",
      },
      {
        emoji: "👉",
        name: "end",
        nickname: "The Right Bookend",
        explanation:
          "Always points at the newest song sliding INTO the run, on the right.",
      },
      {
        emoji: "👈",
        name: "start",
        nickname: "The Left Bookend",
        explanation:
          "Always points at the oldest song about to slide OUT, on the left. It's always exactly songsPerRun steps behind end.",
      },
    ],
  },
  conceptGame: [
    {
      term: "runScore",
      isCode: false,
      answer: "variable",
      feedback: "Yep - that's the Tally Jar, holding our running total.",
    },
    {
      term: "for (let i = 0; i < songsPerRun; i++)",
      isCode: true,
      answer: "loop",
      feedback: "Right - the Builder loop, repeating songsPerRun times.",
    },
    {
      term: "bestRunScore",
      isCode: false,
      answer: "variable",
      feedback: "Correct - the Trophy Keeper, remembering our best score.",
    },
    {
      term: "for (let end = songsPerRun; end < songScores.length; end++)",
      isCode: true,
      answer: "loop",
      feedback: "Yes - the Walker loop, one lap per remaining position.",
    },
    {
      term: "end",
      isCode: false,
      answer: "pointer",
      feedback:
        "That's a pointer - it marks WHERE we are, not a running total.",
    },
    {
      term: "start",
      isCode: false,
      answer: "pointer",
      feedback: "Exactly, another pointer - marking the run's left edge.",
    },
  ],
  // Content for the "write it yourself" exercise. `matchSnippet`/`correct`/
  // `choices` are real code, so they never change between locales - only
  // `tutorPrompt`/`explanation` get overridden in `translations`.
  codeBuilder: {
    blanks: [
      {
        matchSnippet: "runScore += songScores[i]",
        correct: "    runScore += songScores[i];",
        choices: [
          "    runScore += songScores[i];",
          "    runScore = songScores[i];",
          "    runScore += songScores[songsPerRun];",
          "    runScore += i;",
        ],
        tutorPrompt:
          "We're inside the FIRST loop, building the very first run. Each round through, we need to add one more song's score into our running total. Which line does that?",
        explanation:
          "Right! `+=` keeps adding onto our running total, and `songScores[i]` is the score at the loop's current position - not `songScores[songsPerRun]`, which would grab the same one score every single round.",
      },
      {
        matchSnippet: "let bestRunScore = runScore",
        correct: "  let bestRunScore = runScore;",
        choices: [
          "  let bestRunScore = runScore;",
          "  let bestRunScore = 0;",
          "  let bestRunScore = songScores[0];",
          "  let bestRunScore = songsPerRun;",
        ],
        tutorPrompt:
          "Loop 1 just finished, so runScore now holds the total of our very first run. What should we remember as the best score found so far?",
        explanation:
          "Exactly - before we've compared anything else, our only run is the best one we've heard, so `bestRunScore` starts out equal to `runScore`.",
      },
      {
        matchSnippet: "runScore -= songScores[start]",
        correct:
          "    runScore -= songScores[start]; // drop the song leaving on the left",
        choices: [
          "    runScore -= songScores[start]; // drop the song leaving on the left",
          "    runScore -= songScores[end]; // drop the song leaving on the left",
          "    runScore += songScores[start]; // drop the song leaving on the left",
          "    runScore -= songScores[songsPerRun]; // drop the song leaving on the left",
        ],
        tutorPrompt:
          "Now we're sliding. The run is about to move one song right, so the song at the very left edge (index `start`) falls out. What do we do to runScore?",
        explanation:
          "`start` is the index that is leaving the run, so we subtract `songScores[start]` - that one subtraction is the whole trick that makes sliding window fast!",
      },
      {
        matchSnippet: "runScore += songScores[end]",
        correct:
          "    runScore += songScores[end];   // add the song joining on the right",
        choices: [
          "    runScore += songScores[end];   // add the song joining on the right",
          "    runScore += songScores[start];   // add the song joining on the right",
          "    runScore -= songScores[end];   // add the song joining on the right",
          "    runScore += end;   // add the song joining on the right",
        ],
        tutorPrompt:
          "At the same time, a brand-new song is joining the run on the right, at index `end`. What do we do with its score?",
        explanation:
          "We add `songScores[end]` because that's the new song's score that just entered the run on the right edge.",
      },
      {
        matchSnippet: "bestRunScore = Math.max",
        correct: "    bestRunScore = Math.max(bestRunScore, runScore);",
        choices: [
          "    bestRunScore = Math.max(bestRunScore, runScore);",
          "    bestRunScore = Math.min(bestRunScore, runScore);",
          "    bestRunScore = runScore;",
          "    bestRunScore = bestRunScore + runScore;",
        ],
        tutorPrompt:
          "runScore is now up to date for this new run. How do we check whether it just beat the best one we found before?",
        explanation:
          "`Math.max` keeps whichever of the two is bigger - so `bestRunScore` only changes when we've genuinely found a new champion run.",
      },
    ],
  },
  // Tiny single-question checks dropped into specific lesson stages (not a
  // whole quiz flow) - "does this one idea make sense yet?" before moving on.
  quickChecks: {
    inputs: {
      question:
        "If we call bestSongRun([10, 20, 30], 2), what does songsPerRun equal?",
      options: ["10", "20", "2", "30"],
      correctIndex: 2,
      explanation:
        "songsPerRun is the second thing you pass in - here, that's 2.",
    },
    bestScore: {
      question:
        "Why can't we just keep using runScore alone, without bestRunScore?",
      options: [
        "Because runScore keeps changing as we slide, so it can't also remember the best score from earlier",
        "Because JavaScript doesn't allow reusing a variable",
        "Because runScore can only hold one digit",
        "There's no real reason, it's just a style choice",
      ],
      correctIndex: 0,
      explanation:
        'Exactly - runScore is always "right now." We need a second variable to remember "best ever."',
    },
  },
  quiz: [
    {
      question: "What's the main trick behind a sliding window?",
      options: [
        "Recompute the score from scratch for every run",
        "Reuse the previous score: remove the old edge, add the new one",
        "Sort the playlist first",
        "Only ever look at the first songsPerRun songs",
      ],
      correctIndex: 1,
      explanation:
        "Exactly - sliding window avoids repeating work by updating the running total instead of rebuilding it every time.",
    },
    {
      question:
        "When the run slides one step to the right, which song's score is removed?",
      options: [
        "The rightmost song of the new run",
        "The leftmost song of the old run",
        "A random song inside the run",
        "The highest-scoring song in the run",
      ],
      correctIndex: 1,
      explanation:
        "The run drops its old leftmost song as it shifts, and gains a new rightmost song.",
    },
    {
      question:
        "In the code, what does the FIRST loop (the one with `i`) actually do?",
      options: [
        "It slides the run across the whole playlist",
        "It builds the very first run by adding up its first songsPerRun scores",
        "It sorts the playlist",
        "It prints every song",
      ],
      correctIndex: 1,
      explanation:
        'The first loop just runs songsPerRun times to total up the starting run - the real "sliding" happens in the second loop.',
    },
    {
      question:
        "In the SECOND loop, what do `runScore -= songScores[start]` and `runScore += songScores[end]` do together?",
      options: [
        "Nothing - they cancel out",
        "They rebuild the score completely from scratch",
        "They update the running total for the new run: drop the old left edge, add the new right edge",
        "They sort songScores[start] and songScores[end]",
      ],
      correctIndex: 2,
      explanation:
        'That pair of lines is the entire "slide" - one subtraction, one addition, and the total is correct for the new run.',
    },
    {
      question:
        "If songsPerRun equals the length of the whole playlist, how many possible runs are there?",
      options: [
        "Just 1",
        "Exactly songsPerRun",
        "n minus 1",
        "Infinitely many",
      ],
      correctIndex: 0,
      explanation:
        "When the run is as big as the whole playlist, there’s only one place it can go - covering everything.",
    },
  ],
  translations: {
    uk: {
      title: "Ковзне вікно",
      category: "Ковзне вікно",
      code: CODE_UK,
      tagline:
        "Знайди найбільший рахунок будь-яких songsPerRun пісень поспіль - без жодного повторного підрахунку.",
      analogy:
        'Уяви свій улюблений плейлист перед вечіркою. У кожної пісні є "рівень енергії", і ти хочеш знайти найкращі 3 пісні поспіль, щоб завести танцпол - але перескакувати не можна, можна грати лише пісні, що йдуть одна за одною в черзі. Тож ти перевіряєш сумарну енергію перших 3 пісень. А потім, замість того щоб знову складати три нові пісні, ти робиш два швидкі кроки: прибираєш рівень енергії пісні, яка щойно випала з твоєї трійки, і додаєш рівень пісні, яка щойно до неї приєдналась. Цей маленький рух - прибрати старий край, додати новий - і є весь секрет ковзного вікна.',
      howItWorks: [
        "Вирішіть, скільки пісень входить в один прогін одразу - у коді це називається songsPerRun (у нашому прикладі songsPerRun = 3).",
        "Додайте рівні енергії перших songsPerRun пісень. Це і буде початкова runScore.",
        "Запам'ятайте цю суму як найкращу (bestRunScore) на даний момент.",
        "Зсуньте прогін на один крок вправо: відніміть рівень пісні, яка щойно вийшла зліва, і додайте рівень нової пісні, яка щойно приєдналась справа.",
        "Порівняйте нову runScore з bestRunScore - залишіть ту, що більша.",
        "Продовжуйте ковзати, доки не дійдете до кінця списку. Значення, яке лишилось у bestRunScore, і є найбільшим можливим!",
      ],
      complexityPlain: {
        best: "Навіть у найкращому випадку ми все одно поглядаємо на кожне число приблизно раз - але це вже чудово швидко.",
        average:
          "Кожне число додається рівно один раз і прибирається щонайбільше один раз - один плавний прохід по списку.",
        worst:
          "Незалежно від чисел усередині, ковзне вікно ніколи не повторює роботу - завжди приблизно один прохід від початку до кінця.",
      },
      walkthrough: {
        title: "Прочитаймо код разом, крок за кроком",
        intro:
          "Ми будемо використовувати один приклад від початку до кінця: рівні енергії пісень [2, 1, 5, 1, 3, 2] з songsPerRun = 3. Кожне число нижче справжнє - можеш перевірити калькулятором, якщо хочеш.",
        parts: [
          {
            heading:
              "Частина 1 - Зачекай, що взагалі таке songScores і songsPerRun?",
            paragraphs: [
              "Перш ніж говорити про те, що відбувається ВСЕРЕДИНІ функції, розберімось із двома назвами в дужках: function bestSongRun(songScores, songsPerRun). Це називається параметрами - вони просто є заповнювачами для того, що ти передаси функції, коли її викличеш.",
              "Коли ти пишеш bestSongRun([2, 1, 5, 1, 3, 2], 3), ти кажеш: «нехай songScores буде списком [2, 1, 5, 1, 3, 2], а songsPerRun буде числом 3». Відтепер, де б у коді не траплялось songScores, це означає саме цей список. Де б не траплялось songsPerRun, це означає саме це число, 3.",
              'Тож songScores - це не якесь магічне слово, а просто назва, яку МИ обрали для "списку чисел, який отримала ця функція". Ми могли б назвати його як завгодно (numbers, list, playlist) - songScores просто нагадує нам, що означають ці числа в нашій історії: один рівень енергії на пісню.',
            ],
            note: "Спробуй: якби ти викликав(ла) bestSongRun([10, 20, 30], 2), songScores дорівнював би [10, 20, 30], а songsPerRun - 2. Той самий код, зовсім інші підставлені числа.",
          },
          {
            heading: "Частина 2 - Що таке змінна, насправді?",
            paragraphs: [
              "Зупинімось і розберемось повільно. Змінна - це просто підписана коробка, яка тримає одне значення, і це значення може змінюватись з часом. У нашому коді runScore - це змінна. Уяви собі порожню коробку з написом runScore, а всередині написано 0.",
              "Щоразу, коли ми пишемо runScore += щось, ми не створюємо нову коробку - ми відкриваємо ТУ САМУ коробку, додаємо число до того, що вже всередині, і записуємо нову суму назад. Це і є вся суть змінної: одна підписана коробка, одне значення за раз, яке оновлюється, коли ми цього хочемо.",
            ],
          },
          {
            heading: "Частина 3 - Як насправді виконується цикл for?",
            paragraphs: [
              "Цикл for виглядає лячно, бо вміщує три інструкції в один рядок, розділені крапкою з комою: for (let i = 0; i < songsPerRun; i++) { ... }",
              "1️⃣ let i = 0 - перш ніж щось інше відбудеться, створюємо лічильник i і встановлюємо його на 0.",
              "2️⃣ i < songsPerRun - це охоронець біля дверей. Перед КОЖНИМ раундом він перевіряє: чи i все ще менше за songsPerRun? Якщо так - раунд відбувається. Якщо ні - зупиняємось одразу, навіть не починаючи ще один раунд.",
              "3️⃣ i++ - після завершення кожного раунду додаємо 1 до i. Потім знову питаємо охоронця.",
              "Це справді все, чим є цикл for: почати десь, перевірити питання так/ні перед кожним раундом, щось зробити, зробити один крок, перевірити знову. Подивимось, як це відбувається насправді (songsPerRun = 3):",
            ],
            table: {
              columns: [
                "Раунд",
                "i",
                "Чи i < 3?",
                "Що відбувається",
                "runScore після",
              ],
              rows: [
                [
                  "1",
                  "0",
                  "0 < 3 → так",
                  "runScore += songScores[0] = 2",
                  "0 + 2 = 2",
                ],
                [
                  "2",
                  "1",
                  "1 < 3 → так",
                  "runScore += songScores[1] = 1",
                  "2 + 1 = 3",
                ],
                [
                  "3",
                  "2",
                  "2 < 3 → так",
                  "runScore += songScores[2] = 5",
                  "3 + 5 = 8",
                ],
                [
                  "-",
                  "3",
                  "3 < 3 → НІ, стоп",
                  "(цикл зупиняється тут)",
                  "лишається 8",
                ],
              ],
            },
            note: "Зверни увагу, що i існує лише для підрахунку раундів - більше ніде в коді він не з'являється. Коли цикл зупиняється, runScore = 8 (це 2 + 1 + 5, перші 3 рівні енергії).",
          },
          {
            heading: "Частина 4 - Навіщо потрібна ДРУГА змінна, bestRunScore?",
            paragraphs: [
              "Ось де людей заплутує: runScore от-от почне постійно змінюватись, поки ми ковзаємо по решті плейлиста. Якби була лише runScore, ми б втратили інформацію про те, наскільки хорошими були попередні прогони - кожне нове значення просто перезаписувало б попереднє.",
              "Тому одразу після першого циклу ми робимо копію: let bestRunScore = runScore;. Уяви, ніби записуєш сьогоднішній рекорд на дошці, перш ніж продовжити гру. runScore продовжує грати і змінюватись. bestRunScore просто стоїть біля дошки, оновлюючи число лише тоді, коли хтось справді б'є поточний рекорд.",
              "Зараз: runScore = 8, і bestRunScore теж = 8 - вони починаються однаковими, бо наш найперший прогін і Є найкращим, який ми чули (він ЄДИНИЙ, який ми поки що чули).",
            ],
          },
          {
            heading: "Частина 5 - Другий цикл: ковзання, пісня за піснею",
            paragraphs: [
              "for (let end = songsPerRun; end < songScores.length; end++) працює за тим самим принципом із трьох частин - почати end з songsPerRun, продовжувати, поки end менше за довжину плейлиста, додавати 1 до end щоразу.",
              'Всередині const start = end - songsPerRun; - start ніколи не має власного правила підрахунку, він завжди обчислюється як "на songsPerRun кроків позаду end". Це тому, що прогін завжди рівно songsPerRun пісень завширшки, тож щойно ти знаєш, де правий край (end), лівий край (start) автоматично на songsPerRun кроків лівіше.',
              "Кожен раунд робить ОДНІ Й ТІ САМІ два рухи: віднімає рівень пісні, що виходить зліва (songScores[start]), додає рівень пісні, що приєднується справа (songScores[end]). Потім перевіряє: чи нова runScore щойно перевершила bestRunScore? Простежмо кожен раунд насправді:",
            ],
            table: {
              columns: [
                "Раунд",
                "end",
                "start (end − 3)",
                "Виходить: songScores[start]",
                "Заходить: songScores[end]",
                "runScore: до → після",
                "Новий рекорд?",
              ],
              rows: [
                ["1", "3", "0", "2", "1", "8 − 2 + 1 = 7", "7 < 8 → ні"],
                [
                  "2",
                  "4",
                  "1",
                  "1",
                  "3",
                  "7 − 1 + 3 = 9",
                  "9 > 8 → ТАК, bestRunScore = 9",
                ],
                ["3", "5", "2", "5", "2", "9 − 5 + 2 = 6", "6 < 9 → ні"],
              ],
            },
            note: "bestRunScore змінився лише один раз - у раунді, де 9 перевершило 8. Кожного іншого разу runScore змінювався, а bestRunScore спокійно лишався таким самим.",
          },
          {
            heading: "Частина 6 - Швидка довідка: що використовується і навіщо",
            table: {
              columns: [
                "Змінна",
                "Живе в",
                "Навіщо існує",
                "Змінюється, коли...",
              ],
              rows: [
                [
                  "songScores",
                  "уся функція (параметр)",
                  "Список чисел, який отримала функція",
                  "Ніколи - параметри просто читаються, а не змінюються",
                ],
                [
                  "songsPerRun",
                  "уся функція (параметр)",
                  "Розмір прогону, обраний тим, хто викликає функцію",
                  "Ніколи - лишається незмінним протягом усього виклику",
                ],
                [
                  "runScore",
                  "обох циклах",
                  "Відстежує суму пісень, що ЗАРАЗ у прогоні",
                  "Кожного раунду",
                ],
                [
                  "bestRunScore",
                  "встановлюється після циклу 1, оновлюється у циклі 2",
                  "Пам'ятає найкращу runScore з усіх",
                  "Лише коли runScore її перевершує",
                ],
                [
                  "i",
                  "лише у циклі 1",
                  "Проходить позиції 0..songsPerRun-1, будуючи перший прогін",
                  "Кожного раунду циклу 1, потім зникає назавжди",
                ],
                [
                  "end",
                  "лише у циклі 2",
                  "Позначає нову пісню, що заходить у прогін справа",
                  "Кожного раунду циклу 2",
                ],
                [
                  "start",
                  "лише у циклі 2",
                  "Позначає стару пісню, що виходить з прогону зліва",
                  "Автоматично, бо start = end − songsPerRun",
                ],
              ],
            },
          },
        ],
        closing:
          "Ось і весь алгоритм: два цикли, дві накопичувальні суми та одне правило (Math.max), яке оновлює рекорд лише тоді, коли його справді побито. Погортай назад і подивись анімацію ще раз - тепер вона має виглядати зовсім інакше.",
      },
      codeConcepts: {
        intro:
          "Перш ніж простежувати код рядок за рядком, познайомимось із двома циклами та кількома змінними, на яких усе тримається. Щойно зрозумієш, хто є хто, код перестане виглядати як стіна символів.",
        loops: [
          {
            emoji: "🏗️",
            name: "Цикл 1 - «Будівельник»",
            code: "for (let i = 0; i < songsPerRun; i++)",
            explanation:
              "Виконується рівно songsPerRun разів, додаючи рівень енергії однієї пісні щоразу. Це наче формування черги з перших songsPerRun пісень, перш ніж щось почне рухатись.",
          },
          {
            emoji: "🚶",
            name: "Цикл 2 - «Мандрівник»",
            code: "for (let end = songsPerRun; end < songScores.length; end++)",
            explanation:
              "Виконується по одному разу для кожної позиції, що залишилась, зсуваючи прогін на одну пісню за раз - наче хтось іде коридором, залишаючи листівку позаду і беручи нову попереду.",
          },
        ],
        variables: [
          {
            emoji: "🫙",
            name: "runScore",
            nickname: "Банка-лічильник",
            explanation:
              "Містить поточну суму пісень, що зараз у прогоні. Постійно змінюється - влий новий рівень, вилий старий.",
          },
          {
            emoji: "🏆",
            name: "bestRunScore",
            nickname: "Хранитель кубка",
            explanation:
              "Оновлюється, лише коли runScore перевершує його. Увесь інший час просто тихо тримає рекорд.",
          },
          {
            emoji: "👶",
            name: "i",
            nickname: "Новонароджений лічильник",
            explanation:
              "Існує лише всередині Циклу 1, рахуючи 0, 1, 2... до songsPerRun. Щойно цикл завершується, i зникає назавжди - більше не з'являється.",
          },
          {
            emoji: "👉",
            name: "end",
            nickname: "Правий обмежувач",
            explanation:
              "Завжди вказує на найновішу пісню, що заходить у прогін справа.",
          },
          {
            emoji: "👈",
            name: "start",
            nickname: "Лівий обмежувач",
            explanation:
              "Завжди вказує на найстарішу пісню, яка от-от вийде з прогону зліва. Він завжди рівно на songsPerRun кроків позаду end.",
          },
        ],
      },
      conceptGame: [
        {
          term: "runScore",
          isCode: false,
          answer: "variable",
          feedback: "Так - це Банка-лічильник, що тримає нашу поточну суму.",
        },
        {
          term: "for (let i = 0; i < songsPerRun; i++)",
          isCode: true,
          answer: "loop",
          feedback:
            "Правильно - цикл Будівельник, що повторюється songsPerRun разів.",
        },
        {
          term: "bestRunScore",
          isCode: false,
          answer: "variable",
          feedback:
            "Вірно - Хранитель кубка, що пам'ятає наш найкращий результат.",
        },
        {
          term: "for (let end = songsPerRun; end < songScores.length; end++)",
          isCode: true,
          answer: "loop",
          feedback:
            "Так - цикл Мандрівник, одне коло на кожну позицію, що залишилась.",
        },
        {
          term: "end",
          isCode: false,
          answer: "pointer",
          feedback: "Це вказівник - він показує, ДЕ ми зараз, а не суму.",
        },
        {
          term: "start",
          isCode: false,
          answer: "pointer",
          feedback: "Точно, ще один вказівник - позначає лівий край прогону.",
        },
      ],
      codeBuilder: {
        blanks: [
          {
            matchSnippet: "runScore += songScores[i]",
            correct: "    runScore += songScores[i];",
            choices: [
              "    runScore += songScores[i];",
              "    runScore = songScores[i];",
              "    runScore += songScores[songsPerRun];",
              "    runScore += i;",
            ],
            tutorPrompt:
              "Ми всередині ПЕРШОГО циклу, будуємо найперший прогін. На кожному кроці потрібно додати ще один рівень енергії до нашої накопиченої суми. Який рядок це робить?",
            explanation:
              "Правильно! `+=` продовжує додавати до нашої суми, а `songScores[i]` - це рівень на поточній позиції циклу, а не `songScores[songsPerRun]`, яке щоразу брало б той самий один рівень.",
          },
          {
            matchSnippet: "let bestRunScore = runScore",
            correct: "  let bestRunScore = runScore;",
            choices: [
              "  let bestRunScore = runScore;",
              "  let bestRunScore = 0;",
              "  let bestRunScore = songScores[0];",
              "  let bestRunScore = songsPerRun;",
            ],
            tutorPrompt:
              "Цикл 1 щойно завершився, тож runScore тепер містить суму нашого найпершого прогону. Що нам варто запам'ятати як найкращу суму на даний момент?",
            explanation:
              "Саме так - поки що ми ще нічого не порівнювали, тож наш єдиний прогін і є найкращим, який ми чули, тому `bestRunScore` спочатку дорівнює `runScore`.",
          },
          {
            matchSnippet: "runScore -= songScores[start]",
            correct:
              "    runScore -= songScores[start]; // прибираємо пісню, що виходить зліва",
            choices: [
              "    runScore -= songScores[start]; // прибираємо пісню, що виходить зліва",
              "    runScore -= songScores[end]; // прибираємо пісню, що виходить зліва",
              "    runScore += songScores[start]; // прибираємо пісню, що виходить зліва",
              "    runScore -= songScores[songsPerRun]; // прибираємо пісню, що виходить зліва",
            ],
            tutorPrompt:
              "Тепер ми ковзаємо. Прогін от-от зсунеться на одну пісню вправо, тож пісня на самому лівому краю (індекс `start`) випадає. Що нам робити з runScore?",
            explanation:
              "`start` - це індекс, який покидає прогін, тож ми віднімаємо `songScores[start]` - саме це віднімання і робить ковзне вікно швидким!",
          },
          {
            matchSnippet: "runScore += songScores[end]",
            correct:
              "    runScore += songScores[end];   // додаємо пісню, що приєднується справа",
            choices: [
              "    runScore += songScores[end];   // додаємо пісню, що приєднується справа",
              "    runScore += songScores[start];   // додаємо пісню, що приєднується справа",
              "    runScore -= songScores[end];   // додаємо пісню, що приєднується справа",
              "    runScore += end;   // додаємо пісню, що приєднується справа",
            ],
            tutorPrompt:
              "Водночас зовсім нова пісня приєднується до прогону справа, за індексом `end`. Що нам робити з її рівнем?",
            explanation:
              "Ми додаємо `songScores[end]`, бо це рівень нової пісні, яка щойно потрапила у прогін з правого краю.",
          },
          {
            matchSnippet: "bestRunScore = Math.max",
            correct: "    bestRunScore = Math.max(bestRunScore, runScore);",
            choices: [
              "    bestRunScore = Math.max(bestRunScore, runScore);",
              "    bestRunScore = Math.min(bestRunScore, runScore);",
              "    bestRunScore = runScore;",
              "    bestRunScore = bestRunScore + runScore;",
            ],
            tutorPrompt:
              "runScore вже оновлено для нового прогону. Як перевірити, чи щойно перевершили попередній найкращий результат?",
            explanation:
              "`Math.max` залишає більше з двох чисел - тож `bestRunScore` змінюється лише тоді, коли ми справді знайшли нового чемпіона.",
          },
        ],
      },
      quickChecks: {
        inputs: {
          question:
            "Якщо ми викличемо bestSongRun([10, 20, 30], 2), чому дорівнює songsPerRun?",
          options: ["10", "20", "2", "30"],
          correctIndex: 2,
          explanation: "songsPerRun - це друге, що ти передаєш - тут це 2.",
        },
        bestScore: {
          question:
            "Чому не можна просто використовувати лише runScore, без bestRunScore?",
          options: [
            "Бо runScore постійно змінюється під час ковзання, тож не може одночасно пам'ятати найкращий результат з минулого",
            "Бо в JavaScript не можна повторно використовувати змінну",
            "Бо runScore може тримати лише одну цифру",
            "Немає справжньої причини, це просто стиль",
          ],
          correctIndex: 0,
          explanation:
            "Саме так - runScore завжди «прямо зараз». Потрібна друга змінна, щоб пам'ятати «найкраще за весь час».",
        },
      },
      quiz: [
        {
          question: "У чому головний трюк ковзного вікна?",
          options: [
            "Щоразу рахувати суму з нуля для кожного прогону",
            "Використати попередню суму: прибрати старий край, додати новий",
            "Спочатку відсортувати плейлист",
            "Завжди дивитися лише на перші songsPerRun пісень",
          ],
          correctIndex: 1,
          explanation:
            "Саме так - ковзне вікно уникає повторної роботи, оновлюючи поточну суму замість того, щоб рахувати її заново щоразу.",
        },
        {
          question:
            "Коли прогін зсувається на один крок вправо, рівень якої пісні прибирається?",
          options: [
            "Найправішої пісні нового прогону",
            "Найлівішої пісні старого прогону",
            "Випадкової пісні всередині прогону",
            "Пісні з найвищим рівнем у прогоні",
          ],
          correctIndex: 1,
          explanation:
            "Прогін прибирає свою стару найлівішу пісню під час зсуву і отримує нову найправішу пісню.",
        },
        {
          question: "У коді, що насправді робить ПЕРШИЙ цикл (той, що з `i`)?",
          options: [
            "Він зсуває прогін по всьому плейлисту",
            "Він будує найперший прогін, додаючи перші songsPerRun рівнів",
            "Він сортує плейлист",
            "Він виводить кожну пісню",
          ],
          correctIndex: 1,
          explanation:
            "Перший цикл просто виконується songsPerRun разів, щоб підрахувати суму стартового прогону - справжнє «ковзання» відбувається у другому циклі.",
        },
        {
          question:
            "У ДРУГОМУ циклі, що разом роблять `runScore -= songScores[start]` і `runScore += songScores[end]`?",
          options: [
            "Нічого - вони скасовують одне одного",
            "Вони повністю перебудовують суму з нуля",
            "Вони оновлюють поточну суму для нового прогону: прибирають старий лівий край, додають новий правий",
            "Вони сортують songScores[start] і songScores[end]",
          ],
          correctIndex: 2,
          explanation:
            "Ця пара рядків - це і є все «ковзання»: одне віднімання, одне додавання, і сума правильна для нового прогону.",
        },
        {
          question:
            "Якщо songsPerRun дорівнює довжині всього плейлиста, скільки можливих прогонів існує?",
          options: [
            "Лише 1",
            "Рівно songsPerRun",
            "n мінус 1",
            "Нескінченно багато",
          ],
          correctIndex: 0,
          explanation:
            "Коли прогін такий же великий, як увесь плейлист, він може стояти лише на одному місці - охоплюючи все.",
        },
      ],
    },
  },
};
