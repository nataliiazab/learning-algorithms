'use client';

import Link from 'next/link';
import Mascot from '@/components/Mascot';
import AlgorithmDetail from '@/components/AlgorithmDetail';
import { getAlgorithm } from '@/lib/algorithms/registry';

export default function AlgorithmPage({ params }) {
  const config = getAlgorithm(params.slug);

  if (!config) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-24 text-center">
        <Mascot mood="oops" size={90} />
        <h1 className="font-heading text-2xl text-ink-900">We couldn&apos;t find that lesson</h1>
        <p className="text-ink-500">It might have been moved, or the link is a little off.</p>
        <Link href="/" className="rounded-full bg-sage-500 px-5 py-2.5 text-sm font-semibold text-white shadow-softer hover:bg-sage-600">
          ← Back to all lessons
        </Link>
      </div>
    );
  }

  return <AlgorithmDetail config={config} />;
}
