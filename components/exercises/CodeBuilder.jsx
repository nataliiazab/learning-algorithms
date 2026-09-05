"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "../Mascot";
import Confetti from "../Confetti";
import InlineText from "../InlineText";
import { tokenize, TOKEN_CLASSES, TOKEN_CLASSES_LIGHT } from "@/lib/highlight";
import { useTranslation } from "@/lib/i18n/LocaleContext";

function CodeLine({ text, dim, active, light }) {
  const tokens = tokenize(text);
  const classes = light ? TOKEN_CLASSES_LIGHT : TOKEN_CLASSES;
  return (
    <span className={dim ? "opacity-40" : active ? "font-semibold" : ""}>
      {tokens.map((t, i) => (
        <span key={i} className={classes[t.type]}>
          {t.text}
        </span>
      ))}
    </span>
  );
}

// The "apply it yourself" drill: rebuild the real function one meaningful
// line at a time, tutor-style - a short prompt, a few candidate lines to
// choose from, instant feedback, then on to the next blank.
//
// `range` (default: the whole thing) lets a lesson split the blanks across
// several stages - e.g. [0, 1) in one stage, [1, 2) in the next, [2, 5) in
// a third - while still showing the *whole* function each time: blanks
// before the range are shown already filled in (from earlier stages),
// blanks after it are shown as untouched placeholders (coming up later).
export default function CodeBuilder({ config, range }) {
  const { t } = useTranslation();
  const blanks = config.codeBuilder.blanks;
  const [rangeStart, rangeEnd] = range ?? [0, blanks.length];
  const isLastRange = rangeEnd >= blanks.length;
  // config.code is already the locale-appropriate version (its comments
  // translate; the runnable code itself never does), so the surrounding
  // "given" lines shown here automatically match whatever language the
  // rest of the page is in.
  const LINES = config.code.split("\n");
  const findLine = (snippet) => LINES.findIndex((l) => l.includes(snippet));
  const lineIndexOf = (b) => findLine(b.matchSnippet);

  const [localStep, setLocalStep] = useState(0); // index within THIS range
  const [solved, setSolved] = useState(false);
  const [wrongPick, setWrongPick] = useState(null);

  const rangeLength = rangeEnd - rangeStart;
  const globalStep = rangeStart + localStep;
  const finished = localStep >= rangeLength;
  const blank = !finished ? blanks[globalStep] : null;

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
    setLocalStep((s) => s + 1);
    setSolved(false);
    setWrongPick(null);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-honey-200 bg-honey-50/40 p-6 sm:p-8">
      <Confetti show={finished && isLastRange} />
      <div className="mb-5 flex items-center gap-3">
        <Mascot
          size={44}
          mood={finished ? "excited" : solved ? "excited" : "thinking"}
        />
        <div>
          <h3 className="font-heading text-lg text-ink-900">{t("builder.title")}</h3>
          <p className="text-sm text-ink-500">
            {finished
              ? isLastRange
                ? t("builder.doneSubtitle")
                : t("builder.partialDone")
              : t("builder.progressSubtitle", { current: globalStep + 1, total: blanks.length })}
          </p>
        </div>
      </div>

      {/* The function, filling in as we go */}
      <pre className="mb-5 overflow-x-auto rounded-2xl bg-ink-900 p-4 text-sm leading-relaxed">
        <code className="font-mono">
          {LINES.map((line, i) => {
            const blankAt = blanks.findIndex((b) => lineIndexOf(b) === i);
            if (blankAt === -1) {
              return (
                <div key={i}>
                  <CodeLine text={line || " "} />
                </div>
              );
            }
            // Blanks from earlier stages are always shown solved; blanks
            // from later stages are always shown as untouched placeholders.
            if (blankAt < rangeStart) {
              return (
                <div key={i} className="rounded bg-sage-500/10">
                  <CodeLine text={blanks[blankAt].correct} active />
                </div>
              );
            }
            if (blankAt >= rangeEnd) {
              return (
                <div key={i}>
                  <span className="text-ink-300/40">  ???</span>
                </div>
              );
            }
            const localAt = blankAt - rangeStart;
            const isPast = localAt < localStep || (localAt === localStep && solved);
            const isCurrent = localAt === localStep && !solved;
            if (isPast) {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  className="rounded bg-sage-500/10"
                >
                  <CodeLine text={blanks[blankAt].correct} active />
                </motion.div>
              );
            }
            return (
              <div
                key={i}
                className={isCurrent ? "rounded bg-honey-400/10" : ""}
              >
                <span
                  className={isCurrent ? "text-honey-300" : "text-ink-300/40"}
                >
                  {isCurrent ? `  ???${t("builder.fillHint")}` : "  ???"}
                </span>
              </div>
            );
          })}
        </code>
      </pre>

      {!finished ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={globalStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="mb-3 text-sm leading-relaxed text-ink-700">
              <InlineText text={blank.tutorPrompt} />
            </p>
            <div className="flex flex-col gap-2">
              {blank.choices.map((choice) => {
                let cls =
                  "border-cream-300 bg-white hover:border-honey-300 hover:bg-honey-50";
                if (solved && choice === blank.correct)
                  cls = "border-sage-400 bg-sage-50";
                else if (wrongPick === choice)
                  cls = "border-terracotta-300 bg-terracotta-50";
                return (
                  <button
                    key={choice}
                    onClick={() => pick(choice)}
                    disabled={solved}
                    className={`rounded-xl border-2 px-4 py-2.5 text-left font-mono text-xs sm:text-sm ${cls}`}
                  >
                    <CodeLine text={choice} light />
                    {solved && choice === blank.correct && " ✅"}
                    {wrongPick === choice && " ❌"}
                  </button>
                );
              })}
            </div>

            {wrongPick && !solved && (
              <p className="mt-2 text-xs font-medium text-terracotta-600">{t("builder.tryAgain")}</p>
            )}

            <AnimatePresence>
              {solved && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-ink-700">
                    🌱 <InlineText text={blank.explanation} />
                  </div>
                  <button
                    onClick={next}
                    className="mt-3 rounded-full bg-honey-400 px-5 py-2.5 text-sm font-semibold text-ink-900 shadow-softer transition hover:bg-honey-500"
                  >
                    {globalStep === blanks.length - 1 ? t("builder.seeFinished") : t("builder.nextLine")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      ) : isLastRange ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-sage-50 p-4 text-sm leading-relaxed text-sage-800"
        >
          <InlineText text={t("builder.finalCongrats")} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-sage-50 p-4 text-sm leading-relaxed text-sage-800"
        >
          🌱 {t("builder.partialDone")}
        </motion.div>
      )}
    </div>
  );
}
