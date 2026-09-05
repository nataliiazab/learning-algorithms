'use client';

import { useTranslation } from '@/lib/i18n/LocaleContext';

export default function PlaybackControls({
  stepIndex,
  totalSteps,
  isPlaying,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  onReset,
  speed,
  onSpeedChange,
}) {
  const { t } = useTranslation();
  const atStart = stepIndex === 0;
  const atEnd = stepIndex >= totalSteps - 1;

  const btn = 'flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg shadow-softer transition hover:bg-cream-100 disabled:opacity-30 disabled:hover:bg-white';

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-cream-300 bg-cream-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-center gap-2">
        <button aria-label={t('controls.reset')} onClick={onReset} className={btn}>
          🔄
        </button>
        <button aria-label={t('controls.previousStep')} onClick={onStepBack} disabled={atStart} className={btn}>
          ⏮
        </button>
        {isPlaying ? (
          <button
            aria-label={t('controls.pause')}
            onClick={onPause}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-500 text-xl text-white shadow-soft transition hover:bg-terracotta-600"
          >
            ⏸
          </button>
        ) : (
          <button
            aria-label={t('controls.play')}
            onClick={onPlay}
            disabled={atEnd}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-500 text-xl text-white shadow-soft transition hover:bg-sage-600 disabled:opacity-30"
          >
            ▶
          </button>
        )}
        <button aria-label={t('controls.nextStep')} onClick={onStepForward} disabled={atEnd} className={btn}>
          ⏭
        </button>
      </div>

      <div className="flex flex-1 items-center gap-3 sm:max-w-xs">
        <span aria-hidden className="text-lg">
          🐢
        </span>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-cream-200 accent-sage-500"
          aria-label={t('controls.speed')}
        />
        <span aria-hidden className="text-lg">
          🐇
        </span>
      </div>

      <div className="text-center text-sm font-medium text-ink-500 sm:text-right">
        {t('controls.stepOf', { current: Math.min(stepIndex + 1, totalSteps), total: totalSteps })}
      </div>
    </div>
  );
}
