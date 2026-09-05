"use client";

import { motion, AnimatePresence } from "framer-motion";

// Renders one "frame" produced by binary search's generateSteps().
export default function SearchVisualizer({ frame, target }) {
  if (!frame) return null;
  const { array, low, high, mid, found, eliminated = [] } = frame;

  const stateFor = (index) => {
    if (found === index) return "found";
    if (index === mid) return "mid";
    if (eliminated.includes(index)) return "eliminated";
    if (index >= low && index <= high) return "inRange";
    return "eliminated";
  };

  const styles = {
    found: "bg-sage-500 text-white border-sage-600 scale-110",
    mid: "bg-honey-400 text-ink-900 border-honey-500 scale-110",
    inRange: "bg-white text-ink-900 border-terracotta-200",
    eliminated: "bg-cream-100 text-ink-300 border-cream-200 opacity-40",
  };

  return (
    <div className="rounded-3xl border border-cream-300 bg-white/70 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {array.map((value, index) => {
          const state = stateFor(index);
          return (
            <div key={index} className="flex flex-col items-center gap-1.5">
              <div className="h-5 text-xs font-bold text-honey-500">
                <AnimatePresence>
                  {index === mid && found === null && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      mid
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <motion.div
                layout
                animate={{
                  scale: state === "mid" || state === "found" ? 1.08 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-sm font-bold shadow-softer transition-colors sm:h-14 sm:w-14 ${styles[state]}`}
              >
                {value}
              </motion.div>
              <span className="text-[10px] text-ink-300">{index}</span>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-ink-500">
        🎯 Looking for{" "}
        <span className="font-bold text-terracotta-600">{target}</span>
        {found !== null && found !== -1 && " - found it above!"}
        {found === -1 && " - turns out it's not in the list."}
      </p>
    </div>
  );
}
