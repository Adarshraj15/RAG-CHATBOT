# 🤖 RAG DSA Chatbot

An AI-powered chatbot that answers questions about Data Structures and Algorithms using Retrieval-Augmented Generation (RAG) technology.

## 🌐 Live Demo
👉 [https://rag-chatbot-neon-phi.vercel.app/](https://rag-chatbot-neon-phi.vercel.app/)

## 📸 Screenshots
![DSA Chatbot UI](./screenshots/chatbot.png)

## 🧠 How It Works
1. **PDF Loading** → DSA book is loaded and parsed
2. **Text Chunking** → Content is split into small chunks
3. **Embedding** → Each chunk is converted to vectors using Gemini Embeddings
4. **Vector Storage** → Vectors are stored in Pinecone database
5. **Query Processing** → User question is rewritten using Groq LLM
6. **Similarity Search** → Most relevant chunks are retrieved from Pinecone
7. **Answer Generation** → Groq LLM generates answer based on retrieved context

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend UI |
| Node.js + Express | Backend Server |
| Groq (LLaMA 3.3) | LLM for answer generation |
| Google Gemini | Text embeddings |
| Pinecone | Vector database |
| LangChain | Document processing |

## ✨ Features
- 💬 Chat interface like modern AI chatbots
- 🔍 Answers based ONLY on PDF content
- 🧠 Query rewriting for better search results
- 💾 Chat history maintained during session
- 🚀 Fast responses using Groq API

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Gemini API Key
- Groq API Key
- Pinecone API Key

### Installation

1. Clone the repository
```bash
git clone https://github.com/Adarshraj15/RAG-CHATBOT.git
cd RAG-CHATBOT
```

2. Install dependencies
```bash
npm install --legacy-peer-deps
```

3. Create `.env` file in root directory
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
GROQ_API_KEY=your_groq_api_key

4. Index your PDF document
```bash
node index.js
```

5. Start the backend server
```bash
npm run server
```

6. Start the frontend
```bash
cd frontend
npm run dev
```

7. Open browser at `http://localhost:5173`

## 📁 Project Structure
RAG-CHATBOT/
├── backend/
│   └── server.js        # Express API server
├── frontend/
│   └── src/
│       └── App.jsx      # React chat UI
├── screenshots/
│   └── chatbot.png      # UI screenshot
├── index.js             # PDF indexing script
├── querry.js            # Terminal chat interface
└── .env                 # API keys (not committed)

## 🔑 API Keys Required
- [Google Gemini](https://aistudio.google.com) - For embeddings
- [Groq](https://console.groq.com) - For LLM responses
- [Pinecone](https://app.pinecone.io) - For vector storage

## 👨‍💻 Author
**Adarsh Raj**
- GitHub: [@Adarshraj15](https://github.com/Adarshraj15)

## ⭐ Show Your Support
Give a ⭐ if this project helped you!