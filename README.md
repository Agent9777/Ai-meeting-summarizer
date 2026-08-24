#  AI Meeting Summarizer 
**Full-Stack Technical Documentation**

A production-ready, full-stack web application that transforms raw meeting audio into structured, actionable insights. By leveraging Google's natively multimodal Gemini AI, this system bypasses traditional, heavy local ML pipelines to perform transcription, speaker diarization, intent analysis, and task generation in a single pass.

---

##  Live Demonstration


<div align="center">
  <video
    src="https://raw.githubusercontent.com/Agent9777/Ai-meeting-summarizer/main/Output.mp4"
    autoplay
    loop
    muted
    playsinline
    width="100%"
    style="border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    Your browser does not support the video tag.
  </video>
</div>
    Open Output.mp4 file to see the live demonstration

---

##  Technical Stack 

### Frontend (Client-Side)
* **Framework:** Next.js (React)
* **Language:** TypeScript 
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management:** Native React Hooks

### Backend (Server-Side)
* **Framework:** FastAPI
* **Server:** Uvicorn 
* **AI Provider:** Google GenAI SDK (`gemini-3.6-flash`)
* **Validation:** Pydantic (Type coercion & JSON schema generation)
* **Audio Handling:** Python native `tempfile` (Zero external ffmpeg dependencies)

---

##  How It Works (Under the Hood)

1. **Multimodal Processing:** Instead of converting audio to text first and *then* analyzing it, the audio file is sent directly to Google's Gemini AI. 
2. **Schema Enforcement:** The backend uses Pydantic to mathematically enforce the JSON structure returned by the LLM. It guarantees arrays for action items and dialogue turns, preventing frontend parsing crashes.
3. **Contextual Diarization:** The AI listens for vocal signatures and contextual clues. If "Speaker A" is addressed as "Sarah" at minute 14, the AI retrospectively applies the name "Sarah" to all of Speaker A's dialogue blocks.
4. **Intent Extraction:** Every dialogue block is analyzed for its conversational intent (e.g., *💡 Proposing an idea*, *❓ Asking for clarification*), allowing users to easily skim transcripts for key moments.

---

##  Project Structure & Component Separation

This repository is a monorepo containing both the frontend and backend. **Each module contains its own dedicated `README.md` with deep-dive installation guides.**

```text
meeting-summarizer/
├── backend/               # ⚙️ Python FastAPI Server
│   ├── main.py            # Core routing & AI logic
│   ├── requirements.txt   # Dependencies
│   └── README.md          # ⬅️ READ THIS for Backend setup
│
├── frontend/              # 🖥️ Next.js & Tailwind UI
│   ├── app/               # React components & hooks
│   ├── types/             # TypeScript interfaces
│   └── README.md          # ⬅️ READ THIS for Frontend setup
│
├── meeting.mp3             # 🎵 Sample meeting audio for testing
├── Output.mp4               # Autoplaying UI demonstration video
└── README.md              # Technical documentation (You are here)