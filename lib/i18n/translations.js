// All static "app chrome" copy - everything that isn't algorithm content
// (analogies, quiz questions, code, etc. live on the algorithm object
// itself and get localized via `localizeAlgorithm()` in the registry).
// Keys are grouped by component for easy scanning; `t(key, vars)` does
// simple `{name}` interpolation.
export const UI = {
  en: {
    "nav.progress": "🌻 {count}/{total} grown",
    "nav.allLessons": "All lessons",

    "footer.line1":
      "🌿 AlgoGarden is a little pet project for learning algorithms without the intimidating jargon.",
    "footer.line2": "Grow at your own pace - there's no rush in a garden.",

    "home.title": "Learn algorithms without the intimidating jargon 🌱",
    "home.subtitle":
      "Right now we're going deep on {strongOne} algorithm at a time instead of spreading thin - plain language, real code you can trace line by line, and hands-on practice until it truly clicks. First up: Sliding Window.",
    "home.strongOne": "one",
    "home.cta": "Start learning 🌿",
    "home.moreComing":
      "More algorithms will grow here once this one is thriving. 🌱",

    "card.startLearning": "Start learning",
    "card.minutes": "⏱ ~{n} min",

    "difficulty.Beginner": "Beginner",
    "difficulty.Intermediate": "Intermediate",
    "difficulty.Advanced": "Advanced",

    "detail.back": "← Back to all lessons",
    "detail.whatIsIt": "What is it, really?",
    "detail.watchItHappen": "Watch it happen",
    "detail.howItWorks": "How it works, step by step",
    "detail.traceItYourself": "Now trace it yourself",
    "detail.previous": "← Previous",
    "detail.next": "Next →",
    "detail.notFoundTitle": "We couldn't find that lesson",
    "detail.notFoundSubtitle":
      "It might have been moved, or the link is a little off.",

    "try.title": "🧪 Try it yourself",
    "try.newSortedList": "🔀 New sorted list",
    "try.searchFor": "Search for:",
    "try.notInList": " (not in list)",
    "try.tryTricky": "🎯 Try a number that's not there",
    "try.shuffleNumbers": "🔀 Shuffle numbers",
    "try.placeholder": "e.g. 5, 2, 8, 1",
    "try.useThese": "Use these",
    "try.errorNotNumbers":
      "Hmm, that doesn't look like a list of numbers. Try something like 4, 8, 2, 9 🌿",
    "try.errorRange": "Please give me between {min} and {max} numbers.",
    "try.windowSize": "🪟 Window size (k): {k}",

    "controls.reset": "Reset",
    "controls.previousStep": "Previous step",
    "controls.pause": "Pause",
    "controls.play": "Play",
    "controls.nextStep": "Next step",
    "controls.speed": "Playback speed",
    "controls.stepOf": "Step {current} of {total}",

    "codeBlock.title": "🧑‍💻 See it in real JavaScript",
    "codeBlock.subtitle":
      "The exact logic behind the animation above, written as a runnable function.",
    "codeBlock.show": "Show me the code",
    "codeBlock.hide": "Hide code",
    "codeBlock.copy": "📋 Copy",
    "codeBlock.copied": "✅ Copied!",

    "tracer.title": "🔁 The code, running live",
    "tracer.loopBuild":
      "Loop 1 (building): runs k times, adding one number to windowSum each round - this builds our very first window.",
    "tracer.loopSlide":
      "Loop 2 (sliding): runs once per remaining position - each round drops the old left number, adds the new right number, and checks if this is our best sum yet.",
    "tracer.loopNone": "Not inside a loop right now.",

    "concepts.title": "🧠 Loops & variables, decoded",
    "concepts.loopsHeading": "The two loops",
    "concepts.variablesHeading": "The cast of variables",
    "concepts.tapToReveal": "Tap to find out what I do →",

    "game.shuffling": "🎲 Shuffling the deck...",
    "game.title": "🎮 Loop, Variable, or Pointer?",
    "game.round": "Round {current} of {total}",
    "game.streak": "🔥 {n} in a row!",
    "game.catLoop": "🔁 Loop",
    "game.catVariable": "📦 Variable",
    "game.catPointer": "👉 Pointer",
    "game.nextRound": "Next round →",
    "game.seeScore": "See my score →",
    "game.finalScore": "{correct} / {total} correct - best streak 🔥 {best}",
    "game.perfect": "Perfect round! You've clearly met the whole cast. 🌟",
    "game.notPerfect":
      "Nice - play again for a fresh shuffle and a shot at a longer streak.",
    "game.playAgain": "🔁 Play again",

    "builder.title": "✍️ Now you write it",
    "builder.doneSubtitle":
      "You just wrote the whole function - this is real, working JavaScript.",
    "builder.progressSubtitle":
      "Line {current} of {total} - let's build it together.",
    "builder.tryAgain": "Not quite - take another look and try again.",
    "builder.nextLine": "Next line →",
    "builder.seeFinished": "See the finished function →",
    "builder.fillHint": " ← fill this in below",
    "builder.finalCongrats":
      "🌟 Every line above is exactly the real `maxSumSubarray` function - and you chose each meaningful line yourself. Try pasting it into your browser's console; it really runs!",

    "challenge.loading": "🌱 Growing a puzzle for you...",
    "challenge.title": "🎯 Practice the slide",
    "challenge.subtitle":
      "This is the one move sliding window is built on - let's drill it until it's automatic.",
    "challenge.intro":
      "Our window size is k = {k}. It's sitting at index 0–{lastIndex}, with a sum of {oldSum}. We're about to slide it one step to the right.",
    "challenge.q1": "1. Which number will leave the window?",
    "challenge.q2": "2. Which number will join the window?",
    "challenge.q3": "3. What will the new window sum be?",
    "challenge.typeNumber": "Type a number",
    "challenge.check": "Check my answers",
    "challenge.explanationLead":
      "The window drops {leaving} and picks up {entering}, so the new sum is",
    "challenge.explanationGood": "Nice work - that's exactly it!",
    "challenge.explanationBad":
      "Take a look at the arithmetic above, then give a fresh puzzle a try.",
    "challenge.tryAnother": "🔁 Try another puzzle",

    "quiz.scored": "You scored {score} / {total}!",
    "quiz.perfect": "Perfect score! You've truly grown this lesson. 🌟",
    "quiz.notPerfect":
      "Nice work - understanding grows with practice. Feel free to try again anytime.",
    "quiz.tryAgain": "🔁 Try the quiz again",
    "quiz.title": "Check your understanding",
    "quiz.questionOf": "Question {current} of {total}",
    "quiz.next": "Next question",
    "quiz.seeResults": "See my results",

    "complexity.title": "How fast is it, really?",
    "complexity.subtitle": "No scary math — just an honest picture of best, typical, and worst case.",
    "complexity.best": "🌤️ Best case",
    "complexity.typical": "⛅ Typical case",
    "complexity.worst": "🌩️ Worst case",
    "complexity.label.1": "instant",
    "complexity.label.log n": "a handful of steps",
    "complexity.label.n": "one look per item",
    "complexity.label.n log n": "a bit more than one look each",
    "complexity.label.n^2": "checking almost every pair",

    "window.sum": "Window sum",
    "window.best": "Best sum",
    "window.current": "🪟 Current window: index {start}–{end}",
    "window.bestWindow": "🏆 Best window: index {start}–{end}",

    "notFound.title": "This page hasn't sprouted yet",
    "notFound.subtitle": "Let's get you back to something that has.",
  },

  uk: {
    "nav.progress": "🌻 {count}/{total} вивчено",
    "nav.allLessons": "Усі уроки",

    "footer.line1":
      "🌿 AlgoGarden - невеликий проєкт для вивчення алгоритмів без страшних термінів.",
    "footer.line2": "Рости у своєму темпі - у саду нікуди поспішати.",

    "home.title": "Вивчай алгоритми без страшних термінів 🌱",
    "home.subtitle":
      "Зараз ми детально розбираємо {strongOne} алгоритм за раз, замість того щоб розпорошуватись - проста мова, реальний код, який можна простежити рядок за рядком, і практика, поки все справді не стане зрозумілим. Перший на черзі: Ковзне вікно.",
    "home.strongOne": "один",
    "home.cta": "Почати навчання 🌿",
    "home.moreComing": "Тут виростуть ще алгоритми, коли цей приживеться. 🌱",

    "card.startLearning": "Почати навчання",
    "card.minutes": "⏱ ~{n} хв",

    "difficulty.Beginner": "Початковий",
    "difficulty.Intermediate": "Середній",
    "difficulty.Advanced": "Просунутий",

    "detail.back": "← До всіх уроків",
    "detail.whatIsIt": "А що це насправді?",
    "detail.watchItHappen": "Подивись, як це працює",
    "detail.howItWorks": "Як це працює, крок за кроком",
    "detail.traceItYourself": "А тепер простеж сам(а)",
    "detail.previous": "← Попередній",
    "detail.next": "Наступний →",
    "detail.notFoundTitle": "Не вдалося знайти цей урок",
    "detail.notFoundSubtitle":
      "Можливо, його перемістили, або посилання трохи неправильне.",

    "try.title": "🧪 Спробуй сам(а)",
    "try.newSortedList": "🔀 Новий відсортований список",
    "try.searchFor": "Шукаємо:",
    "try.notInList": " (немає у списку)",
    "try.tryTricky": "🎯 Спробуй число, якого тут немає",
    "try.shuffleNumbers": "🔀 Перемішати числа",
    "try.placeholder": "напр. 5, 2, 8, 1",
    "try.useThese": "Використати ці",
    "try.errorNotNumbers":
      "Хм, це не схоже на список чисел. Спробуй щось на кшталт 4, 8, 2, 9 🌿",
    "try.errorRange": "Дай мені, будь ласка, від {min} до {max} чисел.",
    "try.windowSize": "🪟 Розмір вікна (k): {k}",

    "controls.reset": "Скинути",
    "controls.previousStep": "Попередній крок",
    "controls.pause": "Пауза",
    "controls.play": "Відтворити",
    "controls.nextStep": "Наступний крок",
    "controls.speed": "Швидкість відтворення",
    "controls.stepOf": "Крок {current} з {total}",

    "codeBlock.title": "🧑‍💻 Подивись справжній JavaScript",
    "codeBlock.subtitle":
      "Та сама логіка, що й в анімації вище, записана як робочу функцію.",
    "codeBlock.show": "Показати код",
    "codeBlock.hide": "Сховати код",
    "codeBlock.copy": "📋 Копіювати",
    "codeBlock.copied": "✅ Скопійовано!",

    "tracer.title": "🔁 Код виконується наживо",
    "tracer.loopBuild":
      "Цикл 1 (побудова): виконується k разів, щоразу додаючи одне число до windowSum - так будується перше вікно.",
    "tracer.loopSlide":
      "Цикл 2 (ковзання): виконується по одному разу для кожної залишеної позиції - щоразу прибирає старе число зліва, додає нове справа і перевіряє, чи це найкраща сума.",
    "tracer.loopNone": "Зараз ми не всередині циклу.",

    "concepts.title": "🧠 Цикли та змінні без таємниць",
    "concepts.loopsHeading": "Два цикли",
    "concepts.variablesHeading": "Дійові особи-змінні",
    "concepts.tapToReveal": "Натисни, щоб дізнатись, що я роблю →",

    "game.shuffling": "🎲 Тасуємо колоду...",
    "game.title": "🎮 Цикл, змінна чи вказівник?",
    "game.round": "Раунд {current} з {total}",
    "game.streak": "🔥 {n} поспіль!",
    "game.catLoop": "🔁 Цикл",
    "game.catVariable": "📦 Змінна",
    "game.catPointer": "👉 Вказівник",
    "game.nextRound": "Наступний раунд →",
    "game.seeScore": "Показати результат →",
    "game.finalScore":
      "{correct} / {total} правильно - найкраща серія 🔥 {best}",
    "game.perfect":
      "Ідеальний раунд! Ти точно знайома з усіма дійовими особами. 🌟",
    "game.notPerfect":
      "Непогано - зіграй ще раз для нового перемішування і шансу на довшу серію.",
    "game.playAgain": "🔁 Зіграти ще раз",

    "builder.title": "✍️ А тепер напиши це сам(а)",
    "builder.doneSubtitle":
      "Ти щойно написав(ла) цілу функцію - це справжній, робочий JavaScript.",
    "builder.progressSubtitle":
      "Рядок {current} з {total} - збираймо це разом.",
    "builder.tryAgain": "Не зовсім - подивись ще раз і спробуй знову.",
    "builder.nextLine": "Наступний рядок →",
    "builder.seeFinished": "Показати готову функцію →",
    "builder.fillHint": " ← заповни це нижче",
    "builder.finalCongrats":
      "🌟 Кожен рядок вище - це справжня функція `maxSumSubarray`, і кожен важливий рядок ти обрав(ла) сам(а). Спробуй вставити її у консоль браузера - вона справді працює!",

    "challenge.loading": "🌱 Готуємо для тебе задачку...",
    "challenge.title": "🎯 Потренуй ковзання",
    "challenge.subtitle":
      "Це той самий рух, на якому побудоване ковзне вікно - відпрацюємо його до автоматизму.",
    "challenge.intro":
      "Розмір нашого вікна k = {k}. Воно зараз на позиції 0–{lastIndex}, і його сума дорівнює {oldSum}. Зараз ми зсунемо його на один крок вправо.",
    "challenge.q1": "1. Яке число покине вікно?",
    "challenge.q2": "2. Яке число приєднається до вікна?",
    "challenge.q3": "3. Якою буде нова сума вікна?",
    "challenge.typeNumber": "Введи число",
    "challenge.check": "Перевірити відповіді",
    "challenge.explanationLead":
      "Вікно прибирає {leaving} і додає {entering}, тож нова сума -",
    "challenge.explanationGood": "Чудова робота - саме так!",
    "challenge.explanationBad":
      "Поглянь на обчислення вище, а потім спробуй нову задачку.",
    "challenge.tryAnother": "🔁 Спробувати іншу задачку",

    "quiz.scored": "Твій результат: {score} / {total}!",
    "quiz.perfect": "Ідеальний результат! Ти справді засвоїв(ла) цей урок. 🌟",
    "quiz.notPerfect":
      "Гарна робота - розуміння приходить з практикою. Спробуй ще раз, коли захочеш.",
    "quiz.tryAgain": "🔁 Пройти тест ще раз",
    "quiz.title": "Перевір своє розуміння",
    "quiz.questionOf": "Питання {current} з {total}",
    "quiz.next": "Наступне питання",
    "quiz.seeResults": "Показати результат",

    "complexity.title": "Наскільки це швидко насправді?",
    "complexity.subtitle": "Без страшної математики — чесна картина найкращого, типового та найгіршого випадку.",
    "complexity.best": "🌤️ Найкращий випадок",
    "complexity.typical": "⛅ Типовий випадок",
    "complexity.worst": "🌩️ Найгірший випадок",
    "complexity.label.1": "миттєво",
    "complexity.label.log n": "жменька кроків",
    "complexity.label.n": "один погляд на кожен елемент",
    "complexity.label.n log n": "трохи більше, ніж один погляд на кожен",
    "complexity.label.n^2": "перевірка майже кожної пари",

    "window.sum": "Сума вікна",
    "window.best": "Найкраща сума",
    "window.current": "🪟 Поточне вікно: індекс {start}–{end}",
    "window.bestWindow": "🏆 Найкраще вікно: індекс {start}–{end}",

    "notFound.title": "Ця сторінка ще не проросла",
    "notFound.subtitle": "Повернімось до чогось, що вже проросло.",
  },
};

export function translate(locale, key, vars) {
  const dict = UI[locale] || UI.en;
  let str = dict[key] ?? UI.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, v);
    }
  }
  return str;
}
