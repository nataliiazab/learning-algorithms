'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Mascot from './Mascot';
import { useTranslation } from '@/lib/i18n/LocaleContext';

function FlipCard({ emoji, title, subtitle, code, explanation }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="flex flex-col gap-2 rounded-2xl border-2 border-cream-300 bg-white p-4 text-left transition hover:border-honey-300 hover:shadow-softer"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <div>
          <p className="font-heading text-base text-ink-900">{title}</p>
          {subtitle && <p className="text-xs font-semibold uppercase tracking-wide text-honey-500">{subtitle}</p>}
        </div>
        <span className="ml-auto text-ink-300">{open ? '▲' : '▼'}</span>
      </div>
      {code && <code className="rounded-lg bg-ink-900 px-2 py-1 font-mono text-xs text-cream-100">{code}</code>}
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden text-sm leading-relaxed text-ink-700"
          >
            {explanation}
          </motion.p>
        )}
      </AnimatePresence>
      {!open && <p className="text-xs text-ink-300">{t('concepts.tapToReveal')}</p>}
    </button>
  );
}

// The missing piece before diving into the code trace: plain, playful
// introductions to the two loops and the handful of variables involved,
// so the reader knows who's who before watching them move.
export default function CodeConcepts({ concepts }) {
  const { t } = useTranslation();
  if (!concepts) return null;
  return (
    <div className="rounded-3xl border border-honey-200 bg-honey-50/40 p-6 sm:p-8">
      <div className="mb-5 flex items-start gap-3">
        <Mascot size={48} mood="happy" />
        <div>
          <h3 className="font-heading text-lg text-ink-900">{t('concepts.title')}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-700">{concepts.intro}</p>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">🔁</span>
        <h4 className="font-heading text-base text-ink-900">{t('concepts.loopsHeading')}</h4>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {concepts.loops.map((loop) => (
          <FlipCard key={loop.name} emoji={loop.emoji} title={loop.name} code={loop.code} explanation={loop.explanation} />
        ))}
      </div>

      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">📦</span>
        <h4 className="font-heading text-base text-ink-900">{t('concepts.variablesHeading')}</h4>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {concepts.variables.map((v) => (
          <FlipCard key={v.name} emoji={v.emoji} title={v.name} subtitle={v.nickname} explanation={v.explanation} />
        ))}
      </div>
    </div>
  );
}
