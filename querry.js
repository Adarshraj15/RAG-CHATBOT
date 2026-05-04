import * as dotenv from 'dotenv';
dotenv.config();
import readlineSync from 'readline-sync';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from 'groq-sdk';

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

async function chatting(question) {
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
Answer the user's question based ONLY on the provided context.
If the answer is not in the context, say "I could not find the answer in the provided document."
Keep answers clear, concise, and educational.

Context: ${context}`
            },
            ...History
        ]
    });

    const answer = response.choices[0].message.content;
    History.push({ role: "assistant", content: answer });

    console.log("\n" + answer);
}

async function main() {
    const userProblem = readlineSync.question("Ask me anything --> ");
    await chatting(userProblem);
    main();
}

main();