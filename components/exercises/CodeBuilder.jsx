'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Mascot from '../Mascot';
import Confetti from '../Confetti';
import { tokenize, TOKEN_CLASSES, TOKEN_CLASSES_LIGHT } from '@/lib/highlight';
import { CODE } from '@/lib/algorithms/slidingWindow';

const LINES = CODE.split('\n');
function findLine(snippet) {
  return LINES.findIndex((l) => l.includes(snippet));
}

// The 5 lines worth pausing on — everything else (signatures, loop
// declarations, braces, the final console.log) is shown as given, so the
// learner's attention goes to the operations that actually make sliding
// window work.
const BLANKS = [
  {
    lineIndex: findLine('windowSum += arr[i]'),
    correct: '    windowSum += arr[i];',
    tutorPrompt:
      "We're inside the FIRST loop, building the very first window. Each round through, we need to add one more number into our running total. Which line does that?",
    choices: ['    windowSum += arr[i];', '    windowSum = arr[i];', '    windowSum += arr[k];', '    windowSum += i;'],
    explanation: (
      <>
        Right! <code>+=</code> keeps adding onto our running total, and <code>arr[i]</code> is the number at the loop&apos;s current position —
        not <code>arr[k]</code>, which would grab the same one number every single round.
      </>
    ),
  },
  {
    lineIndex: findLine('let bestSum = windowSum'),
    correct: '  let bestSum = windowSum;',
    tutorPrompt: 'Loop 1 just finished, so windowSum now holds the total of our very first window. What should we remember as the best sum found so far?',
    choices: ['  let bestSum = windowSum;', '  let bestSum = 0;', '  let bestSum = arr[0];', '  let bestSum = k;'],
    explanation: (
      <>
        Exactly — before we&apos;ve compared anything else, our only window <em>is</em> the best one we&apos;ve seen, so <code>bestSum</code> starts out
        equal to <code>windowSum</code>.
      </>
    ),
  },
  {
    lineIndex: findLine('windowSum -= arr[start]'),
    correct: '    windowSum -= arr[start]; // drop the number leaving on the left',
    tutorPrompt: "Now we're sliding. The window is about to move one spot right, so the number at the very left edge (index `start`) falls out. What do we do to windowSum?",
    choices: [
      '    windowSum -= arr[start]; // drop the number leaving on the left',
      '    windowSum -= arr[end]; // drop the number leaving on the left',
      '    windowSum += arr[start]; // drop the number leaving on the left',
      '    windowSum -= arr[k]; // drop the number leaving on the left',
    ],
    explanation: (
      <>
        <code>start</code> is the index that is leaving the window, so we subtract <code>arr[start]</code> — that one subtraction is the whole trick
        that makes sliding window fast!
      </>
    ),
  },
  {
    lineIndex: findLine('windowSum += arr[end]'),
    correct: '    windowSum += arr[end];   // add the number joining on the right',
    tutorPrompt: 'At the same time, a brand-new number is joining the window on the right, at index `end`. What do we do with it?',
    choices: [
      '    windowSum += arr[end];   // add the number joining on the right',
      '    windowSum += arr[start];   // add the number joining on the right',
      '    windowSum -= arr[end];   // add the number joining on the right',
      '    windowSum += end;   // add the number joining on the right',
    ],
    explanation: (
      <>
        We add <code>arr[end]</code> because that&apos;s the new number that just entered the window on the right edge.
      </>
    ),
  },
  {
    lineIndex: findLine('bestSum = Math.max'),
    correct: '    bestSum = Math.max(bestSum, windowSum);',
    tutorPrompt: 'windowSum is now up to date for this new position. How do we check whether it just beat the best one we found before?',
    choices: [
      '    bestSum = Math.max(bestSum, windowSum);',
      '    bestSum = Math.min(bestSum, windowSum);',
      '    bestSum = windowSum;',
      '    bestSum = bestSum + windowSum;',
    ],
    explanation: (
      <>
        <code>Math.max</code> keeps whichever of the two is bigger — so <code>bestSum</code> only changes when we&apos;ve genuinely found a new
        champion window.
      </>
    ),
  },
];

function CodeLine({ text, dim, active, light }) {
  const tokens = tokenize(text);
  const classes = light ? TOKEN_CLASSES_LIGHT : TOKEN_CLASSES;
  return (
    <span className={dim ? 'opacity-40' : active ? 'font-semibold' : ''}>
      {tokens.map((t, i) => (
        <span key={i} className={classes[t.type]}>
          {t.text}
        </span>
      ))}
    </span>
  );
}

