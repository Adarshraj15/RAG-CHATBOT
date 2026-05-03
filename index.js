import * as dotenv from 'dotenv';
dotenv.config();

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiEmbeddings {
    constructor(apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async embedDocuments(texts) {
        const results = [];
        const BATCH_SIZE = 50;

        for (let i = 0; i < texts.length; i += BATCH_SIZE) {
            const batch = texts.slice(i, i + BATCH_SIZE);
            console.log(`Embedding batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(texts.length/BATCH_SIZE)}...`);

            const batchResults = await Promise.all(
                batch.map(t => this.embedQuery(t))
            );
            results.push(...batchResults);

            if (i + BATCH_SIZE < texts.length) {
                console.log("⏳ Waiting 65s for rate limit...");
                await this.sleep(65000);
            }
        }
        return results;
    }

    async embedQuery(text) {
        const result = await this.model.embedContent(text);
        return result.embedding.values;
    }
}

async function indexDocument() {
    const pdfLoader = new PDFLoader('./dsa.pdf');
    const rawDocs = await pdfLoader.load();
    console.log("✅ PDF loaded successfully");

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
    console.log("✅ Chunking Completed");

    const embeddings = new GeminiEmbeddings(process.env.GEMINI_API_KEY);
    console.log("✅ Embedding model configured");

    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    console.log("✅ Pinecone configured");

    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });
    console.log("✅ Data Stored in Pinecone successfully!");
}

indexDocument();