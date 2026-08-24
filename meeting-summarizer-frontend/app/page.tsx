"use client";

import { useCallback, useMemo, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { UploadView } from "./components/UploadView";
import { UploadResponse } from "@/types/meeting";

const DEFAULT_API = "http://localhost:8000";

function friendlyError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong while processing the meeting.";
}

export default function Home() {
  const [busy, setBusy] = useState(false);
  const [progressLabel, setProgressLabel] = useState("Preparing audio...");
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<UploadResponse | null>(null);

  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API, []);

  const upload = useCallback(async (file: File) => {
    setError(null);
    setBusy(true);
    setResponse(null);

    const progressTimer = window.setInterval(() => {
      setProgressLabel((current) => {
        if (current === "Preparing audio...") return "Transcribing audio...";
        if (current === "Transcribing audio...") return "Aligning speaker turns...";
        if (current === "Aligning speaker turns...") return "Analyzing intents...";
        return "Building meeting insights...";
      });
    }, 2500);

    try {
      const form = new FormData();
      form.append("file", file);

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 20 * 60 * 1000);

      const res = await fetch(`${apiBase}/upload-audio`, {
        method: "POST",
        body: form,
        signal: controller.signal
      });

      window.clearTimeout(timeoutId);

      const contentType = res.headers.get("content-type") || "";
      const payload = contentType.includes("application/json") ? await res.json() : null;

      if (!res.ok) {
        const detail = typeof payload?.detail === "string" ? payload.detail : `Upload failed with status ${res.status}.`;
        throw new Error(detail);
      }

      if (!payload?.result?.overall_summary || !Array.isArray(payload?.result?.transcript_with_metadata)) {
        throw new Error("The backend returned an invalid meeting analysis payload.");
      }

      setResponse(payload as UploadResponse);
    } catch (caught) {
      setError(caught instanceof DOMException && caught.name === "AbortError"
        ? "The request timed out. Check that the backend is still processing the file, then try again."
        : friendlyError(caught));
    } finally {
      window.clearInterval(progressTimer);
      setBusy(false);
    }
  }, [apiBase]);

  if (response) {
    return (
      <Dashboard
        result={response.result}
        filename={response.filename}
        onReset={() => {
          setResponse(null);
          setError(null);
        }}
      />
    );
  }

  return (
    <UploadView
      busy={busy}
      progressLabel={progressLabel}
      error={error}
      onUpload={upload}
    />
  );
}