// The "apply it yourself" drill: rebuild the real function one meaningful
// line at a time, tutor-style — a short prompt, a few candidate lines to
// choose from, instant feedback, then on to the next blank. By the end the
// whole function is sitting there, fully assembled, written by the learner.
export default function CodeBuilder() {
  const [step, setStep] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongPick, setWrongPick] = useState(null);
  const finished = step >= BLANKS.length;
  const blank = !finished ? BLANKS[step] : null;

  function pick(choice) {
    if (solved) return;
    if (choice === blank.correct) {
      setSolved(true);
      setWrongPick(null);
    } else {
      setWrongPick(choice);
    }
  }

  function next() {
    setStep((s) => s + 1);
    setSolved(false);
    setWrongPick(null);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-honey-200 bg-honey-50/40 p-6 sm:p-8">
      <Confetti show={finished} />
      <div className="mb-5 flex items-center gap-3">
        <Mascot size={44} mood={finished ? 'excited' : solved ? 'excited' : 'thinking'} />
        <div>
          <h3 className="font-heading text-lg text-ink-900">✍️ Now you write it</h3>
          <p className="text-sm text-ink-500">
            {finished ? "You just wrote the whole function — this is real, working JavaScript." : `Line ${step + 1} of ${BLANKS.length} — let's build it together.`}
          </p>
        </div>
      </div>

      {/* The function, filling in as we go */}
      <pre className="mb-5 overflow-x-auto rounded-2xl bg-ink-900 p-4 text-sm leading-relaxed">
        <code className="font-mono">
          {LINES.map((line, i) => {
            const blankAt = BLANKS.findIndex((b) => b.lineIndex === i);
            if (blankAt === -1) {
              return (
                <div key={i}>
                  <CodeLine text={line || ' '} />
                </div>
              );
            }
            const isPast = blankAt < step || (blankAt === step && solved);
            const isCurrent = blankAt === step && !solved;
            if (isPast) {
              return (
                <motion.div key={i} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="rounded bg-sage-500/10">
                  <CodeLine text={BLANKS[blankAt].correct} active />
                </motion.div>
              );
            }
            return (
              <div key={i} className={isCurrent ? 'rounded bg-honey-400/10' : ''}>
                <span className={isCurrent ? 'text-honey-300' : 'text-ink-300/40'}>{isCurrent ? '  ??? ← fill this in below' : '  ???'}</span>
              </div>
            );
          })}
        </code>
      </pre>

      {!finished ? (
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <p className="mb-3 text-sm leading-relaxed text-ink-700">{blank.tutorPrompt}</p>
            <div className="flex flex-col gap-2">
              {blank.choices.map((choice) => {
                let cls = 'border-cream-300 bg-white hover:border-honey-300 hover:bg-honey-50';
                if (solved && choice === blank.correct) cls = 'border-sage-400 bg-sage-50';
                else if (wrongPick === choice) cls = 'border-terracotta-300 bg-terracotta-50';
                return (
                  <button
                    key={choice}
                    onClick={() => pick(choice)}
                    disabled={solved}
                    className={`rounded-xl border-2 px-4 py-2.5 text-left font-mono text-xs sm:text-sm ${cls}`}
                  >
                    <CodeLine text={choice} light />
                    {solved && choice === blank.correct && ' ✅'}
                    {wrongPick === choice && ' ❌'}
                  </button>
                );
              })}
            </div>

            {wrongPick && !solved && <p className="mt-2 text-xs font-medium text-terracotta-600">Not quite — take another look and try again.</p>}

            <AnimatePresence>
              {solved && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 overflow-hidden">
                  <div className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-ink-700">🌱 {blank.explanation}</div>
                  <button
                    onClick={next}
                    className="mt-3 rounded-full bg-honey-400 px-5 py-2.5 text-sm font-semibold text-ink-900 shadow-softer transition hover:bg-honey-500"
                  >
                    {step === BLANKS.length - 1 ? "See the finished function" : 'Next line'} →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sage-50 p-4 text-sm leading-relaxed text-sage-800">
          🌟 Every line above is exactly the real <code>maxSumSubarray</code> function — and you chose each meaningful line yourself. Try pasting it into your
          browser&apos;s console; it really runs!
        </motion.div>
      )}
    </div>
  );
}
