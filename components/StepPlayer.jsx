'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Mascot from './Mascot';
import PlaybackControls from './PlaybackControls';
import CodeTracer from './CodeTracer';

const SPEED_MS = { 1: 1500, 2: 1050, 3: 700, 4: 450, 5: 250 };

function moodForFrame(frame) {
  if (!frame) return 'happy';
  if (frame.finished) return 'excited';
  if (frame.adding?.length) return 'excited';
  if (frame.removing?.length || frame.comparing?.length) return 'thinking';
  return 'happy';
}

// A fully self-contained "watch it happen" clip: its own play/pause/step
// controls, its own speed, its own position - independent of any other
// player on the page. This is what lets the lesson show just loop 1, then
// later just loop 2, then later the whole thing, without the three clips
// fighting over shared state.
export default function StepPlayer({ frames, Visualizer, code, showTracer = false, target }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [frames]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (stepIndex >= frames.length - 1) {
      setIsPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => setStepIndex((i) => Math.min(i + 1, frames.length - 1)), SPEED_MS[speed]);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, frames.length, speed]);

  const frame = frames[stepIndex];

  return (
    <div className="flex flex-col gap-4">
      <Visualizer frame={frame} target={target} />

      <AnimatePresence mode="wait">
        <motion.div
          key={frame?.message}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-3 rounded-3xl bg-cream-100 p-4"
        >
          <Mascot size={40} mood={moodForFrame(frame)} />
          <p className="pt-1.5 text-sm leading-relaxed text-ink-700 sm:text-base">{frame?.message}</p>
        </motion.div>
      </AnimatePresence>

      {showTracer && code && <CodeTracer code={code} frame={frame} />}

      <PlaybackControls
        stepIndex={stepIndex}
        totalSteps={frames.length}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepBack={() => setStepIndex((i) => Math.max(0, i - 1))}
        onStepForward={() => setStepIndex((i) => Math.min(frames.length - 1, i + 1))}
        onReset={() => {
          setStepIndex(0);
          setIsPlaying(false);
        }}
        speed={speed}
        onSpeedChange={setSpeed}
      />
    </div>
  );
}
