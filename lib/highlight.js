// A tiny, dependency-free JS syntax tokenizer - just enough to make code
// blocks readable without pulling in a heavy highlighting library.
const KEYWORDS =
  /\b(const|let|var|function|return|for|while|if|else|break|continue|new|of|in|true|false|null|undefined)\b/;

const TOKEN_REGEX = new RegExp(
  [
    "(//.*$)", // line comments
    "('(?:[^'\\\\]|\\\\.)*'|\"(?:[^\"\\\\]|\\\\.)*\"|`(?:[^`\\\\]|\\\\.)*`)", // strings
    "(\\b\\d+\\.?\\d*\\b)", // numbers
    KEYWORDS.source, // keywords
  ].join("|"),
  "gm",
);

// Two color mappings, because code snippets show up on two different
// backgrounds in this app: the dark (bg-ink-900) code panels, and light
// (white/pastel) surfaces like the code-builder's answer-choice buttons.
// `plain` is the one that matters most to get right per-variant - it's
// the majority of any line (identifiers, operators, punctuation), so if
// it's the wrong shade it reads as "half the code went missing."
export const TOKEN_CLASSES = {
  comment: "text-cream-300/60 italic",
  string: "text-sage-300",
  number: "text-terracotta-300",
  keyword: "text-lavender-300 font-semibold",
  plain: "text-cream-100",
};

export const TOKEN_CLASSES_LIGHT = {
  comment: "text-ink-300 italic",
  string: "text-sage-600",
  number: "text-terracotta-600",
  keyword: "text-lavender-600 font-semibold",
  plain: "text-ink-900",
};

export function tokenize(code) {
  const tokens = [];
  let lastIndex = 0;
  let match;
  TOKEN_REGEX.lastIndex = 0;

  while ((match = TOKEN_REGEX.exec(code))) {
    if (match.index > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, match.index), type: "plain" });
    }
    const [full, comment, string, number] = match;
    let type = "keyword";
    if (comment) type = "comment";
    else if (string) type = "string";
    else if (number) type = "number";
    tokens.push({ text: full, type });
    lastIndex = match.index + full.length;
  }
  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), type: "plain" });
  }
  return tokens;
}
