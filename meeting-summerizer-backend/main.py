import os
import time
import json
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv

# Import the official Google GenAI SDK
from google import genai
from google.genai import types

# Load environment variables from the .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Meeting Summarizer API (Pure Gemini)")

# Allow the frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to your frontend's domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client 
try:
    client = genai.Client()
except Exception as e:
    print(f"Failed to initialize Gemini Client: {e}")

# ---------------------------------------------------------
# 1. Define the Structured Output Schema using Pydantic
# ---------------------------------------------------------
class DialogueTurn(BaseModel):
    speaker_label: str = Field(description="The generic label, e.g., 'Speaker A'")
    speaker_name: str = Field(description="The actual name if mentioned, otherwise use the generic label")
    text: str = Field(description="The transcribed text spoken by the person")
    intent: str = Field(description="1-2 sentences explaining what the speaker is trying to achieve")
    speaker_summary: str = Field(description="A brief summary of what this specific person contributed")

class ActionItem(BaseModel):
    task: str = Field(description="The action item or task")
    assignee: str = Field(description="Who is responsible for the task")

class MeetingAnalysis(BaseModel):
    overall_summary: str = Field(description="A concise summary of the entire meeting")
    action_items: List[ActionItem] = Field(description="Key tasks and decisions made")
    transcript_with_metadata: List[DialogueTurn] = Field(description="The full transcription grouped by speaker turns")

# ---------------------------------------------------------
# 2. API Endpoint
# ---------------------------------------------------------
@app.post("/upload-audio")
async def process_meeting_audio(file: UploadFile = File(...)):
    # Validate that the file is an audio type
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio format.")

    temp_file_path = ""
    uploaded_audio = None
    
    try:
        # Save the uploaded file temporarily so the SDK can read it
        extension = os.path.splitext(file.filename)[1] or ".mp3"
        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_audio:
            content = await file.read()
            temp_audio.write(content)
            temp_file_path = temp_audio.name

        print("1. Uploading audio to Gemini File API...")
        uploaded_audio = client.files.upload(file=temp_file_path)

        # Large audio files might take a few seconds to process on Google's end
        print("2. Waiting for audio processing...")
        while uploaded_audio.state.name == "PROCESSING":
            time.sleep(2)
            uploaded_audio = client.files.get(name=uploaded_audio.name)
            
        if uploaded_audio.state.name == "FAILED":
             raise Exception("Audio processing failed on Gemini's servers.")

        print("3. Generating transcription and metadata...")
        prompt = """
        Listen to this meeting audio carefully. 
        Provide a highly accurate full transcription with speaker diarization (e.g. Speaker A, Speaker B).
        For each speaker, extract their actual name if mentioned during the meeting. 
        Determine their intent for each speaking turn.
        Generate a whole meeting summary and a list of actionable items.
        """

        # Call Gemini (using 1.5-flash for maximum stability with JSON generation)
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=[prompt, uploaded_audio],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=MeetingAnalysis,
                temperature=0.2, 
            )
        )
        
        print("4. Done! Formatting data for frontend.")
        
        # Clean up the text in case Gemini wraps the JSON in markdown code blocks
        clean_text = response.text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text.removeprefix("```json")
        if clean_text.startswith("```"):
            clean_text = clean_text.removeprefix("```")
        if clean_text.endswith("```"):
            clean_text = clean_text.removesuffix("```")
        clean_text = clean_text.strip()

        # Parse and return in the exact format your Next.js frontend expects
        parsed_result = json.loads(clean_text)
        
        return {
            "filename": file.filename,
            "result": parsed_result
        }

    except Exception as e:
        # This will print the EXACT reason it crashed in your terminal
        print(f"\n🔥 THE EXACT ERROR IS: {str(e)}\n")
        raise HTTPException(status_code=500, detail=f"AI Processing Error: {str(e)}")
    
    finally:
        # Clean up the file from Google's servers to manage your quota
        if uploaded_audio:
            try:
                client.files.delete(name=uploaded_audio.name)
                print("5. Cleaned up audio from Google Cloud.")
            except Exception:
                pass
                
        # Clean up the local temp file to prevent storage leaks
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            print("6. Cleaned up local temporary file.")