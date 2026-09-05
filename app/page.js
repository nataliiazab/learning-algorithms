"use client";

import { motion } from "framer-motion";
import Mascot from "@/components/Mascot";
import AlgorithmCard from "@/components/AlgorithmCard";
import { algorithms, categories } from "@/lib/algorithms/registry";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      {/* Hero */}
      <section className="relative flex flex-col items-center gap-6 overflow-hidden py-16 text-center sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-4 h-56 w-56 rounded-blob bg-sage-100 opacity-70 animate-float"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-24 h-48 w-48 rounded-blob bg-blush-100 opacity-70 animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-blob bg-honey-100 opacity-60 animate-float"
          style={{ animationDelay: "3s" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Mascot size={110} mood="excited" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl font-heading text-4xl leading-tight text-ink-900 sm:text-5xl"
        >
          Learn algorithms without the intimidating jargon 🌱
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl text-lg text-ink-500"
        >
          Right now we&apos;re going deep on{" "}
          <strong className="text-ink-700">one</strong> algorithm at a time
          instead of spreading thin - plain language, real code you can trace
          line by line, and hands-on practice until it truly clicks. First up:
          Sliding Window.
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          href="#lessons"
          className="rounded-full bg-sage-500 px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-sage-600"
        >
          Start learning 🌿
        </motion.a>
      </section>

      {/* Lessons */}
      <section id="lessons" className="scroll-mt-20 pt-4">
        {categories.map((category) => (
          <div key={category} className="mb-14">
            <h2 className="mb-5 font-heading text-2xl text-ink-900">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {algorithms
                .filter((a) => a.category === category)
                .map((algorithm) => (
                  <AlgorithmCard key={algorithm.slug} algorithm={algorithm} />
                ))}
            </div>
          </div>
        ))}

        <p className="mb-14 text-center text-sm text-ink-300">
          More algorithms will grow here once this one is thriving. 🌱
        </p>
      </section>
    </div>
  );
}
