'use client';

import { useTranslation } from '@/lib/i18n/LocaleContext';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-24 border-t border-cream-300/70 bg-cream-100/60">
      <div className="mx-auto max-w-6xl px-5 py-10 text-center text-sm text-ink-500 sm:px-8">
        <p>{t('footer.line1')}</p>
        <p className="mt-1">{t('footer.line2')}</p>
      </div>
    </footer>
  );
}
