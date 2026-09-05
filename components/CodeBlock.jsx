'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokenize, TOKEN_CLASSES } from '@/lib/highlight';

export default function CodeBlock({ code }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const tokens = tokenize(code);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access can fail quietly (unsupported browser, permissions) — no big deal
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-cream-300 bg-white/70">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-6 text-left"
      >
        <div>
          <h3 className="font-heading text-lg text-ink-900">🧑‍💻 See it in real JavaScript</h3>
          <p className="text-sm text-ink-500">The exact logic behind the animation above, written as a runnable function.</p>
        </div>
        <span className="shrink-0 rounded-full bg-cream-100 px-4 py-2 text-sm font-semibold text-ink-700">
          {open ? 'Hide code' : 'Show me the code'}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="relative border-t border-cream-200 bg-ink-900 px-5 py-5">
              <button
                onClick={handleCopy}
                className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-cream-100 transition hover:bg-white/20"
              >
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
              <pre className="overflow-x-auto pr-16 text-sm leading-relaxed">
                <code className="font-mono">
                  {tokens.map((t, i) => (
                    <span key={i} className={TOKEN_CLASSES[t.type]}>
                      {t.text}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
