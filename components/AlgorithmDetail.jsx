"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "./Badge";
import Mascot from "./Mascot";
import PlaybackControls from "./PlaybackControls";
import TryItYourself from "./TryItYourself";
import ComplexityChart from "./ComplexityChart";
import QuizSection from "./QuizSection";
import CodeBlock from "./CodeBlock";
import CodeTracer from "./CodeTracer";
import CodeConcepts from "./CodeConcepts";
import LoopVariableGame from "./exercises/LoopVariableGame";
import { getVisualizer } from "./visualizers";
import { getPracticeExercises } from "./exercises";
import { getAccent, badgeTone } from "@/lib/accentStyles";
import {
  getAdjacentAlgorithms,
  localizeAlgorithm,
} from "@/lib/algorithms/registry";
import { useTranslation } from "@/lib/i18n/LocaleContext";

const SPEED_MS = { 1: 1500, 2: 1050, 3: 700, 4: 450, 5: 250 };

function moodForFrame(frame, type) {
  if (!frame) return "happy";
  if (type === "search") {
    if (frame.found && frame.found >= 0) return "excited";
    if (frame.found === -1) return "oops";
    return "thinking";
  }
  if (type === "window") {
    if (frame.finished) return "excited";
    if (frame.adding?.length) return "excited";
    return "thinking";
  }
  if (frame.swapping?.length) return "excited";
  if (frame.comparing?.length) return "thinking";
  return "happy";
}

