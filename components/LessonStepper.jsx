"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n/LocaleContext";

// The shell that turns "a long page of sections" into "a guided path":
// one stage visible at a time, a progress dot-row so you always know how
// far along you are, and Back/Next to move through it. Deliberately never
// force-blocks Next - exercises are encouraged, not mandatory gates.
export default function LessonStepper({
  stageIndex,
  setStageIndex,
  stages,
  accentDot = "bg-honey-400",
}) {
  const { t } = useTranslation();
  const total = stages.length;
  const stage = stages[stageIndex];
  const atStart = stageIndex === 0;
  const atEnd = stageIndex === total - 1;

  function goNext() {
    if (!atEnd) {
      setStageIndex((i) => i + 1);
      window.scrollTo({
        top: document.getElementById("lesson-path")?.offsetTop - 80 || 0,
        behavior: "smooth",
      });
    }
  }
  function goBack() {
    if (!atStart) {
      setStageIndex((i) => i - 1);
      window.scrollTo({
        top: document.getElementById("lesson-path")?.offsetTop - 80 || 0,
        behavior: "smooth",
      });
    }
  }

  return (
    <div id="lesson-path" className="scroll-mt-20">
      {/* progress */}
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5">
          {stages.map((s, i) => (
            <button
              key={i}
              onClick={() => setStageIndex(i)}
              aria-label={`${t("stepper.step")} ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === stageIndex
                  ? `w-7 ${accentDot}`
                  : i < stageIndex
                    ? "w-2.5 bg-sage-400"
                    : "w-2.5 bg-cream-300"
              }`}
            />
          ))}
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-300">
          {t("stepper.stepOf", { current: stageIndex + 1, total })}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stageIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="mb-5 text-center font-heading text-2xl text-ink-900 sm:text-3xl">
            {stage.emoji} {stage.title}
          </h2>
          <div className="flex flex-col gap-6">{stage.content}</div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={atStart}
          className="rounded-full border-2 border-cream-300 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 shadow-softer transition hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-0"
        >
          {t("stepper.back")}
        </button>
        {!atEnd && (
          <button
            onClick={goNext}
            className="rounded-full bg-ink-900 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-softer transition hover:bg-ink-700"
          >
            {t("stepper.next")}
          </button>
        )}
      </div>
    </div>
  );
}
