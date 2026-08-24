# MeetBrief — Meeting Summarizer Frontend

Premium Next.js + Tailwind CSS + Lucide React frontend for the FastAPI meeting summarizer backend.

## Requirements

- Node.js 20.9+.
- Running FastAPI backend with `POST /upload-audio`.

## Install

```bash
npm install
cp .env.example .env.local
```

Set the backend URL in `.env.local` if necessary:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Run

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Expected API response

The frontend expects the backend to return a shape compatible with:

```json
{
  "status": "success",
  "filename": "meeting.mp3",
  "transcript_turn_count": 12,
  "result": {
    "overall_summary": "...",
    "action_items": [
      {
        "task": "Send the revised proposal",
        "owner": "Priya",
        "due_date": "Friday",
        "status": "open",
        "evidence": "Priya agreed to send it Friday."
      }
    ],
    "transcript_with_metadata": [
      {
        "speaker_label": "SPEAKER_00",
        "speaker_name": "Priya",
        "text": "...",
        "intent": "Proposing a new deadline for the deliverable.",
        "speaker_summary": "Owns the delivery plan and coordinates the next steps."
      }
    ]
  }
}
```

## Notes

The UI deliberately treats speaker labels and resolved names separately. When no reliable name is available, the original label is displayed so the frontend never invents an identity.

Long-running transcription is handled as a single request because that matches the supplied FastAPI endpoint. For production, move the backend to a job/queue model and have the frontend poll a job endpoint or consume progress events.
