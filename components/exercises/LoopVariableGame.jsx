"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "../Mascot";
import Confetti from "../Confetti";
import { useTranslation } from "@/lib/i18n/LocaleContext";

const CATEGORY_META = [
  {
    key: "loop",
    labelKey: "game.catLoop",
    tone: "border-honey-400 bg-honey-100 text-honey-600",
  },
  {
    key: "variable",
    labelKey: "game.catVariable",
    tone: "border-sage-400 bg-sage-100 text-sage-700",
  },
  {
    key: "pointer",
    labelKey: "game.catPointer",
    tone: "border-lavender-400 bg-lavender-100 text-lavender-700",
  },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// A fast, low-stakes "sorting game" - is this a loop, a variable, or a
// pointer? - meant to cement the vocabulary from CodeConcepts before the
// learner has to actually trace the code. Rounds are randomized each play
// so replaying doesn't feel stale.
export default function LoopVariableGame({ items }) {
  const { t } = useTranslation();
  // Order is randomized, so - same as SlidingWindowChallenge - it's
  // generated client-side in an effect, not during the initial render,
  // to avoid a server/client hydration mismatch.
  const [order, setOrder] = useState(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setOrder(shuffle(items.map((_, i) => i)));
  }, [items]);

  if (!order) {
    return (
      <div className="rounded-3xl border border-lavender-200 bg-lavender-50/40 p-8 text-center text-sm text-ink-500">
        {t("game.shuffling")}
      </div>
    );
  }

  const current = items[order[index]];
  const isCorrect = picked === current.answer;

  function pick(key) {
    if (picked) return;
    setPicked(key);
    if (key === current.answer) {
      setStreak((s) => s + 1);
      setBestStreak((b) => Math.max(b, streak + 1));
      setCorrectCount((c) => c + 1);
    } else {
      setStreak(0);
    }
  }

  function next() {
    if (index + 1 >= order.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
    }
  }

  function playAgain() {
    setOrder(shuffle(items.map((_, i) => i)));
    setIndex(0);
    setPicked(null);
    setStreak(0);
    setCorrectCount(0);
    setFinished(false);
  }

  if (finished) {
    const great = correctCount === items.length;
    return (
      <div className="relative overflow-hidden rounded-3xl border border-lavender-200 bg-lavender-50/40 p-8 text-center">
        <Confetti show={great} />
        <Mascot mood={great ? "excited" : "happy"} size={64} />
        <h3 className="mt-2 font-heading text-xl text-ink-900">
          {t("game.finalScore", {
            correct: correctCount,
            total: items.length,
            best: bestStreak,
          })}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
          {great ? t("game.perfect") : t("game.notPerfect")}
        </p>
        <button
          onClick={playAgain}
          className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink-700 shadow-softer transition hover:bg-cream-100"
        >
          {t("game.playAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-lavender-200 bg-lavender-50/40 p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mascot
            size={40}
            mood={picked ? (isCorrect ? "excited" : "oops") : "thinking"}
          />
          <div>
            <h3 className="font-heading text-lg text-ink-900">
              {t("game.title")}
            </h3>
            <p className="text-xs text-ink-500">
              {t("game.round", { current: index + 1, total: order.length })}
            </p>
          </div>
        </div>
        {streak > 1 && (
          <motion.span
            key={streak}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full bg-honey-100 px-3 py-1 text-xs font-bold text-honey-600"
          >
            {t("game.streak", { n: streak })}
          </motion.span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-5 flex items-center justify-center">
            {current.isCode ? (
              <code className="rounded-xl bg-ink-900 px-4 py-3 font-mono text-sm text-cream-100 sm:text-base">
                {current.term}
              </code>
            ) : (
              <span className="rounded-xl bg-white px-5 py-3 font-mono text-lg font-bold text-ink-900 shadow-softer">
                {current.term}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {CATEGORY_META.map((cat) => {
              let cls = "border-cream-300 bg-white hover:border-ink-300";
              if (picked) {
                if (cat.key === current.answer) cls = cat.tone;
                else if (cat.key === picked)
                  cls =
                    "border-terracotta-300 bg-terracotta-50 text-terracotta-700";
                else cls = "border-cream-200 bg-cream-50 text-ink-300";
              }
              return (
                <button
                  key={cat.key}
                  onClick={() => pick(cat.key)}
                  disabled={!!picked}
                  className={`rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition ${cls}`}
                >
                  {t(cat.labelKey)}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {picked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 overflow-hidden"
              >
                <div className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-ink-700">
                  {isCorrect ? "✅ " : "💭 "}
                  {current.feedback}
                </div>
                <button
                  onClick={next}
                  className="mt-3 rounded-full bg-lavender-400 px-5 py-2.5 text-sm font-semibold text-white shadow-softer transition hover:bg-lavender-500"
                >
                  {index + 1 === order.length
                    ? t("game.seeScore")
                    : t("game.nextRound")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
