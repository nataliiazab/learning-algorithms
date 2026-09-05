import CodeBuilder from "./CodeBuilder";
import SlidingWindowChallenge from "./SlidingWindowChallenge";

// Optional, type-specific hands-on drills that go beyond the end-of-lesson
// quiz - used for the ideas that tend to need extra repetition. Most
// algorithm types won't need one; return an empty array and the section is
// simply skipped. Add a new component alongside this file and a new case
// here whenever a lesson needs its own dedicated practice exercise(s).
// Order matters: they're rendered in the order returned.
export function getPracticeExercises(type) {
  switch (type) {
    case "window":
      return [CodeBuilder, SlidingWindowChallenge];
    default:
      return [];
  }
}
