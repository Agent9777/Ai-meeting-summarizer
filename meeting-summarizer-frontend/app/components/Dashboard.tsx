"use client";

import { AudioLines, ChevronLeft, RotateCcw, Sparkles } from "./icons";
import { MeetingResult } from "@/types/meeting";
import { MeetingSummaryCard, ActionItemsCard, SpeakerBreakdownCard, StatsStrip } from "./InsightCards";
import { TranscriptView } from "./TranscriptView";

export function Dashboard({ result, filename, onReset }: { result: MeetingResult; filename: string; onReset: () => void }) {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/70 pb-5">
          <div className="flex items-center gap-3">
            <button onClick={onReset} className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50" aria-label="Back to upload">
              <ChevronLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="font-medium">Meeting analysis</span>
                <span>•</span>
                <span>Processed</span>
              </div>
              <h1 className="mt-1 max-w-[70vw] truncate text-lg font-semibold tracking-tight text-gray-900">{filename}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500 sm:flex">
              <Sparkles size={13} className="text-[#635bff]" /> AI-enriched transcript
            </div>
            <button onClick={onReset} className="focus-ring inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
              <RotateCcw size={14} /> New meeting
            </button>
          </div>
        </header>

        <div className="py-6">
          <div className="mb-5 flex items-center gap-2 text-xs text-gray-400">
            <AudioLines size={14} />
            <span>Signal extracted from {result.transcript_with_metadata.length} speaker-aware transcript turns</span>
          </div>

          <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
            <aside className="space-y-5">
              <StatsStrip turns={result.transcript_with_metadata} actionItems={result.action_items} />
              <MeetingSummaryCard summary={result.overall_summary} />
              <ActionItemsCard items={result.action_items} />
              <SpeakerBreakdownCard turns={result.transcript_with_metadata} />
            </aside>
            <div className="min-w-0">
              <TranscriptView turns={result.transcript_with_metadata} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
