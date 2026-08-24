export type ActionItemStatus = "open" | "decided" | "blocked" | "informational";

export interface ActionItem {
  task: string;
  owner: string | null;
  due_date: string | null;
  status: ActionItemStatus;
  evidence: string;
}

export interface TranscriptTurn {
  speaker_label: string;
  speaker_name: string;
  text: string;
  intent: string;
  speaker_summary: string;
  start?: number;
  end?: number;
}

export interface MeetingResult {
  overall_summary: string;
  action_items: ActionItem[];
  transcript_with_metadata: TranscriptTurn[];
}

export interface UploadResponse {
  status: string;
  filename: string;
  transcript_turn_count: number;
  result: MeetingResult;
}
