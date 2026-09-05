"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "./Mascot";
import Confetti from "./Confetti";
import { markCompleted } from "@/lib/progress";
import { useTranslation } from "@/lib/i18n/LocaleContext";

export default function QuizSection({ slug, quiz, accent }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz[index];
  const isLast = index === quiz.length - 1;
  const isAnswered = selected !== null;
  const isCorrect = isAnswered && selected === question.correctIndex;

  function handleSelect(optionIndex) {
    if (isAnswered) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) setScore((s) => s + 1);
  }

  function handleNext() {
    if (isLast) {
      setFinished(true);
      markCompleted(slug);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  function handleRetry() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const great = score === quiz.length;
    return (
      <div className="relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl border border-sage-200 bg-sage-50 p-8 text-center">
        <Confetti show={great} />
        <Mascot mood={great ? "excited" : "happy"} size={72} />
        <h3 className="font-heading text-2xl text-ink-900">
          {t("quiz.scored", { score, total: quiz.length })}
        </h3>
        <p className="max-w-sm text-sm text-ink-500">
          {great ? t("quiz.perfect") : t("quiz.notPerfect")}
        </p>
        <button
          onClick={handleRetry}
          className="mt-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink-700 shadow-softer transition hover:bg-cream-100"
        >
          {t("quiz.tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-cream-300 bg-white/70 p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mascot
            size={40}
            mood={isAnswered ? (isCorrect ? "excited" : "oops") : "thinking"}
          />
          <div>
            <h3 className="font-heading text-lg text-ink-900">
              {t("quiz.title")}
            </h3>
            <p className="text-xs text-ink-500">
              {t("quiz.questionOf", { current: index + 1, total: quiz.length })}
            </p>
          </div>
        </div>
        <div className="h-2 w-24 overflow-hidden rounded-full bg-cream-200 sm:w-32">
          <div
            className="h-full rounded-full bg-sage-400 transition-all"
            style={{
              width: `${((index + (isAnswered ? 1 : 0)) / quiz.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          <p className="mb-4 text-base font-medium leading-relaxed text-ink-900">
            {question.question}
          </p>
          <div className="flex flex-col gap-2.5">
            {question.options.map((option, i) => {
              let stateClasses =
                "border-cream-300 bg-white hover:border-sage-300 hover:bg-sage-50";
              if (isAnswered) {
                if (i === question.correctIndex)
                  stateClasses = "border-sage-400 bg-sage-50 text-sage-800";
                else if (i === selected)
                  stateClasses =
                    "border-terracotta-300 bg-terracotta-50 text-terracotta-700";
                else stateClasses = "border-cream-200 bg-cream-50 text-ink-300";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isAnswered}
                  className={`rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition ${stateClasses}`}
                >
                  {option}
                  {isAnswered && i === question.correctIndex && " ✅"}
                  {isAnswered &&
                    i === selected &&
                    i !== question.correctIndex &&
                    " ❌"}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="rounded-2xl bg-cream-100 p-4 text-sm leading-relaxed text-ink-700">
                  {isCorrect ? "🌱 " : "💭 "}
                  {question.explanation}
                </div>
                <button
                  onClick={handleNext}
                  className="mt-4 w-full rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-ink-700 sm:w-auto"
                >
                  {isLast ? t("quiz.seeResults") : t("quiz.next")} →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
