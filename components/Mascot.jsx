"use client";

import { motion } from "framer-motion";

// Sprout - the friendly little guide who hangs around explaining things.
// `mood` softly changes the face: 'happy' | 'excited' | 'thinking' | 'oops'
export default function Mascot({
  mood = "happy",
  size = 88,
  className = "",
  animate = true,
}) {
  const mouths = {
    happy: (
      <path
        d="M40 58 Q50 68 60 58"
        stroke="#3B2F2A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    ),
    excited: (
      <path
        d="M38 56 Q50 74 62 56 Q50 66 38 56 Z"
        fill="#3B2F2A"
        opacity="0.85"
      />
    ),
    thinking: (
      <path
        d="M42 60 Q50 60 58 58"
        stroke="#3B2F2A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    ),
    oops: <ellipse cx="50" cy="60" rx="6" ry="8" fill="#3B2F2A" />,
  };

  const content = (
    <svg
      viewBox="0 0 100 110"
      width={size}
      height={size}
      role="img"
      aria-label="Sprout the mascot"
    >
      {/* leaves */}
      <path
        d="M50 34 C34 26 24 6 24 6 C24 6 46 4 56 22 C60 30 56 34 50 34Z"
        fill="#7EA363"
      />
      <path
        d="M50 34 C66 26 76 6 76 6 C76 6 54 4 44 22 C40 30 44 34 50 34Z"
        fill="#96B77E"
      />
      {/* head/body */}
      <circle
        cx="50"
        cy="62"
        r="34"
        fill="#F3E9D7"
        stroke="#E9D9BE"
        strokeWidth="2"
      />
      {/* cheeks */}
      <circle cx="30" cy="66" r="6" fill="#EC9F96" opacity="0.6" />
      <circle cx="70" cy="66" r="6" fill="#EC9F96" opacity="0.6" />
      {/* eyes */}
      <circle cx="38" cy="54" r="4.5" fill="#3B2F2A" />
      <circle cx="62" cy="54" r="4.5" fill="#3B2F2A" />
      <circle cx="39.5" cy="52.5" r="1.3" fill="#fff" />
      <circle cx="63.5" cy="52.5" r="1.3" fill="#fff" />
      {mouths[mood] || mouths.happy}
    </svg>
  );

  if (!animate) return <div className={className}>{content}</div>;

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -6, 0], rotate: [0, 2, 0, -2, 0] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
    >
      {content}
    </motion.div>
  );
}
