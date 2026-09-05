"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "../Mascot";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickDistractors(array, excludeIndex, count) {
  const pool = array.filter((_, idx) => idx !== excludeIndex);
  return shuffle(pool).slice(0, count);
}

function randomPuzzle() {
  const n = 6 + Math.floor(Math.random() * 3); // 6-8 numbers
  const k = Math.min(2 + Math.floor(Math.random() * 3), n - 2); // 2-4, always room to slide once
  const pool = new Set();
  while (pool.size < n) pool.add(1 + Math.floor(Math.random() * 24));
  const array = [...pool];
  const oldSum = array.slice(0, k).reduce((a, b) => a + b, 0);
  const leaving = array[0];
  const entering = array[k];
  const newSum = oldSum - leaving + entering;
  return {
    array,
    k,
    oldSum,
    leaving,
    entering,
    newSum,
    leavingOptions: shuffle([leaving, ...pickDistractors(array, 0, 2)]),
    enteringOptions: shuffle([entering, ...pickDistractors(array, k, 2)]),
  };
}

// A hands-on drill for the one move that makes sliding window click: when the
// window slides right, you drop the old left edge and pick up a new right
// edge - no re-adding the whole window. This is deliberately *not* generic
// across algorithm types; if another algorithm ever wants its own practice
// drill, register it in exercises/index.js the same way this one is.
export default function SlidingWindowChallenge() {
  // Puzzles are randomized, so they're generated client-side only (in an
  // effect) rather than during the initial render - otherwise the server's
  // random puzzle and the client's random puzzle would differ and React
  // would throw a hydration mismatch. `puzzle` starts `null` and the very
  // first real render (server AND client) simply shows a loading state.
  const [puzzle, setPuzzle] = useState(null);
  const [leavingGuess, setLeavingGuess] = useState(null);
  const [enteringGuess, setEnteringGuess] = useState(null);
  const [sumGuess, setSumGuess] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setPuzzle(randomPuzzle());
  }, []);

  if (!puzzle) {
    return (
      <div className="rounded-3xl border border-honey-200 bg-honey-50/40 p-8 text-center text-sm text-ink-500">
        🌱 Growing a puzzle for you...
      </div>
    );
  }

  const {
    array,
    k,
    oldSum,
    leaving,
    entering,
    newSum,
    leavingOptions,
    enteringOptions,
  } = puzzle;

  const leavingCorrect = leavingGuess === leaving;
  const enteringCorrect = enteringGuess === entering;
  const sumCorrect = Number(sumGuess) === newSum;
  const allCorrect = leavingCorrect && enteringCorrect && sumCorrect;
  const canSubmit =
    leavingGuess !== null && enteringGuess !== null && sumGuess.trim() !== "";

  function newPuzzle() {
    setPuzzle(randomPuzzle());
    setLeavingGuess(null);
    setEnteringGuess(null);
    setSumGuess("");
    setSubmitted(false);
  }

  function optionClasses(isSelected, isCorrectOption) {
    if (!submitted) {
      return isSelected
        ? "border-honey-400 bg-honey-100 text-ink-900"
        : "border-cream-300 bg-white hover:border-honey-300 hover:bg-honey-50";
    }
    if (isCorrectOption) return "border-sage-400 bg-sage-50 text-sage-800";
    if (isSelected)
      return "border-terracotta-300 bg-terracotta-50 text-terracotta-700";
    return "border-cream-200 bg-cream-50 text-ink-300";
  }

  return (
    <div className="rounded-3xl border border-honey-200 bg-honey-50/40 p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <Mascot
          size={44}
          mood={submitted ? (allCorrect ? "excited" : "oops") : "thinking"}
        />
        <div>
          <h3 className="font-heading text-lg text-ink-900">
            🎯 Practice the slide
          </h3>
          <p className="text-sm text-ink-500">
            This is the one move sliding window is built on - let&apos;s drill
            it until it&apos;s automatic.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={array.join(",") + k}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="mb-3 text-sm text-ink-700">
            Our window size is <strong>k = {k}</strong>. It&apos;s sitting at
            index 0–{k - 1}, with a sum of{" "}
            <strong className="text-honey-600">{oldSum}</strong>. We&apos;re
            about to slide it one step to the right.
          </p>

          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {array.map((value, index) => {
              const inWindow = index >= 0 && index <= k - 1;
              const isNext = index === k;
              return (
                <div
                  key={index}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-sm font-bold shadow-softer ${
                    inWindow
                      ? "border-honey-400 bg-honey-200 text-ink-900"
                      : isNext
                        ? "border-dashed border-sage-400 bg-white text-ink-700"
                        : "border-cream-300 bg-white text-ink-400"
                  }`}
                >
                  {value}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-2 text-sm font-semibold text-ink-900">
                1. Which number will leave the window?
              </p>
              <div className="flex flex-wrap gap-2">
                {leavingOptions.map((option) => (
                  <button
                    key={option}
                    disabled={submitted}
                    onClick={() => setLeavingGuess(option)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${optionClasses(leavingGuess === option, option === leaving)}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-ink-900">
                2. Which number will join the window?
              </p>
              <div className="flex flex-wrap gap-2">
                {enteringOptions.map((option) => (
                  <button
                    key={option}
                    disabled={submitted}
                    onClick={() => setEnteringGuess(option)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${optionClasses(enteringGuess === option, option === entering)}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-ink-900">
                3. What will the new window sum be?
              </p>
              <input
                type="number"
                disabled={submitted}
                value={sumGuess}
                onChange={(e) => setSumGuess(e.target.value)}
                placeholder="Type a number"
                className={`w-40 rounded-full border-2 px-4 py-2 text-sm font-semibold outline-none ${
                  submitted
                    ? sumCorrect
                      ? "border-sage-400 bg-sage-50 text-sage-800"
                      : "border-terracotta-300 bg-terracotta-50 text-terracotta-700"
                    : "border-cream-300 bg-white"
                }`}
              />
            </div>
          </div>

          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={!canSubmit}
              className="mt-6 rounded-full bg-honey-400 px-5 py-2.5 text-sm font-semibold text-ink-900 shadow-softer transition hover:bg-honey-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check my answers
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 overflow-hidden"
            >
              <div className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-ink-700">
                {allCorrect ? "🌟 " : "💭 "}
                The window drops <strong>{leaving}</strong> and picks up{" "}
                <strong>{entering}</strong>, so the new sum is{" "}
                <strong>
                  {oldSum} − {leaving} + {entering} = {newSum}
                </strong>
                .{" "}
                {allCorrect
                  ? "Nice work - that's exactly it!"
                  : "Take a look at the arithmetic above, then give a fresh puzzle a try."}
              </div>
              <button
                onClick={newPuzzle}
                className="mt-4 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 shadow-softer transition hover:bg-cream-100"
              >
                🔁 Try another puzzle
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
