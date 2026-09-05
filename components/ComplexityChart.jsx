"use client";

import { motion } from "framer-motion";
import Mascot from "./Mascot";
import { useTranslation } from "@/lib/i18n/LocaleContext";

// Purely illustrative relative "weight" per complexity notation - not to
// scale, just enough to show best/average/worst in friendly proportion.
const WEIGHT = { 1: 1, "log n": 2, n: 4, "n log n": 6, "n^2": 10 };

function Row({ label, notation, plain, color, barColor }) {
  const { t } = useTranslation();
  const weight = WEIGHT[notation] ?? 4;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-semibold text-ink-900">{label}</span>
        <span className={`font-mono text-xs ${color}`}>
          {t(`complexity.label.${notation}`)}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-cream-200">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${weight * 10}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
      <p className="text-sm leading-relaxed text-ink-500">{plain}</p>
    </div>
  );
}

export default function ComplexityChart({ complexity, complexityPlain }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-3xl border border-cream-300 bg-white/70 p-6">
      <div className="mb-4 flex items-center gap-3">
        <Mascot size={44} mood="thinking" />
        <div>
          <h3 className="font-heading text-lg text-ink-900">
            {t("complexity.title")}
          </h3>
          <p className="text-sm text-ink-500">
            {t("complexity.subtitle")}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <Row
          label={t("complexity.best")}
          notation={complexity.best}
          plain={complexityPlain.best}
          color="text-sage-600"
          barColor="bg-sage-400"
        />
        <Row
          label={t("complexity.typical")}
          notation={complexity.average}
          plain={complexityPlain.average}
          color="text-honey-500"
          barColor="bg-honey-400"
        />
        <Row
          label={t("complexity.worst")}
          notation={complexity.worst}
          plain={complexityPlain.worst}
          color="text-terracotta-600"
          barColor="bg-terracotta-400"
        />
      </div>
    </div>
  );
}
