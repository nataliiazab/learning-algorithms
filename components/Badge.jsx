export default function Badge({ children, tone = 'sand' }) {
  const tones = {
    sand: 'bg-cream-200 text-ink-700',
    sage: 'bg-sage-100 text-sage-700',
    terracotta: 'bg-terracotta-100 text-terracotta-700',
    lavender: 'bg-lavender-100 text-lavender-700',
    honey: 'bg-honey-100 text-honey-500',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        tones[tone] || tones.sand
      }`}
    >
      {children}
    </span>
  );
}
