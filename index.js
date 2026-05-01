import * as dotenv from 'dotenv';
dotenv.config();

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiEmbeddings {
    constructor(apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    }

    async embedQuery(text) {
        const result = await this.model.embedContent(text);
        return result.embedding.values;
    }
}

async function loadAndChunkAndEmbed() {
    // Load PDF
    const pdfLoader = new PDFLoader('./dsa.pdf');
    const rawDocs = await pdfLoader.load();
    console.log("✅ PDF loaded successfully");
    console.log(`📄 Total pages loaded: ${rawDocs.length}`);

    // Chunk
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
    console.log("✅ Chunking Completed");
    console.log(`🔢 Total chunks created: ${chunkedDocs.length}`);

    // Embed first chunk just to test
    const embeddings = new GeminiEmbeddings(process.env.GEMINI_API_KEY);
    const testEmbedding = await embeddings.embedQuery(chunkedDocs[0].pageContent);
    console.log("✅ Embedding working!");
    console.log(`📐 Embedding dimension: ${testEmbedding.length}`);
}

loadAndChunkAndEmbed();