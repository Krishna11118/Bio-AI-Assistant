import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

// Initialize Gemini with error handling
let genAI;
let model;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
} catch (error) {
  console.error('Error initializing Gemini API:', error);
  process.exit(1);
}

// Read Bio info from file with error handling
async function getCompanyInfo() {
  try {
    const filePath = join(__dirname, './data/bio.txt');
    const info = await fs.readFile(filePath, 'utf-8');
    if (!info || info.trim().length === 0) {
      throw new Error('Bio info file is empty');
    }
    return info;
  } catch (error) {
    console.error('Error reading Bio info:', error);
    throw new Error('Failed to load Bio information');
  }
}

// Format prompt with Bio info and question
async function createPrompt(companyInfo, question) {
  if (!question || question.trim().length === 0) {
    throw new Error('Question cannot be empty');
  }

  // Limit prompt length to avoid potential issues
  const maxCompanyInfoLength = 2000; // Adjust as needed
  const truncatedInfo = companyInfo.length > maxCompanyInfoLength 
    ? companyInfo.slice(0, maxCompanyInfoLength) + '...'
    : companyInfo;

  return `You are a helpful AI assistant for Krishna's. Use the following Bio information to answer questions:
${truncatedInfo}
Human Question: ${question}
Provide a helpful, friendly, and concise response based on the Bio information above. If the information needed to answer the question isn't in the Bio details, politely say so and offer to help with something else.
Response:`;
}

// Retry mechanism for Gemini API calls
async function generateWithRetry(prompt, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await model.generateContent(prompt);
      if (!result || !result.response) {
        throw new Error('Empty response from Gemini API');
      }
      return result.response.text();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'Bad Request',
        details: 'Message is required'
      });
    }

    // Get Bio info and create prompt
    const companyInfo = await getCompanyInfo();
    const prompt = await createPrompt(companyInfo, message);
    
    // Generate response using Gemini with retry mechanism
    const response = await generateWithRetry(prompt);
    
    res.json({
      id: Date.now().toString(),
      content: response,
      role: 'assistant',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    
    // Send appropriate error response based on error type
    const statusCode = error.status || 500;
    const errorMessage = error.status === 500 
      ? 'An internal server error occurred. Please try again later.'
      : error.message;
    
    res.status(statusCode).json({
      error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
      details: errorMessage
    });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});