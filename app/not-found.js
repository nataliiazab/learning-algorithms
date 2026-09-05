import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-24 text-center">
      <span className="text-5xl">🌾</span>
      <h1 className="font-heading text-2xl text-ink-900">This page hasn&apos;t sprouted yet</h1>
      <p className="text-ink-500">Let&apos;s get you back to something that has.</p>
      <Link href="/" className="rounded-full bg-sage-500 px-5 py-2.5 text-sm font-semibold text-white shadow-softer hover:bg-sage-600">
        ← Back to all lessons
      </Link>
    </div>
  );
}
