'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LocaleContext';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-24 text-center">
      <span className="text-5xl">🌾</span>
      <h1 className="font-heading text-2xl text-ink-900">{t('notFound.title')}</h1>
      <p className="text-ink-500">{t('notFound.subtitle')}</p>
      <Link href="/" className="rounded-full bg-sage-500 px-5 py-2.5 text-sm font-semibold text-white shadow-softer hover:bg-sage-600">
        {t('detail.back')}
      </Link>
    </div>
  );
}
