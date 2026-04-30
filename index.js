import * as dotenv from 'dotenv';
dotenv.config();

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

async function loadDocument() {
    const pdfLoader = new PDFLoader('./dsa.pdf');
    const rawDocs = await pdfLoader.load();
    console.log("✅ PDF loaded successfully");
    console.log(`📄 Total pages loaded: ${rawDocs.length}`);
}

loadDocument();