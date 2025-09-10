# RAG Agent

This project is a Retrieval-Augmented Generation (RAG) Agent with a full-stack architecture:

- **Backend**: Python (FastAPI or Flask recommended), handles file uploads, embeddings, vector storage, and RAG pipeline logic.
- **Frontend**: React (Vite), provides a user interface for uploading files and interacting with the agent.

## Features

- Upload and process PDF and PPTX files
- Store and retrieve document embeddings using ChromaDB
- RAG pipeline for answering queries based on uploaded documents
- Model caching for efficient inference

## Project Structure

```
backend/
  main.py                # Backend entry point
  requirements.txt       # Python dependencies
  db/chroma_db/          # ChromaDB vector store
  model_cache/           # Cached models for embeddings
  services/              # Embedding, file handling, RAG pipeline, vector store logic
frontend/
  src/                   # React source code
  public/                # Static assets
  package.json           # Frontend dependencies
```

## Getting Started

### Backend

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. (Optional) Create and activate a virtual environment:
   ```sh
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```sh
   python main.py
   ```

### Frontend

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Notes

- Uploaded files are stored in `backend/services/uploads/`.
- Vector database is stored in `backend/db/chroma_db/`.
- Model cache is in `backend/model_cache/`.
- **Do not commit your virtual environment (`venv/`) to version control.**

## License

MIT License
