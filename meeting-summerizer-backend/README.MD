#  Meeting Summarizer - Backend API

A lightweight and powerful backend API built with **FastAPI**. It processes meeting audio files using Google's multimodal **Gemini AI (`gemini-3.6-flash`)** to perform speech-to-text transcription, speaker diarization (who said what), intent analysis, and automated summarization—all in a single API call.

---

##  Tech Stack
* **Framework:** FastAPI
* **AI Provider:** Google Gemini API (`google-genai` SDK)
* **Data Validation:** Pydantic
* **Server:** Uvicorn

---

##  Prerequisites

Before you begin, make sure you have the following installed on your computer:
1. **Python 3.8 or higher:** [Download Python](https://www.python.org/downloads/)
2. **Git:** [Download Git](https://git-scm.com/downloads)
3. **Gemini API Key:** Get one for free from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

##  Installation Guide

Follow these exact steps to set up the backend on your local machine.

### 1. Clone the Repository
Open your terminal or command prompt and clone this project:
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd meeting-summarizer-backend

## 2. Create a Virtual Environment (Highly Recommended)

Creating a virtual environment keeps your project dependencies isolated from your system Python installation.

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS and Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

## 3. Install Dependencies

With your virtual environment activated, install all required Python libraries:

```bash
pip install -r requirements.txt
```

## 4. Set Up Environment Variables

This project requires a secret API key to communicate with Google Gemini.

> **Important:** Never commit your API key to GitHub or share it publicly.

In the root folder of the backend, create a new file named exactly:

```text
.env
```

Make sure it is **not** accidentally saved as `.env.txt`.

Open the `.env` file and add the following:

```env
GEMINI_API_KEY="your_actual_api_key_here"
```

Replace `your_actual_api_key_here` with your actual Google Gemini API key.

The `.env` file is ignored by Git to help keep your API key secure.

## 🚀 Running the Backend

Once the virtual environment is activated, dependencies are installed, and your `.env` file is configured, start the backend server using:

```bash
uvicorn main:app --reload
```

If everything is configured correctly, you should see output indicating that the server has started successfully.

The backend will be available at:

```text
http://127.0.0.1:8000
```

The `--reload` flag enables automatic server reloading whenever you make changes to the backend code.
