'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { algorithms } from '@/lib/algorithms/registry';
import { getCompleted } from '@/lib/progress';
import { useTranslation } from '@/lib/i18n/LocaleContext';

function LanguageToggle() {
  const { locale, setLocale } = useTranslation();
  const btn = (code, label) =>
    `rounded-full px-2.5 py-1 text-xs font-bold transition ${
      locale === code ? 'bg-ink-900 text-cream-50' : 'text-ink-500 hover:text-ink-900'
    }`;
  return (
    <div className="flex items-center gap-0.5 rounded-full bg-cream-200 p-1" role="group" aria-label="Language">
      <button onClick={() => setLocale('en')} className={btn('en')} aria-pressed={locale === 'en'}>
        🇬🇧 EN
      </button>
      <button onClick={() => setLocale('uk')} className={btn('uk')} aria-pressed={locale === 'uk'}>
        🇺🇦 УКР
      </button>
    </div>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setCompletedCount(getCompleted().length);
    const onFocus = () => setCompletedCount(getCompleted().length);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-cream-300/70 bg-cream-50/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl text-ink-900">
          <span className="text-2xl" aria-hidden>
            🌱
          </span>
          AlgoGarden
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-sm font-medium text-sage-700 sm:flex">
            {t('nav.progress', { count: completedCount, total: algorithms.length })}
          </span>
          <LanguageToggle />
          <Link
            href="/"
            className="hidden rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-cream-50 shadow-softer transition hover:bg-ink-700 sm:inline-block"
          >
            {t('nav.allLessons')}
          </Link>
        </div>
      </div>
    </header>
  );
}
