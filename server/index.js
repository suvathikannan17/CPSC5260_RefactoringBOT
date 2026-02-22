require('dotenv').config({ path: '../prod.env' });
const express = require('express');
const cors = require('cors');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 5006;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash",
    systemInstruction: `You are an expert Software design auditor and refactoring assistant. 
    Your task is to 
    1. analyze the provided code and detect the code smells (Example: Long method, Long parameter list, Magic number, Duplicate code, Feature envy etc).
    2. Refactor the code to eliminate the detected code smells using standard refactoring techniques such as Extract method, replace magic number with constact etc.. and improve readability and maintainability.
    3. Return a JSON object with two fields: "refactoredCode" containing the refactored code, and "justification" containing a simple explanation of the refactoring changes made.\n\n
    
    CRITICAL AUDIT RULES: 
    - MEASUREMENT: Define a 'Long Method' strictly by logical lines of code (statements). Ignore all empty lines, comments, and whitespace when calculating method length. 
    - WHITESPACE: Excessive whitespace or empty lines are NOT code smells and should not be refactored or cited in justifications. 
    - DUPLICATION: Identify identical or near-identical logic across different functions and extract them into reusable helper methods.`
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
    try {
        const prompt = `Identify all the code smells in the following code and refactor it to improve readability and maintainability. 
        Format your justification in a clear and concise way, explaining each refactoring change made and the code smell that was addressed and include code line number
        
        CODE: ${code}

        RESPONSE FORMAT (JSON ONLY):
        {
        "refactoredCode": "The refactored code goes here",
        "justification": "[Line] - [Smell Name] - [Description of where it was and how it was fixed, including line numbers\n\n]\n\n[Line] - [Smell Name] - [Description of where it was and how it was fixed, including line numbers\n\n]\n\n..."
        "status": "If the code input is valid, return 'success'. If the given code is not a programming language or has systax error, or does not make sense, return 'InvalidCodeException' as errorCode and justification of error in 'errorMessage' as json"
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response.text();

        const cleanJson = response.replace(/```json|```/g, '').trim();
        if (!cleanJson) {
            throw new Error('Invalid response from model: Empty JSON');
        }

        const data = JSON.parse(cleanJson);
        console.log("status", data.status);
        if (data.status === 'InvalidCodeException') {
            return res.status(400).json({ error: data.errorMessage || 'Invalid code input' });
        }

        res.json({ refactoredCode: data.refactoredCode, justification: data.justification });
    } catch (error) {
        console.error("Error during refactoring:", error);
        res.status(500).json({
            error: `Error processing the code. Please try again later. ${error.name} : ${error.statusText || error.message}`,
        });
    }
    });

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});