"use client";

import Mascot from "./Mascot";

function Table({ columns, rows }) {
  return (
    <div className="my-3 overflow-x-auto rounded-2xl border border-cream-300">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-cream-100">
            {columns.map((col, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-3 py-2 font-heading text-xs font-semibold text-ink-700"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={ri % 2 === 0 ? "bg-white" : "bg-cream-50/60"}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="whitespace-nowrap px-3 py-2 font-mono text-xs text-ink-700 sm:text-sm"
                >
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

// The direct answer to "I still don't get the loops and variables": a
// linear, patient, worked-through explanation using real numbers from one
// fixed example - nothing hidden behind a click, nothing gamified, just a
// tutor walking through exactly what happens, round by round.
export default function CodeWalkthrough({ walkthrough }) {
  if (!walkthrough) return null;
  return (
    <div className="rounded-3xl border border-lavender-200 bg-white/80 p-6 sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <Mascot size={48} mood="thinking" />
        <div>
          <h3 className="font-heading text-lg text-ink-900">
            {walkthrough.title}
          </h3>
          {walkthrough.intro && (
            <p className="mt-1 text-sm leading-relaxed text-ink-700">
              {walkthrough.intro}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {walkthrough.parts.map((part, i) => (
          <div key={i} className="border-l-4 border-lavender-200 pl-4 sm:pl-6">
            <h4 className="mb-2 font-heading text-base text-ink-900">
              {part.heading}
            </h4>
            {part.paragraphs?.map((p, pi) => (
              <p
                key={pi}
                className="mb-2 text-sm leading-relaxed text-ink-700 sm:text-base"
              >
                {p}
              </p>
            ))}
            {part.table && (
              <Table columns={part.table.columns} rows={part.table.rows} />
            )}
            {part.note && (
              <p className="mt-1 rounded-xl bg-lavender-50 p-3 text-sm leading-relaxed text-lavender-700">
                🌱 {part.note}
              </p>
            )}
          </div>
        ))}
      </div>

      {walkthrough.closing && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-sage-50 p-4">
          <span className="text-xl">🌟</span>
          <p className="text-sm leading-relaxed text-sage-800">
            {walkthrough.closing}
          </p>
        </div>
      )}
    </div>
  );
}
