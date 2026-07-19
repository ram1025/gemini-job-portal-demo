import formidable from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = { api: { bodyParser: false } };
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Demo DB - Vercel lo memory lo untadi
global.resumesDB = global.resumesDB || [];

export default async function handler(req, res) {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    const pdfFile = files.resume[0];
    const dataBuffer = fs.readFileSync(pdfFile.filepath);
    const pdfData = await pdf(dataBuffer);
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Extract JSON from resume: {name, email, skills[], job_title, years_experience}. Resume: ${pdfData.text}`;
    const result = await model.generateContent(prompt);
    const parsedData = JSON.parse(result.response.text());

    global.resumesDB.push({...parsedData, fullText: pdfData.text});
    res.status(200).json({success: true, data: parsedData});
  });
}
