'use client';

import { motion, AnimatePresence } from 'framer-motion';

// Fixed cell sizing so we can animate a literal highlight box sliding
// across the row (rather than just recoloring cells in place).
const CELL = 56; // px, matches w-14
const GAP = 10; // px, matches gap-2.5
const PITCH = CELL + GAP;

function StatCard({ label, value, tone, icon }) {
  const tones = {
    sage: 'bg-sage-50 border-sage-200 text-sage-700',
    honey: 'bg-honey-50 border-honey-200 text-honey-600',
  };
  return (
    <div className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl border-2 px-4 py-3 ${tones[tone]}`}>
      <span className="text-xs font-medium uppercase tracking-wide opacity-80">
        {icon} {label}
      </span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold"
        >
          {value === null ? '—' : value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Renders one "frame" produced by sliding window's generateSteps().
export default function WindowVisualizer({ frame }) {
  if (!frame) return null;
  const { array, windowStart, windowEnd, removing = [], adding = [], building = [], currentSum, bestSum, bestStart, bestEnd, finished } = frame;

  const rowWidth = array.length * PITCH - GAP;
  const windowLeft = windowStart * PITCH;
  const windowWidth = (windowEnd - windowStart + 1) * PITCH - GAP;
  const hasBest = bestStart !== null && bestStart !== undefined;
  const bestLeft = hasBest ? bestStart * PITCH : 0;
  const bestWidth = hasBest ? (bestEnd - bestStart + 1) * PITCH - GAP : 0;
  const showBestOutline = hasBest && !finished && (bestStart !== windowStart || bestEnd !== windowEnd);

  const roleFor = (index) => {
    if (removing.includes(index)) return 'removing';
    if (adding.includes(index)) return 'adding';
    if (building.includes(index)) return 'building';
    if (index >= windowStart && index <= windowEnd) return 'inWindow';
    return 'idle';
  };

  const cellStyles = {
    removing: 'bg-terracotta-400 text-white border-terracotta-500',
    adding: 'bg-sage-400 text-white border-sage-500',
    building: 'bg-honey-300 text-ink-900 border-honey-400',
    inWindow: finished ? 'bg-sage-500 text-white border-sage-600' : 'bg-honey-200 text-ink-900 border-honey-300',
    idle: 'bg-white text-ink-500 border-cream-300',
  };

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-cream-300 bg-white/70 p-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <StatCard label="Window sum" value={currentSum} tone="honey" icon="🪟" />
        <StatCard label="Best sum" value={bestSum} tone="sage" icon="🏆" />
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="relative mx-auto" style={{ width: rowWidth, minWidth: rowWidth }}>
          {/* the literal sliding window, animated as one continuous box */}
          <motion.div
            layout
            animate={{ x: windowLeft, width: windowWidth }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="absolute -top-2 h-[calc(100%+2.75rem)] rounded-2xl border-2 border-dashed border-honey-400 bg-honey-50/60"
            style={{ zIndex: 0 }}
          />
          {/* a ghost outline marking the current best window, when elsewhere */}
          {showBestOutline && (
            <motion.div
              layout
              animate={{ x: bestLeft, width: bestWidth }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="absolute -top-2 h-[calc(100%+2.75rem)] rounded-2xl border-2 border-sage-400/70"
              style={{ zIndex: 0 }}
            />
          )}

          <div className="relative z-10 mb-1 h-6">
            <motion.span
              aria-hidden
              className="absolute -top-1 text-2xl"
              animate={{ x: windowLeft + windowWidth / 2 - 14 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            >
              🐛
            </motion.span>
          </div>

          <div className="relative z-10 flex gap-2.5">
            {array.map((value, index) => {
              const role = roleFor(index);
              return (
                <motion.div
                  key={index}
                  layout
                  animate={{ scale: role === 'idle' ? 1 : 1.06 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 text-base font-bold shadow-softer transition-colors ${cellStyles[role]}`}
                >
                  {value}
                </motion.div>
              );
            })}
          </div>
          <div className="relative z-10 mt-1.5 flex gap-2.5">
            {array.map((_, index) => (
              <div key={index} className="flex h-4 w-14 shrink-0 items-center justify-center text-[10px] text-ink-300">
                {index}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-ink-500">
        {finished
          ? `🏆 Best window: index ${bestStart}–${bestEnd}`
          : `🪟 Current window: index ${windowStart}–${windowEnd}`}
      </p>
    </div>
  );
}
