'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Badge from './Badge';
import { getAccent, badgeTone } from '@/lib/accentStyles';
import { isCompleted } from '@/lib/progress';
import { localizeAlgorithm } from '@/lib/algorithms/registry';
import { useTranslation } from '@/lib/i18n/LocaleContext';

export default function AlgorithmCard({ algorithm: rawAlgorithm }) {
  const { t, locale } = useTranslation();
  const algorithm = localizeAlgorithm(rawAlgorithm, locale);
  const accent = getAccent(algorithm.accent);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isCompleted(algorithm.slug));
  }, [algorithm.slug]);

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
      <Link
        href={`/algorithms/${algorithm.slug}`}
        className={`group relative flex h-full flex-col gap-4 rounded-3xl border ${accent.border} bg-white/70 p-6 shadow-softer transition hover:shadow-soft`}
      >
        {done && (
          <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-sage-500 text-sm shadow-softer">
            ✓
          </span>
        )}
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent.soft} text-3xl`}>
          {algorithm.emoji}
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-xl text-ink-900">{algorithm.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{algorithm.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={badgeTone(algorithm.accent)}>{algorithm.category}</Badge>
          <Badge tone="sand">{t(`difficulty.${algorithm.difficulty}`)}</Badge>
          <Badge tone="sand">{t('card.minutes', { n: algorithm.minutes })}</Badge>
        </div>
        <span className={`mt-1 inline-flex items-center gap-1 text-sm font-semibold ${accent.text}`}>
          {t('card.startLearning')}
          <span className="transition group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </motion.div>
  );
}