export default function AlgorithmDetail({ config: rawConfig }) {
  const { t, locale } = useTranslation();
  // All human-language content (title, analogy, quiz, ...) gets swapped for
  // its localized version here; anything not translated (code, bounds,
  // generateSteps, ...) just passes through untouched.
  const config = useMemo(
    () => localizeAlgorithm(rawConfig, locale),
    [rawConfig, locale],
  );

  const [array, setArray] = useState(config.defaultInput);
  const [target, setTarget] = useState(
    config.defaultTarget ?? config.defaultInput[0],
  );
  const [windowSize, setWindowSize] = useState(config.defaultWindowSize ?? 3);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  // Keep the window size valid whenever the array itself changes size.
  useEffect(() => {
    if (config.type !== "window") return;
    const maxWindow = Math.max(config.minWindow ?? 2, array.length - 1);
    setWindowSize((k) =>
      Math.min(Math.max(k, config.minWindow ?? 2), maxWindow),
    );
  }, [array, config.type, config.minWindow]);

  const steps = useMemo(() => {
    if (config.type === "search") return config.generateSteps(array, target);
    if (config.type === "window")
      return config.generateSteps(array, windowSize);
    return config.generateSteps(array);
  }, [config, array, target, windowSize]);

  // Whenever the input changes, jump back to the beginning.
  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }
    const timer = setTimeout(
      () => setStepIndex((i) => Math.min(i + 1, steps.length - 1)),
      SPEED_MS[speed],
    );
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length, speed]);

  const frame = steps[stepIndex];
  const accent = getAccent(config.accent);
  const Visualizer = getVisualizer(config.type);
  const practiceExercises = getPracticeExercises(config.type);
  const hasCodeTrace = config.code && steps.some((s) => s.codeLine != null);
  const { prev, next } = getAdjacentAlgorithms(config.slug);
  const showNav = prev && next && prev.slug !== config.slug;

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-8 sm:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-ink-500 transition hover:text-ink-900"
      >
        {t("detail.back")}
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${accent.soft} text-4xl`}
        >
          {config.emoji}
        </div>
        <div>
          <h1 className="font-heading text-3xl text-ink-900 sm:text-4xl">
            {config.title}
          </h1>
          <p className="mt-1 text-ink-500">{config.tagline}</p>
        </div>
      </div>
      <div className="mb-10 flex flex-wrap gap-2">
        <Badge tone={badgeTone(config.accent)}>{config.category}</Badge>
        <Badge tone="sand">{t(`difficulty.${config.difficulty}`)}</Badge>
        <Badge tone="sand">{t("card.minutes", { n: config.minutes })}</Badge>
      </div>

      {/* Analogy */}
      <section className="mb-10 flex flex-col gap-4 rounded-3xl border border-cream-300 bg-white/70 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
        <Mascot mood="happy" size={64} className="shrink-0" />
        <div>
          <h2 className="font-heading text-xl text-ink-900">
            {t("detail.whatIsIt")}
          </h2>
          <p className="mt-2 leading-relaxed text-ink-700">{config.analogy}</p>
        </div>
      </section>

      {/* Understand the code - meet the loops/variables, then a quick game to drill them, BEFORE watching the live trace below */}
      {config.codeConcepts && (
        <section className="mb-10">
          <CodeConcepts concepts={config.codeConcepts} />
        </section>
      )}

      {config.conceptGame && (
        <section className="mb-10">
          <LoopVariableGame items={config.conceptGame} />
        </section>
      )}

      {/* Try it yourself + visualizer */}
      <section className="mb-10 flex flex-col gap-4">
        <h2 className="font-heading text-xl text-ink-900">
          {t("detail.watchItHappen")}
        </h2>
        <TryItYourself
          config={config}
          array={array}
          setArray={setArray}
          target={target}
          setTarget={setTarget}
          windowSize={windowSize}
          setWindowSize={setWindowSize}
        />

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
            <Mascot size={40} mood={moodForFrame(frame, config.type)} />
            <p className="pt-1.5 text-sm leading-relaxed text-ink-700 sm:text-base">
              {frame?.message}
            </p>
          </motion.div>
        </AnimatePresence>

        {hasCodeTrace && <CodeTracer code={config.code} frame={frame} />}

        <PlaybackControls
          stepIndex={stepIndex}
          totalSteps={steps.length}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onStepBack={() => setStepIndex((i) => Math.max(0, i - 1))}
          onStepForward={() =>
            setStepIndex((i) => Math.min(steps.length - 1, i + 1))
          }
          onReset={() => {
            setStepIndex(0);
            setIsPlaying(false);
          }}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl text-ink-900">
          {t("detail.howItWorks")}
        </h2>
        <ol className="flex flex-col gap-3">
          {config.howItWorks.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-cream-300 bg-white/70 p-4"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${accent.soft} ${accent.softText} text-sm font-bold`}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-ink-700 sm:text-base">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Real code */}
      {config.code && (
        <section className="mb-10">
          <CodeBlock code={config.code} />
        </section>
      )}

      {/* Complexity */}
      <section className="mb-10">
        <ComplexityChart
          complexity={config.complexity}
          complexityPlain={config.complexityPlain}
        />
      </section>

      {/* Extra hands-on practice, for the ideas that need a bit more repetition */}
      {practiceExercises.map((Exercise, i) => (
        <section key={i} className="mb-10">
          <Exercise config={config} />
        </section>
      ))}

      {/* Quiz */}
      <section className="mb-14">
        <QuizSection
          slug={config.slug}
          quiz={config.quiz}
          accent={config.accent}
        />
      </section>

      {/* Prev/Next - hidden when there's only one lesson in the catalog */}
      {showNav && (
        <nav className="flex flex-col gap-3 border-t border-cream-300 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/algorithms/${prev.slug}`}
            className="flex-1 rounded-2xl border border-cream-300 bg-white/70 p-4 text-sm transition hover:bg-cream-100"
          >
            <span className="text-ink-500">{t("detail.previous")}</span>
            <p className="font-heading text-ink-900">
              {prev.emoji} {localizeAlgorithm(prev, locale).title}
            </p>
          </Link>
          <Link
            href={`/algorithms/${next.slug}`}
            className="flex-1 rounded-2xl border border-cream-300 bg-white/70 p-4 text-right text-sm transition hover:bg-cream-100"
          >
            <span className="text-ink-500">{t("detail.next")}</span>
            <p className="font-heading text-ink-900">
              {next.emoji} {localizeAlgorithm(next, locale).title}
            </p>
          </Link>
        </nav>
      )}
    </div>
  );
}
