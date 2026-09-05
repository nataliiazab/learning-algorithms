'use client';

import { motion } from 'framer-motion';

// Renders one "frame" produced by a sorting algorithm's generateSteps().
// Bars keep a stable `id` (their original index) so framer-motion can
// smoothly animate them sliding into their new positions.
export default function SortVisualizer({ frame }) {
  if (!frame) return null;
  const { array, comparing = [], swapping = [], sortedIndices = [] } = frame;
  const maxValue = Math.max(...array.map((it) => it.value), 1);

  const colorFor = (index) => {
    if (sortedIndices.includes(index)) return 'bg-sage-500';
    if (swapping.includes(index)) return 'bg-terracotta-500';
    if (comparing.includes(index)) return 'bg-honey-400';
    return 'bg-lavender-300';
  };

  return (
    <div className="flex h-56 items-end justify-center gap-2 rounded-3xl border border-cream-300 bg-white/70 p-6 sm:gap-3">
      {array.map((item, index) => (
        <motion.div
          key={item.id}
          layout
          layoutId={`bar-${item.id}`}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="flex flex-1 flex-col items-center justify-end gap-2"
          style={{ maxWidth: 64 }}
        >
          <motion.span
            animate={{ scale: comparing.includes(index) || swapping.includes(index) ? 1.15 : 1 }}
            className="text-sm font-bold text-ink-700"
          >
            {item.value}
          </motion.span>
          <motion.div
            layout
            className={`w-full rounded-t-xl rounded-b-md ${colorFor(index)} shadow-softer`}
            style={{ height: `${16 + (item.value / maxValue) * 130}px` }}
          />
        </motion.div>
      ))}
    </div>
  );
}
