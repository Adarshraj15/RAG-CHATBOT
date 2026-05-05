import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from 'groq-sdk';

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const History = [];

async function transformQuery(question) {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are a query rewriting expert. Rephrase the user question into a complete standalone question. Only output the rewritten question, nothing else.`
            },
            ...History,
            { role: "user", content: question }
        ]
    });
    return response.choices[0].message.content;
}

app.post('/chat', async (req, res) => {
    try {
        const { question } = req.body;

        const query = await transformQuery(question);

        const result = await embeddingModel.embedContent(query);
        const queryVector = result.embedding.values;

        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

        const searchResults = await pineconeIndex.query({
            topK: 10,
            vector: queryVector,
            includeMetadata: true,
        });

        const context = searchResults.matches
            .map(match => match.metadata.text)
            .join("\n\n---\n\n");

        History.push({ role: "user", content: query });

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a Data Structure and Algorithm Expert.
You MUST answer ONLY from the provided context below.
Do NOT use any outside knowledge.
Do NOT make up information.
If the context does not contain the answer, say ONLY "I could not find the answer in the provided document." and nothing else.
Keep answers clear and educational.

Context: ${context}`
                },
                ...History
            ]
        });

        const answer = response.choices[0].message.content;
        History.push({ role: "assistant", content: answer });

        res.json({ answer });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
});