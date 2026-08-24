"use client";

import { FileText, Lightbulb, MoreHorizontal } from "./icons";
import { TranscriptTurn } from "@/types/meeting";
import { SectionTitle } from "./SectionTitle";

const palette = [
  { solid: "bg-violet-100 text-violet-700", bubble: "bg-violet-50/70 border-violet-100" },
  { solid: "bg-sky-100 text-sky-700", bubble: "bg-sky-50/70 border-sky-100" },
  { solid: "bg-emerald-100 text-emerald-700", bubble: "bg-emerald-50/70 border-emerald-100" },
  { solid: "bg-amber-100 text-amber-700", bubble: "bg-amber-50/70 border-amber-100" },
  { solid: "bg-rose-100 text-rose-700", bubble: "bg-rose-50/70 border-rose-100" }
];

export function TranscriptView({ turns }: { turns: TranscriptTurn[] }) {
  const indexes = new Map<string, number>();
  turns.forEach((turn) => {
    if (!indexes.has(turn.speaker_label)) indexes.set(turn.speaker_label, indexes.size);
  });

  return (
    <section className="card flex min-h-[700px] flex-col rounded-3xl p-5 sm:p-6">
      <SectionTitle icon={<FileText size={16} />} title="Enriched transcript" meta={`${turns.length} dialogue turns`} />
      <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto pr-1">
        {turns.map((turn, index) => {
          const color = palette[(indexes.get(turn.speaker_label) ?? 0) % palette.length];
          const name = turn.speaker_name || turn.speaker_label;
          return (
            <article key={`${turn.speaker_label}-${index}`} className="group">
              <div className="mb-2 flex items-center gap-2">
                <div className={`grid h-8 w-8 place-items-center rounded-xl text-[10px] font-bold ${color.solid}`}>
                  {name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-gray-800">{name}</span>
                    {turn.speaker_name && turn.speaker_name !== turn.speaker_label && (
                      <span className="text-[10px] text-gray-400">{turn.speaker_label}</span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f1efff] px-2 py-1 text-[10px] font-semibold text-[#5e56e7]">
                      <Lightbulb size={11} /> {turn.intent}
                    </span>
                  </div>
                </div>
                <button type="button" className="ml-auto grid h-7 w-7 place-items-center rounded-lg text-gray-300 opacity-0 transition group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600" aria-label="More options">
                  <MoreHorizontal size={15} />
                </button>
              </div>
              <div className={`rounded-2xl border px-4 py-3.5 ${color.bubble}`}>
                <p className="text-[14px] leading-6 text-gray-700">{turn.text}</p>
              </div>
              <p className="mt-2 pl-1 text-[11px] leading-4 text-gray-400">{turn.speaker_summary}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
