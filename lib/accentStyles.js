// Central place mapping an algorithm's "accent" key to literal Tailwind class
// strings. Classes are written out in full (never built with template
// strings) so Tailwind's content scanner can find them.
export const ACCENTS = {
  sage: {
    solid: "bg-sage-500",
    solidHover: "hover:bg-sage-600",
    soft: "bg-sage-100",
    softText: "text-sage-700",
    text: "text-sage-600",
    border: "border-sage-300",
    ring: "ring-sage-300",
    dot: "bg-sage-400",
  },
  terracotta: {
    solid: "bg-terracotta-500",
    solidHover: "hover:bg-terracotta-600",
    soft: "bg-terracotta-100",
    softText: "text-terracotta-700",
    text: "text-terracotta-600",
    border: "border-terracotta-300",
    ring: "ring-terracotta-300",
    dot: "bg-terracotta-400",
  },
  lavender: {
    solid: "bg-lavender-500",
    solidHover: "hover:bg-lavender-600",
    soft: "bg-lavender-100",
    softText: "text-lavender-700",
    text: "text-lavender-600",
    border: "border-lavender-300",
    ring: "ring-lavender-300",
    dot: "bg-lavender-400",
  },
  blush: {
    solid: "bg-blush-500",
    solidHover: "hover:bg-blush-600",
    soft: "bg-blush-100",
    softText: "text-blush-700",
    text: "text-blush-600",
    border: "border-blush-300",
    ring: "ring-blush-300",
    dot: "bg-blush-400",
  },
  honey: {
    solid: "bg-honey-400",
    solidHover: "hover:bg-honey-500",
    soft: "bg-honey-100",
    softText: "text-honey-500",
    text: "text-honey-500",
    border: "border-honey-300",
    ring: "ring-honey-300",
    dot: "bg-honey-400",
  },
};

export function getAccent(key) {
  return ACCENTS[key] || ACCENTS.sage;
}

// The small set of accent keys that also have a matching <Badge tone="...">
// - anything else safely falls back to the sage badge.
const BADGE_TONES = new Set(["sage", "terracotta", "lavender", "honey"]);
export function badgeTone(accent) {
  return BADGE_TONES.has(accent) ? accent : "sage";
}
