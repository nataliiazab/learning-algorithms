"use client";

import { motion } from "framer-motion";

const PARTICLES = ["🌸", "🌿", "✨", "🍃", "🌼", "💫", "🌻"];

// A light, dependency-free celebratory burst - no canvas libraries needed.
export default function Confetti({ show }) {
  if (!show) return null;
  const pieces = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((i) => {
        const angle = (i / pieces.length) * Math.PI * 2;
        const distance = 90 + Math.random() * 60;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 text-xl"
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, x, y, scale: 1.2, rotate: 180 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            {PARTICLES[i % PARTICLES.length]}
          </motion.span>
        );
      })}
    </div>
  );
}
