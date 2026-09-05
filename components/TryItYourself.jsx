'use client';

import { useState } from 'react';

function randomArray({ minSize, maxSize, minValue, maxValue }) {
  const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
  return Array.from({ length: size }, () => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
}

function randomSortedUniqueArray({ minSize, maxSize, minValue, maxValue }) {
  const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
  const pool = new Set();
  while (pool.size < size) {
    pool.add(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
  }
  return [...pool].sort((a, b) => a - b);
}

export default function TryItYourself({ config, array, setArray, target, setTarget, windowSize, setWindowSize }) {
  const [customText, setCustomText] = useState(array.join(', '));
  const [error, setError] = useState('');

  function applyCustom() {
    const parts = customText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number);

    if (parts.some((n) => Number.isNaN(n))) {
      setError('Hmm, that doesn’t look like a list of numbers. Try something like 4, 8, 2, 9 🌿');
      return;
    }
    if (parts.length < config.minSize || parts.length > config.maxSize) {
      setError(`Please give me between ${config.minSize} and ${config.maxSize} numbers.`);
      return;
    }
    setError('');
    setArray(parts);
  }

  if (config.type === 'search') {
    function shuffle() {
      const next = randomSortedUniqueArray(config);
      setArray(next);
      setTarget(next[Math.floor(Math.random() * next.length)]);
    }
    function tryTricky() {
      let candidate;
      do {
        candidate = Math.floor(Math.random() * (config.maxValue - config.minValue + 1)) + config.minValue;
      } while (array.includes(candidate));
      setTarget(candidate);
    }

    return (
      <div className="flex flex-col gap-3 rounded-3xl border border-cream-300 bg-cream-50/70 p-5">
        <p className="text-sm font-semibold text-ink-900">🧪 Try it yourself</p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={shuffle}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-softer transition hover:bg-cream-100"
          >
            🔀 New sorted list
          </button>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            Search for:
            <select
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="rounded-full border border-cream-300 bg-white px-3 py-1.5 text-sm font-semibold text-terracotta-600"
            >
              {(array.includes(target) ? array : [...array, target].sort((a, b) => a - b)).map((v) => (
                <option key={v} value={v}>
                  {v}
                  {!array.includes(v) ? ' (not in list)' : ''}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={tryTricky}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-softer transition hover:bg-cream-100"
          >
            🎯 Try a number that&apos;s not there
          </button>
        </div>
      </div>
    );
  }

  function shuffleSort() {
    const next = randomArray(config);
    setArray(next);
    setCustomText(next.join(', '));
    setError('');
  }

  const maxWindow = Math.max(config.minWindow ?? 2, array.length - 1);

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-cream-300 bg-cream-50/70 p-5">
      <p className="text-sm font-semibold text-ink-900">🧪 Try it yourself</p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={shuffleSort}
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-softer transition hover:bg-cream-100"
        >
          🔀 Shuffle numbers
        </button>
        <div className="flex items-center gap-2">
          <input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="e.g. 5, 2, 8, 1"
            className="w-40 rounded-full border border-cream-300 bg-white px-3 py-1.5 text-sm text-ink-900 sm:w-56"
          />
          <button
            onClick={applyCustom}
            className="rounded-full bg-sage-500 px-4 py-2 text-sm font-medium text-white shadow-softer transition hover:bg-sage-600"
          >
            Use these
          </button>
        </div>
      </div>
      {config.type === 'window' && (
        <label className="flex items-center gap-3 text-sm text-ink-700">
          <span className="font-medium">🪟 Window size (k): {windowSize}</span>
          <input
            type="range"
            min={config.minWindow ?? 2}
            max={maxWindow}
            step={1}
            value={Math.min(windowSize, maxWindow)}
            onChange={(e) => setWindowSize(Number(e.target.value))}
            className="h-2 w-40 cursor-pointer appearance-none rounded-full bg-cream-200 accent-honey-400"
          />
        </label>
      )}
      {error && <p className="text-xs font-medium text-terracotta-600">{error}</p>}
    </div>
  );
}
