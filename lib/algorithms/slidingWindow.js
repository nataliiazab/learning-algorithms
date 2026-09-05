// Sliding Window (fixed-size max-sum) - see registry.js for the shared "shape" every algorithm module follows.

// The real implementation, kept as one source of truth. generateSteps()
// below tags every animation frame with the exact line this is "executing"
// (via lineNumber lookups, so the numbers never drift out of sync if the
// code changes) plus a live snapshot of the variables - that's what powers
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

const CODE_LINES = CODE.split("\n");
function lineNumber(snippet) {
  const idx = CODE_LINES.findIndex((l) => l.includes(snippet));
  return idx === -1 ? null : idx + 1;
}

// Line numbers, looked up by content so they can never silently drift out
// of sync with the CODE string above.
export const LINE = {
  start: lineNumber("let windowSum = 0"),
  buildAdd: lineNumber("windowSum += arr[i]"),
  bestInit: lineNumber("let bestSum = windowSum"),
  loopFor: lineNumber("for (let end = k"),
  remove: lineNumber("windowSum -= arr[start]"),
  add: lineNumber("windowSum += arr[end]"),
  compare: lineNumber("bestSum = Math.max"),
  ret: lineNumber("return bestSum"),
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
      message: `Let's find the biggest sum we can get from any ${size} numbers in a row. We'll use a window of size ${size} and slide it across the list - no re-counting needed! First, line 3 sets windowSum to 0.`,
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
        vars: { i, "arr[i]": array[i], windowSum: sum },
        message: `Loop 1, round ${i + 1} of ${size}: windowSum += arr[${i}] adds ${array[i]}. Running total so far: ${sum}.`,
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
      vars: { windowSum: sum, bestSum: sum },
      message: `Loop 1 is done. Line 9 saves bestSum = windowSum = ${sum} - our very first window is the best one we know about so far. 🏆`,
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
        vars: { start: start - 1, end, "arr[start]": leaving, windowSum: sum },
        message: `Loop 2 is running (end = ${end}). Line 14: windowSum -= arr[${start - 1}] drops ${leaving} from the left edge. Running total: ${sum}.`,
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
        vars: { start, end, "arr[end]": entering, windowSum: sum },
        message: `Line 15: windowSum += arr[${end}] adds ${entering} on the right edge. No need to re-add anything else - new total: ${sum}.`,
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
        vars: { windowSum: sum, bestSum },
        message: improved
          ? `Line 16: Math.max(bestSum, windowSum) sees ${sum} beats our old best! bestSum updates to ${sum}. 🏆`
          : `Line 16: Math.max(bestSum, windowSum) checks ${sum} against ${bestSum} - not better, so bestSum stays ${bestSum}. We keep sliding.`,
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
      vars: { bestSum },
      message: `Loop 2 has reached the end of the list. Line 19 returns bestSum: the biggest possible sum of ${size} numbers in a row is ${bestSum}, found starting at index ${bestStart}. 🌟`,
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
    "Find the biggest sum of any k numbers in a row - without re-counting a thing.",
  analogy:
    "Picture your favorite playlist queued up before a party. Each song has an \"energy score,\" and you want the best possible 3-song run to hype up the room - but you can't skip around, you can only play songs that are next to each other in the queue. So you check the first 3 songs' combined energy. Then, instead of re-adding three whole songs for the next group, you just do two quick moves: drop the energy score of the song that's no longer in your 3-song run, and add the score of the next song that just entered it. That tiny move - drop the old edge, add the new edge - is the entire trick behind a sliding window.",
  howItWorks: [
    "Decide how big your window should be - call that size k (in the playlist example, k = 3 songs).",
    "Add up the first k numbers. That’s your starting window sum.",
    "Remember that sum as your best one so far.",
    "Slide the window one step right: subtract the number that just left on the left edge, and add the new number that just joined on the right edge.",
    "Compare the new sum to your best - keep whichever is bigger.",
    "Keep sliding until the window reaches the end of the list. Whatever sum you kept is the biggest possible!",
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
  // Content for the "meet the cast" explainer and the loop/variable
  // classification game - both optional fields, rendered only when present.
  codeConcepts: {
    intro:
      "Before we trace the code line by line, let's actually meet the two loops and the handful of variables that make this whole thing tick. Once you know who's who, the code stops looking like a wall of symbols.",
    loops: [
      {
        emoji: "🏗️",
        name: 'Loop 1 - "The Builder"',
        code: "for (let i = 0; i < k; i++)",
        explanation:
          "Runs exactly k times, adding one number each round. It's laying the first k bricks of our window before anything ever starts moving.",
      },
      {
        emoji: "🚶",
        name: 'Loop 2 - "The Walker"',
        code: "for (let end = k; end < arr.length; end++)",
        explanation:
          "Runs once for every position still left to check, sliding the window forward one spot at a time - like someone walking down a hallway, dropping the flyer behind them and grabbing a new one ahead.",
      },
    ],
    variables: [
      {
        emoji: "🫙",
        name: "windowSum",
        nickname: "The Tally Jar",
        explanation:
          "Holds the running total of whatever's currently inside the window. It never stops changing - pour a new number in, scoop an old one out.",
      },
      {
        emoji: "🏆",
        name: "bestSum",
        nickname: "The Trophy Keeper",
        explanation:
          "Only updates when windowSum beats it. The rest of the time it just sits there, quietly holding onto the record.",
      },
      {
        emoji: "👶",
        name: "i",
        nickname: "The Newborn Counter",
        explanation:
          "Only exists inside Loop 1, counting 0, 1, 2... up to k. The moment that loop ends, i vanishes for good - it never shows up again.",
      },
      {
        emoji: "👉",
        name: "end",
        nickname: "The Right Bookend",
        explanation:
          "Always points at the newest number sliding INTO the window, on the right.",
      },
      {
        emoji: "👈",
        name: "start",
        nickname: "The Left Bookend",
        explanation:
          "Always points at the oldest number about to slide OUT, on the left. It's always exactly k steps behind end.",
      },
    ],
  },
  conceptGame: [
    {
      term: "windowSum",
      isCode: false,
      answer: "variable",
      feedback: "Yep - that's the Tally Jar, holding our running total.",
    },
    {
      term: "for (let i = 0; i < k; i++)",
      isCode: true,
      answer: "loop",
      feedback: "Right - the Builder loop, repeating k times.",
    },
    {
      term: "bestSum",
      isCode: false,
      answer: "variable",
      feedback: "Correct - the Trophy Keeper, remembering our best score.",
    },
    {
      term: "for (let end = k; end < arr.length; end++)",
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
      feedback: "Exactly, another pointer - marking the window's left edge.",
    },
  ],
  // Content for the "write it yourself" exercise. `matchSnippet`/`correct`/
  // `choices` are real code, so they never change between locales - only
  // `tutorPrompt`/`explanation` get overridden in `translations`.
  codeBuilder: {
    blanks: [
      {
        matchSnippet: "windowSum += arr[i]",
        correct: "    windowSum += arr[i];",
        choices: [
          "    windowSum += arr[i];",
          "    windowSum = arr[i];",
          "    windowSum += arr[k];",
          "    windowSum += i;",
        ],
        tutorPrompt:
          "We're inside the FIRST loop, building the very first window. Each round through, we need to add one more number into our running total. Which line does that?",
        explanation:
          "Right! `+=` keeps adding onto our running total, and `arr[i]` is the number at the loop's current position - not `arr[k]`, which would grab the same one number every single round.",
      },
      {
        matchSnippet: "let bestSum = windowSum",
        correct: "  let bestSum = windowSum;",
        choices: [
          "  let bestSum = windowSum;",
          "  let bestSum = 0;",
          "  let bestSum = arr[0];",
          "  let bestSum = k;",
        ],
        tutorPrompt:
          "Loop 1 just finished, so windowSum now holds the total of our very first window. What should we remember as the best sum found so far?",
        explanation:
          "Exactly - before we've compared anything else, our only window is the best one we've seen, so `bestSum` starts out equal to `windowSum`.",
      },
      {
        matchSnippet: "windowSum -= arr[start]",
        correct:
          "    windowSum -= arr[start]; // drop the number leaving on the left",
        choices: [
          "    windowSum -= arr[start]; // drop the number leaving on the left",
          "    windowSum -= arr[end]; // drop the number leaving on the left",
          "    windowSum += arr[start]; // drop the number leaving on the left",
          "    windowSum -= arr[k]; // drop the number leaving on the left",
        ],
        tutorPrompt:
          "Now we're sliding. The window is about to move one spot right, so the number at the very left edge (index `start`) falls out. What do we do to windowSum?",
        explanation:
          "`start` is the index that is leaving the window, so we subtract `arr[start]` - that one subtraction is the whole trick that makes sliding window fast!",
      },
      {
        matchSnippet: "windowSum += arr[end]",
        correct:
          "    windowSum += arr[end];   // add the number joining on the right",
        choices: [
          "    windowSum += arr[end];   // add the number joining on the right",
          "    windowSum += arr[start];   // add the number joining on the right",
          "    windowSum -= arr[end];   // add the number joining on the right",
          "    windowSum += end;   // add the number joining on the right",
        ],
        tutorPrompt:
          "At the same time, a brand-new number is joining the window on the right, at index `end`. What do we do with it?",
        explanation:
          "We add `arr[end]` because that's the new number that just entered the window on the right edge.",
      },
      {
        matchSnippet: "bestSum = Math.max",
        correct: "    bestSum = Math.max(bestSum, windowSum);",
        choices: [
          "    bestSum = Math.max(bestSum, windowSum);",
          "    bestSum = Math.min(bestSum, windowSum);",
          "    bestSum = windowSum;",
          "    bestSum = bestSum + windowSum;",
        ],
        tutorPrompt:
          "windowSum is now up to date for this new position. How do we check whether it just beat the best one we found before?",
        explanation:
          "`Math.max` keeps whichever of the two is bigger - so `bestSum` only changes when we've genuinely found a new champion window.",
      },
    ],
  },
  quiz: [
    {
      question: "What's the main trick behind a sliding window?",
      options: [
        "Recompute the sum from scratch for every window",
        "Reuse the previous sum: remove the old edge, add the new one",
        "Sort the array first",
        "Only ever look at the first k numbers",
      ],
      correctIndex: 1,
      explanation:
        "Exactly - sliding window avoids repeating work by updating the running sum instead of rebuilding it every time.",
    },
    {
      question:
        "When the window slides one step to the right, which number is removed?",
      options: [
        "The rightmost number of the new window",
        "The leftmost number of the old window",
        "A random number inside the window",
        "The largest number in the window",
      ],
      correctIndex: 1,
      explanation:
        "The window drops its old leftmost number as it shifts, and gains a new rightmost number.",
    },
    {
      question:
        "In the code, what does the FIRST loop (the one with `i`) actually do?",
      options: [
        "It slides the window across the whole list",
        "It builds the very first window by adding up its first k numbers",
        "It sorts the array",
        "It prints every number",
      ],
      correctIndex: 1,
      explanation:
        'The first loop just runs k times to total up the starting window - the real "sliding" happens in the second loop.',
    },
    {
      question:
        "In the SECOND loop, what do `windowSum -= arr[start]` and `windowSum += arr[end]` do together?",
      options: [
        "Nothing - they cancel out",
        "They rebuild the sum completely from scratch",
        "They update the running sum for the new window position: drop the old left edge, add the new right edge",
        "They sort arr[start] and arr[end]",
      ],
      correctIndex: 2,
      explanation:
        'That pair of lines is the entire "slide" - one subtraction, one addition, and the sum is correct for the new window.',
    },
    {
      question:
        "If the window size k equals the length of the whole list, how many possible windows are there?",
      options: ["Just 1", "Exactly k", "n minus 1", "Infinitely many"],
      correctIndex: 0,
      explanation:
        "When the window is as big as the whole list, there’s only one place it can go - covering everything.",
    },
  ],
  translations: {
    uk: {
      title: "Ковзне вікно",
      category: "Ковзне вікно",
      tagline:
        "Знайди найбільшу суму будь-яких k чисел поспіль - без жодного повторного підрахунку.",
      analogy:
        'Уяви свій улюблений плейлист перед вечіркою. У кожної пісні є "рівень енергії", і ти хочеш знайти найкращі 3 пісні поспіль, щоб завести танцпол - але перескакувати не можна, можна грати лише пісні, що йдуть одна за одною в черзі. Тож ти перевіряєш сумарну енергію перших 3 пісень. А потім, замість того щоб знову складати три нові пісні, ти робиш два швидкі кроки: прибираєш рівень енергії пісні, яка щойно випала з твоєї трійки, і додаєш рівень пісні, яка щойно до неї приєдналась. Цей маленький рух - прибрати старий край, додати новий - і є весь секрет ковзного вікна.',
      howItWorks: [
        "Вирішіть, яким має бути розмір вашого вікна - назвемо його k (у прикладі з плейлистом k = 3 пісні).",
        "Додайте перші k чисел. Це і буде початкова сума вікна.",
        "Запам'ятайте цю суму як найкращу на даний момент.",
        "Зсуньте вікно на один крок вправо: відніміть число, яке щойно вийшло зліва, і додайте нове число, яке щойно приєдналось справа.",
        "Порівняйте нову суму з найкращою - залишіть ту, що більша.",
        "Продовжуйте ковзати, доки вікно не дійде до кінця списку. Сума, яку ви зберегли, і є найбільшою можливою!",
      ],
      complexityPlain: {
        best: "Навіть у найкращому випадку ми все одно поглядаємо на кожне число приблизно раз - але це вже чудово швидко.",
        average:
          "Кожне число додається рівно один раз і прибирається щонайбільше один раз - один плавний прохід по списку.",
        worst:
          "Незалежно від чисел усередині, ковзне вікно ніколи не повторює роботу - завжди приблизно один прохід від початку до кінця.",
      },
      codeConcepts: {
        intro:
          "Перш ніж простежувати код рядок за рядком, познайомимось із двома циклами та кількома змінними, на яких усе тримається. Щойно зрозумієш, хто є хто, код перестане виглядати як стіна символів.",
        loops: [
          {
            emoji: "🏗️",
            name: "Цикл 1 - «Будівельник»",
            code: "for (let i = 0; i < k; i++)",
            explanation:
              "Виконується рівно k разів, додаючи по одному числу щоразу. Це наче укладання перших k цеглинок нашого вікна, перш ніж щось почне рухатись.",
          },
          {
            emoji: "🚶",
            name: "Цикл 2 - «Мандрівник»",
            code: "for (let end = k; end < arr.length; end++)",
            explanation:
              "Виконується по одному разу для кожної позиції, що залишилась, зсуваючи вікно на один крок за раз - наче хтось іде коридором, залишаючи листівку позаду і беручи нову попереду.",
          },
        ],
        variables: [
          {
            emoji: "🫙",
            name: "windowSum",
            nickname: "Банка-лічильник",
            explanation:
              "Містить поточну суму всього, що зараз у вікні. Постійно змінюється - влий нове число, вилий старе.",
          },
          {
            emoji: "🏆",
            name: "bestSum",
            nickname: "Хранитель кубка",
            explanation:
              "Оновлюється, лише коли windowSum перевершує його. Увесь інший час просто тихо тримає рекорд.",
          },
          {
            emoji: "👶",
            name: "i",
            nickname: "Новонароджений лічильник",
            explanation:
              "Існує лише всередині Циклу 1, рахуючи 0, 1, 2... до k. Щойно цикл завершується, i зникає назавжди - більше не з'являється.",
          },
          {
            emoji: "👉",
            name: "end",
            nickname: "Правий обмежувач",
            explanation:
              "Завжди вказує на найновіше число, що заходить у вікно справа.",
          },
          {
            emoji: "👈",
            name: "start",
            nickname: "Лівий обмежувач",
            explanation:
              "Завжди вказує на найстаріше число, яке от-от вийде з вікна зліва. Він завжди рівно на k кроків позаду end.",
          },
        ],
      },
      conceptGame: [
        {
          term: "windowSum",
          isCode: false,
          answer: "variable",
          feedback: "Так - це Банка-лічильник, що тримає нашу поточну суму.",
        },
        {
          term: "for (let i = 0; i < k; i++)",
          isCode: true,
          answer: "loop",
          feedback: "Правильно - цикл Будівельник, що повторюється k разів.",
        },
        {
          term: "bestSum",
          isCode: false,
          answer: "variable",
          feedback:
            "Вірно - Хранитель кубка, що пам'ятає наш найкращий результат.",
        },
        {
          term: "for (let end = k; end < arr.length; end++)",
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
          feedback: "Точно, ще один вказівник - позначає лівий край вікна.",
        },
      ],
      codeBuilder: {
        blanks: [
          {
            matchSnippet: "windowSum += arr[i]",
            correct: "    windowSum += arr[i];",
            choices: [
              "    windowSum += arr[i];",
              "    windowSum = arr[i];",
              "    windowSum += arr[k];",
              "    windowSum += i;",
            ],
            tutorPrompt:
              "Ми всередині ПЕРШОГО циклу, будуємо найперше вікно. На кожному кроці потрібно додати ще одне число до нашої накопиченої суми. Який рядок це робить?",
            explanation:
              "Правильно! `+=` продовжує додавати до нашої суми, а `arr[i]` - це число на поточній позиції циклу, а не `arr[k]`, яке щоразу брало б те саме одне число.",
          },
          {
            matchSnippet: "let bestSum = windowSum",
            correct: "  let bestSum = windowSum;",
            choices: [
              "  let bestSum = windowSum;",
              "  let bestSum = 0;",
              "  let bestSum = arr[0];",
              "  let bestSum = k;",
            ],
            tutorPrompt:
              "Цикл 1 щойно завершився, тож windowSum тепер містить суму нашого найпершого вікна. Що нам варто запам'ятати як найкращу суму на даний момент?",
            explanation:
              "Саме так - поки що ми ще нічого не порівнювали, тож наше єдине вікно і є найкращим, яке ми бачили, тому `bestSum` спочатку дорівнює `windowSum`.",
          },
          {
            matchSnippet: "windowSum -= arr[start]",
            correct:
              "    windowSum -= arr[start]; // drop the number leaving on the left",
            choices: [
              "    windowSum -= arr[start]; // drop the number leaving on the left",
              "    windowSum -= arr[end]; // drop the number leaving on the left",
              "    windowSum += arr[start]; // drop the number leaving on the left",
              "    windowSum -= arr[k]; // drop the number leaving on the left",
            ],
            tutorPrompt:
              "Тепер ми ковзаємо. Вікно от-от зсунеться на одну позицію вправо, тож число на самому лівому краю (індекс `start`) випадає. Що нам робити з windowSum?",
            explanation:
              "`start` - це індекс, який покидає вікно, тож ми віднімаємо `arr[start]` - саме це віднімання і робить ковзне вікно швидким!",
          },
          {
            matchSnippet: "windowSum += arr[end]",
            correct:
              "    windowSum += arr[end];   // add the number joining on the right",
            choices: [
              "    windowSum += arr[end];   // add the number joining on the right",
              "    windowSum += arr[start];   // add the number joining on the right",
              "    windowSum -= arr[end];   // add the number joining on the right",
              "    windowSum += end;   // add the number joining on the right",
            ],
            tutorPrompt:
              "Водночас зовсім нове число приєднується до вікна справа, за індексом `end`. Що нам з ним робити?",
            explanation:
              "Ми додаємо `arr[end]`, бо це нове число, яке щойно потрапило у вікно з правого краю.",
          },
          {
            matchSnippet: "bestSum = Math.max",
            correct: "    bestSum = Math.max(bestSum, windowSum);",
            choices: [
              "    bestSum = Math.max(bestSum, windowSum);",
              "    bestSum = Math.min(bestSum, windowSum);",
              "    bestSum = windowSum;",
              "    bestSum = bestSum + windowSum;",
            ],
            tutorPrompt:
              "windowSum вже оновлено для нової позиції. Як перевірити, чи щойно перевершили попередній найкращий результат?",
            explanation:
              "`Math.max` залишає більше з двох чисел - тож `bestSum` змінюється лише тоді, коли ми справді знайшли нового чемпіона.",
          },
        ],
      },
      quiz: [
        {
          question: "У чому головний трюк ковзного вікна?",
          options: [
            "Щоразу рахувати суму з нуля для кожного вікна",
            "Використати попередню суму: прибрати старий край, додати новий",
            "Спочатку відсортувати масив",
            "Завжди дивитися лише на перші k чисел",
          ],
          correctIndex: 1,
          explanation:
            "Саме так - ковзне вікно уникає повторної роботи, оновлюючи поточну суму замість того, щоб рахувати її заново щоразу.",
        },
        {
          question:
            "Коли вікно зсувається на один крок вправо, яке число прибирається?",
          options: [
            "Найправіше число нового вікна",
            "Найлівіше число старого вікна",
            "Випадкове число всередині вікна",
            "Найбільше число у вікні",
          ],
          correctIndex: 1,
          explanation:
            "Вікно прибирає своє старе найлівіше число під час зсуву і отримує нове найправіше число.",
        },
        {
          question: "У коді, що насправді робить ПЕРШИЙ цикл (той, що з `i`)?",
          options: [
            "Він зсуває вікно по всьому списку",
            "Він будує найперше вікно, додаючи перші k чисел",
            "Він сортує масив",
            "Він виводить кожне число",
          ],
          correctIndex: 1,
          explanation:
            "Перший цикл просто виконується k разів, щоб підрахувати суму стартового вікна - справжнє «ковзання» відбувається у другому циклі.",
        },
        {
          question:
            "У ДРУГОМУ циклі, що разом роблять `windowSum -= arr[start]` і `windowSum += arr[end]`?",
          options: [
            "Нічого - вони скасовують одне одного",
            "Вони повністю перебудовують суму з нуля",
            "Вони оновлюють поточну суму для нової позиції вікна: прибирають старий лівий край, додають новий правий",
            "Вони сортують arr[start] і arr[end]",
          ],
          correctIndex: 2,
          explanation:
            "Ця пара рядків - це і є все «ковзання»: одне віднімання, одне додавання, і сума правильна для нового вікна.",
        },
        {
          question:
            "Якщо розмір вікна k дорівнює довжині всього списку, скільки можливих вікон існує?",
          options: ["Лише 1", "Рівно k", "n мінус 1", "Нескінченно багато"],
          correctIndex: 0,
          explanation:
            "Коли вікно таке ж велике, як увесь список, воно може стояти лише на одному місці - охоплюючи все.",
        },
      ],
    },
  },
};
