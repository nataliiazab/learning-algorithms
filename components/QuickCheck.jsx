'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Mascot from './Mascot';
import { useTranslation } from '@/lib/i18n/LocaleContext';

// A single, low-stakes question embedded right inside a lesson stage - not
// a whole quiz flow, just "does this one idea make sense yet?" with instant
// feedback. No submit button: picking an option IS the answer.
export default function QuickCheck({ question, options, correctIndex, explanation }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const isAnswered = selected !== null;
  const isCorrect = isAnswered && selected === correctIndex;

  return (
    <div className="rounded-3xl border-2 border-dashed border-lavender-200 bg-lavender-50/40 p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <Mascot size={32} mood={isAnswered ? (isCorrect ? 'excited' : 'oops') : 'thinking'} animate={false} />
        <p className="text-xs font-bold uppercase tracking-wide text-lavender-600">{t('quickcheck.title')}</p>
      </div>
      <p className="mb-3 text-sm font-medium leading-relaxed text-ink-900 sm:text-base">{question}</p>
      <div className="flex flex-col gap-2">
        {options.map((option, i) => {
          let cls = 'border-cream-300 bg-white hover:border-lavender-300 hover:bg-lavender-50';
          if (isAnswered) {
            if (i === correctIndex) cls = 'border-sage-400 bg-sage-50 text-sage-800';
            else if (i === selected) cls = 'border-terracotta-300 bg-terracotta-50 text-terracotta-700';
            else cls = 'border-cream-200 bg-cream-50 text-ink-300';
          }
          return (
            <button
              key={i}
              onClick={() => !isAnswered && setSelected(i)}
              disabled={isAnswered}
              className={`rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition ${cls}`}
            >
              {option}
              {isAnswered && i === correctIndex && ' ✅'}
              {isAnswered && i === selected && i !== correctIndex && ' ❌'}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {isAnswered && explanation && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 overflow-hidden text-sm leading-relaxed text-ink-700"
          >
            {isCorrect ? '🌱 ' : '💭 '}
            {explanation}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
