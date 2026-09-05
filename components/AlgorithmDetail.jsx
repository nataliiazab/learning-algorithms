"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Badge from "./Badge";
import Mascot from "./Mascot";
import LessonStepper from "./LessonStepper";
import StepPlayer from "./StepPlayer";
import WalkthroughPart from "./WalkthroughPart";
import QuickCheck from "./QuickCheck";
import CodeConcepts from "./CodeConcepts";
import CodeBlock from "./CodeBlock";
import TryItYourself from "./TryItYourself";
import ComplexityChart from "./ComplexityChart";
import QuizSection from "./QuizSection";
import CodeBuilder from "./exercises/CodeBuilder";
import SlidingWindowChallenge from "./exercises/SlidingWindowChallenge";
import LoopVariableGame from "./exercises/LoopVariableGame";
import { getVisualizer } from "./visualizers";
import { getAccent, badgeTone } from "@/lib/accentStyles";
import { localizeAlgorithm } from "@/lib/algorithms/registry";
import { useTranslation } from "@/lib/i18n/LocaleContext";

// A guided, one-thing-at-a-time lesson path instead of a long page of
// independent sections: each stage introduces exactly one idea, shows it
// happening (an animation scoped to just that idea, where relevant), and
// - where it fits - asks the learner to write that piece of code
// themselves before moving on. Built specifically around Sliding Window's
// content right now; the pieces (WalkthroughPart, StepPlayer, QuickCheck,
// CodeBuilder's `range`) are all generic enough that a future algorithm
// could reuse the same shape.
export default function AlgorithmDetail({ config: rawConfig }) {
  const { t, locale } = useTranslation();
  const config = useMemo(() => localizeAlgorithm(rawConfig, locale), [rawConfig, locale]);

  const [array, setArray] = useState(config.defaultInput);
  const [target, setTarget] = useState(config.defaultTarget ?? config.defaultInput[0]);
  const [windowSize, setWindowSize] = useState(config.defaultWindowSize ?? 3);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (config.type !== "window") return;
    const maxWindow = Math.max(config.minWindow ?? 2, array.length - 1);
    setWindowSize((k) => Math.min(Math.max(k, config.minWindow ?? 2), maxWindow));
  }, [array, config.type, config.minWindow]);

  const steps = useMemo(() => {
    if (config.type === "search") return config.generateSteps(array, target);
    if (config.type === "window") return config.generateSteps(array, windowSize);
    return config.generateSteps(array);
  }, [config, array, target, windowSize]);

  useEffect(() => {
    setStageIndex(0);
  }, [config.slug]);

  const accent = getAccent(config.accent);
  const Visualizer = getVisualizer(config.type);

  // Scoped clips for the guided stages - generic off the `loop`/`finished`
  // tags any algorithm's generateSteps() can optionally provide.
  const buildFrames = useMemo(() => (steps.length ? [steps[0], ...steps.filter((f) => f.loop === "build")] : steps), [steps]);
  const slideFrames = useMemo(() => {
    const rest = steps.filter((f) => f.loop === "slide");
    return rest.length ? [...rest, steps[steps.length - 1]] : steps;
  }, [steps]);

  const parts = config.walkthrough?.parts || [];
  const blanks = config.codeBuilder?.blanks;

  const stages = [];

  stages.push({
    emoji: "📖",
    title: t("stage.story"),
    content: (
      <div className="flex flex-col gap-4 rounded-3xl border border-cream-300 bg-white/70 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
        <Mascot mood="happy" size={64} className="shrink-0" />
        <p className="text-base leading-relaxed text-ink-700">{config.analogy}</p>
      </div>
    ),
  });

  if (parts[0]) {
    stages.push({
      emoji: "🎧",
      title: t("stage.inputs"),
      content: (
        <>
          <WalkthroughPart part={parts[0]} />
          {config.quickChecks?.inputs && <QuickCheck {...config.quickChecks.inputs} />}
        </>
      ),
    });
  }

  if (parts[1] || parts[2]) {
    stages.push({
      emoji: "🏗️",
      title: t("stage.loop1"),
      content: (
        <>
          {parts[1] && <WalkthroughPart part={parts[1]} />}
          {parts[2] && <WalkthroughPart part={parts[2]} />}
          <div>
            <h3 className="mb-3 font-heading text-lg text-ink-900">{t("stage.watchIt")}</h3>
            <StepPlayer frames={buildFrames} Visualizer={Visualizer} code={config.code} showTracer target={target} />
          </div>
          {blanks && (
            <div>
              <h3 className="mb-3 font-heading text-lg text-ink-900">{t("stage.yourTurn")}</h3>
              <CodeBuilder config={config} range={[0, 1]} />
            </div>
          )}
        </>
      ),
    });
  }

  if (parts[3]) {
    stages.push({
      emoji: "🏆",
      title: t("stage.bestScore"),
      content: (
        <>
          <WalkthroughPart part={parts[3]} />
          {config.quickChecks?.bestScore && <QuickCheck {...config.quickChecks.bestScore} />}
          {blanks && (
            <div>
              <h3 className="mb-3 font-heading text-lg text-ink-900">{t("stage.yourTurn")}</h3>
              <CodeBuilder config={config} range={[1, 2]} />
            </div>
          )}
        </>
      ),
    });
  }

  if (parts[4]) {
    stages.push({
      emoji: "🚶",
      title: t("stage.loop2"),
      content: (
        <>
          <WalkthroughPart part={parts[4]} />
          <div>
            <h3 className="mb-3 font-heading text-lg text-ink-900">{t("stage.watchIt")}</h3>
            <StepPlayer frames={slideFrames} Visualizer={Visualizer} code={config.code} showTracer target={target} />
          </div>
          {blanks && (
            <div>
              <h3 className="mb-3 font-heading text-lg text-ink-900">{t("stage.yourTurn")}</h3>
              <CodeBuilder config={config} range={[2, blanks.length]} />
            </div>
          )}
        </>
      ),
    });
  }

  stages.push({
    emoji: "🎉",
    title: t("stage.recap"),
    content: (
      <>
        <p className="text-center text-sm text-ink-500">{t("stage.recapIntro")}</p>
        {parts[5] && <WalkthroughPart part={parts[5]} />}
        {config.codeConcepts && (
          <div>
            <h3 className="mb-3 font-heading text-lg text-ink-900">{t("stage.meetCast")}</h3>
            <CodeConcepts concepts={config.codeConcepts} />
          </div>
        )}
        {config.conceptGame && <LoopVariableGame items={config.conceptGame} />}
        {config.code && (
          <div>
            <h3 className="mb-3 font-heading text-lg text-ink-900">{t("stage.finishedFunction")}</h3>
            <CodeBlock code={config.code} />
          </div>
        )}
      </>
    ),
  });

  stages.push({
    emoji: "🧪",
    title: t("stage.tryit"),
    content: (
      <>
        <p className="text-center text-sm text-ink-500">{t("stage.tryitIntro")}</p>
        <TryItYourself
          config={config}
          array={array}
          setArray={setArray}
          target={target}
          setTarget={setTarget}
          windowSize={windowSize}
          setWindowSize={setWindowSize}
        />
        <StepPlayer frames={steps} Visualizer={Visualizer} code={config.code} showTracer target={target} />
        {config.type === "window" && <SlidingWindowChallenge />}
        <ComplexityChart complexity={config.complexity} complexityPlain={config.complexityPlain} />
      </>
    ),
  });

  stages.push({
    emoji: "📝",
    title: t("stage.quiz"),
    content: <QuizSection slug={config.slug} quiz={config.quiz} accent={config.accent} />,
  });

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-8 sm:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-ink-500 transition hover:text-ink-900"
      >
        {t("detail.back")}
      </Link>

      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${accent.soft} text-4xl`}>
          {config.emoji}
        </div>
        <div>
          <h1 className="font-heading text-3xl text-ink-900 sm:text-4xl">{config.title}</h1>
          <p className="mt-1 text-ink-500">{config.tagline}</p>
        </div>
      </div>
      <div className="mb-10 flex flex-wrap gap-2">
        <Badge tone={badgeTone(config.accent)}>{config.category}</Badge>
        <Badge tone="sand">{t(`difficulty.${config.difficulty}`)}</Badge>
        <Badge tone="sand">{t("card.minutes", { n: config.minutes })}</Badge>
      </div>

      <LessonStepper stageIndex={stageIndex} setStageIndex={setStageIndex} stages={stages} accentDot={accent.dot} />
    </div>
  );
}
