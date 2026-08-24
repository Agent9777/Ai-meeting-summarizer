"use client";

import { ChangeEvent, DragEvent, useCallback, useState } from "react";
import { AudioLines, FileAudio, Loader2, Sparkles, UploadCloud, X } from "./icons";

const ACCEPTED = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a", "audio/m4a"];
const MAX_MB = 100;

interface UploadViewProps {
  busy: boolean;
  progressLabel: string;
  error: string | null;
  onUpload: (file: File) => void;
}

export function UploadView({ busy, progressLabel, error, onUpload }: UploadViewProps) {
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const validateAndUpload = useCallback((candidate?: File) => {
    if (!candidate) return;
    setLocalError(null);
    const extension = candidate.name.toLowerCase().split(".").pop();
    const allowedExtension = extension === "mp3" || extension === "wav" || extension === "m4a";
    if (!allowedExtension && !ACCEPTED.includes(candidate.type)) {
      setLocalError("Please choose an MP3, WAV, or M4A audio file.");
      return;
    }
    if (candidate.size > MAX_MB * 1024 * 1024) {
      setLocalError(`The file is too large. Maximum size is ${MAX_MB} MB.`);
      return;
    }
    setFile(candidate);
    onUpload(candidate);
  }, [onUpload]);

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    validateAndUpload(event.dataTransfer.files?.[0]);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    validateAndUpload(event.target.files?.[0]);
    event.target.value = "";
  };

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#161827] text-white shadow-lg shadow-black/10">
              <Sparkles size={19} />
            </div>
            <div>
              <div className="font-semibold tracking-tight">MeetBrief</div>
              <div className="text-xs text-gray-500">Meeting intelligence</div>
            </div>
          </div>
          <div className="rounded-full border border-gray-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-gray-600">
            AI workspace
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center py-14">
          <div className="w-full max-w-2xl text-center">
            <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#dedcff] bg-[#f5f3ff] px-3 py-1.5 text-xs font-semibold text-[#5c54ea]">
              <AudioLines size={14} />
              Turn long meetings into decisions
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-gray-950 sm:text-6xl">
              Upload a meeting.
              <span className="block text-gray-400">Get the signal back.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Transcribe speakers, resolve names, extract intent, and surface action items in a single clean workspace.
            </p>

            <div
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`card mt-9 rounded-[30px] border-dashed p-5 transition-all sm:p-7 ${dragging ? "border-[#756dff] bg-[#f8f7ff] shadow-[0_20px_70px_rgba(99,91,255,0.12)]" : "border-gray-300"}`}
            >
              <div className="rounded-[23px] border border-gray-100 bg-gray-50/85 px-6 py-10 sm:px-10 sm:py-12">
                {busy ? (
                  <div className="py-5">
                    <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-[#ebe9ff] text-[#625af1]">
                      <Loader2 size={28} className="animate-spin" />
                    </div>
                    <div className="text-lg font-semibold tracking-tight">{progressLabel}</div>
                    <p className="mt-2 text-sm text-gray-500">We’re processing “{file?.name ?? "your recording"}”. This can take a little while.</p>
                    <div className="mx-auto mt-7 h-2 max-w-sm overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full w-[68%] animate-pulse rounded-full bg-[#635bff]" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="float-soft mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-white text-[#635bff] shadow-sm ring-1 ring-black/5">
                      <UploadCloud size={29} />
                    </div>
                    <div className="text-lg font-semibold tracking-tight">Drop your meeting audio here</div>
                    <p className="mt-2 text-sm text-gray-500">or choose a file from your computer</p>
                    <label className="focus-ring mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#171827] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-black">
                      <FileAudio size={16} />
                      Choose audio
                      <input onChange={onChange} type="file" accept=".mp3,.wav,.m4a,audio/*" className="sr-only" />
                    </label>
                    <div className="mt-5 text-xs text-gray-400">MP3, WAV, or M4A · up to {MAX_MB} MB</div>
                  </>
                )}
              </div>
            </div>

            {(localError || error) && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
                <X size={17} className="mt-0.5 shrink-0" />
                <span>{localError || error}</span>
              </div>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
              <span>Speaker-aware transcription</span>
              <span>•</span>
              <span>Intent extraction</span>
              <span>•</span>
              <span>Action item detection</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
