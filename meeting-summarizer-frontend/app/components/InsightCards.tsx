"use client";

import { Check, CheckCircle2, Clock3, Lightbulb, Target, UserRound, Users } from "./icons";
import { ActionItem, TranscriptTurn } from "@/types/meeting";
import { SectionTitle } from "./SectionTitle";

const palette = [
  { solid: "bg-violet-100 text-violet-700", bubble: "bg-violet-50 border-violet-100" },
  { solid: "bg-sky-100 text-sky-700", bubble: "bg-sky-50 border-sky-100" },
  { solid: "bg-emerald-100 text-emerald-700", bubble: "bg-emerald-50 border-emerald-100" },
  { solid: "bg-amber-100 text-amber-700", bubble: "bg-amber-50 border-amber-100" },
  { solid: "bg-rose-100 text-rose-700", bubble: "bg-rose-50 border-rose-100" }
];

export function MeetingSummaryCard({ summary }: { summary: string }) {
  return (
    <section className="card rounded-3xl p-5">
      <SectionTitle icon={<Lightbulb size={16} />} title="Meeting summary" meta="AI synthesis" />
      <p className="text-[15px] leading-7 text-gray-700">{summary}</p>
    </section>
  );
}

export function ActionItemsCard({ items }: { items: ActionItem[] }) {
  return (
    <section className="card rounded-3xl p-5">
      <SectionTitle icon={<Target size={16} />} title="Action items" meta={`${items.length} detected`} />
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">No concrete actions were identified.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const done = item.status === "decided" || item.status === "informational";
            return (
              <div key={`${item.task}-${index}`} className="rounded-2xl border border-gray-100 bg-gray-50/80 p-3.5">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${done ? "bg-emerald-100 text-emerald-700" : "bg-white text-gray-400 ring-1 ring-gray-200"}`}>
                    {done ? <Check size={14} /> : <span className="h-2 w-2 rounded-full bg-gray-300" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-medium leading-5 ${done ? "text-gray-500 line-through" : "text-gray-800"}`}>{item.task}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-400">
                      {item.owner && <span className="rounded-full bg-white px-2 py-1 ring-1 ring-gray-100">Owner: {item.owner}</span>}
                      {item.due_date && <span className="rounded-full bg-white px-2 py-1 ring-1 ring-gray-100">Due: {item.due_date}</span>}
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${item.status === "blocked" ? "bg-red-50 text-red-600" : item.status === "open" ? "bg-violet-50 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function SpeakerBreakdownCard({ turns }: { turns: TranscriptTurn[] }) {
  const bySpeaker = new Map<string, TranscriptTurn>();
  turns.forEach((turn) => {
    if (!bySpeaker.has(turn.speaker_label)) bySpeaker.set(turn.speaker_label, turn);
  });
  const speakers = [...bySpeaker.entries()];

  return (
    <section className="card rounded-3xl p-5">
      <SectionTitle icon={<Users size={16} />} title="Speaker breakdown" meta={`${speakers.length} speakers`} />
      <div className="space-y-3">
        {speakers.map(([label, turn], index) => {
          const color = palette[index % palette.length];
          const name = turn.speaker_name || `Speaker ${index + 1}`;
          return (
            <div key={label} className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3">
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold ${color.solid}`}>
                {name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-gray-800">{name}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400">{label}</span>
                </div>
                <p className="mt-1 line-clamp-3 text-xs leading-5 text-gray-500">{turn.speaker_summary}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function StatsStrip({ turns, actionItems }: { turns: TranscriptTurn[]; actionItems: ActionItem[] }) {
  const uniqueSpeakers = new Set(turns.map((turn) => turn.speaker_label)).size;
  const stats = [
    { icon: <Users size={15} />, value: uniqueSpeakers, label: "Speakers" },
    { icon: <Clock3 size={15} />, value: turns.length, label: "Turns" },
    { icon: <CheckCircle2 size={15} />, value: actionItems.length, label: "Actions" }
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="card rounded-2xl px-3 py-3">
          <div className="flex items-center gap-2 text-gray-400">{stat.icon}<span className="text-[10px] uppercase tracking-[0.14em]">{stat.label}</span></div>
          <div className="mt-2 text-xl font-semibold tracking-tight text-gray-900">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
