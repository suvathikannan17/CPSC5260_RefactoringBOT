require('dotenv').config({ path: '../prod.env' });
const express = require('express');
const cors = require('cors');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 5006;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash",
    systemInstruction: "You are a professional code refactorer. Output ONLY the refactored code. No explanations, no markdown code blocks (```), and no conversational text."
    });

app.get('/getmodels', async (req, res) => {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        console.log("API Response:", response);
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        res.status(500).send("Error fetching models");
    }
});

app.post('/refactor', async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }
    
    const prompt = `Refactor the following code to improve readability and maintainability:\n\n${code}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({ refactoredCode: response.text() });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});