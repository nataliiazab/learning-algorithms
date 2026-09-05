// A tiny markdown-lite: renders `backtick` segments as inline <code> spans.
// Lets translated/localized content stay plain strings (easy to translate)
// while still getting styled inline code refs, instead of needing JSX
// baked into data files.
export default function InlineText({ text }) {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={i} className="rounded bg-cream-200 px-1 py-0.5 font-mono text-[0.85em]">
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
