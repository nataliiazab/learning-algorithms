'use client';

function Table({ columns, rows }) {
  return (
    <div className="my-3 overflow-x-auto rounded-2xl border border-cream-300">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-cream-100">
            {columns.map((col, i) => (
              <th key={i} className="whitespace-nowrap px-3 py-2 font-heading text-xs font-semibold text-ink-700">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-cream-50/60'}>
              {row.map((cell, ci) => (
                <td key={ci} className="whitespace-nowrap px-3 py-2 font-mono text-xs text-ink-700 sm:text-sm">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Renders exactly one part of an algorithm's `walkthrough.parts` - a
// heading, some plain-language paragraphs, an optional worked table, and
// an optional highlighted note. Split out from a single big walkthrough
// section so a lesson stepper can place each part into its own stage,
// right next to the animation/exercise it belongs with.
export default function WalkthroughPart({ part, headingSize = 'text-lg' }) {
  if (!part) return null;
  return (
    <div className="rounded-3xl border border-lavender-200 bg-white/80 p-6 sm:p-8">
      {part.heading && <h3 className={`mb-3 font-heading ${headingSize} text-ink-900`}>{part.heading}</h3>}
      {part.paragraphs?.map((p, pi) => (
        <p key={pi} className="mb-2 text-sm leading-relaxed text-ink-700 sm:text-base">
          {p}
        </p>
      ))}
      {part.table && <Table columns={part.table.columns} rows={part.table.rows} />}
      {part.note && (
        <p className="mt-1 rounded-xl bg-lavender-50 p-3 text-sm leading-relaxed text-lavender-700">🌱 {part.note}</p>
      )}
    </div>
  );
}
