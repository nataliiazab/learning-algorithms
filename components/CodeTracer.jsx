"use client";

import { motion, AnimatePresence } from "framer-motion";
import { tokenize, TOKEN_CLASSES } from "@/lib/highlight";
import { useTranslation } from "@/lib/i18n/LocaleContext";

function VarChip({ name, value }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border-2 border-honey-200 bg-white px-3 py-1 text-xs font-mono">
      <span className="font-semibold text-ink-500">{name}</span>
      <span className="text-ink-300">=</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="font-bold text-honey-600"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// The heart of "explain the loops": shows the *actual* code with the
// currently-executing line highlighted, in lockstep with the array
// animation and playback controls elsewhere on the page (they all share
// the same `frame`, produced by the algorithm's generateSteps()).
export default function CodeTracer({ code, frame }) {
  const { t } = useTranslation();
  if (!frame) return null;
  const lines = code.split("\n");
  const activeLine = frame.codeLine;
  const vars = frame.vars || {};

  const loopBlurb =
    frame.loop === "build"
      ? t("tracer.loopBuild")
      : frame.loop === "slide"
        ? t("tracer.loopSlide")
        : t("tracer.loopNone");

  return (
    <div className="overflow-hidden rounded-3xl border border-cream-300 bg-white/70">
      <div className="flex flex-col gap-2 border-b border-cream-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-heading text-lg text-ink-900">
            {t("tracer.title")}
          </h3>
          <p className="text-sm text-ink-500">{loopBlurb}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(vars).map(([name, value]) => (
            <VarChip key={name} name={name} value={value} />
          ))}
        </div>
      </div>
      <pre className="overflow-x-auto bg-ink-900 px-2 py-4 text-sm leading-relaxed">
        <code className="font-mono">
          {lines.map((line, i) => {
            const lineNo = i + 1;
            const isActive = lineNo === activeLine;
            const tokens = tokenize(line || " ");
            return (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: isActive
                    ? "rgba(238, 169, 46, 0.18)"
                    : "rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.2 }}
                className={`flex gap-4 rounded-md px-3 ${isActive ? "border-l-4 border-honey-400" : "border-l-4 border-transparent"}`}
              >
                <span className="w-5 shrink-0 select-none text-right text-ink-300/60">
                  {lineNo}
                </span>
                <span className="whitespace-pre">
                  {tokens.map((t, ti) => (
                    <span key={ti} className={TOKEN_CLASSES[t.type]}>
                      {t.text}
                    </span>
                  ))}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="active-line-arrow"
                    className="ml-auto shrink-0 text-honey-400"
                  >
                    ◀
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
