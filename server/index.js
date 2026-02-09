const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.post('/refactor', (req, res) => {
    const code = req.body.code;
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }
    console.log('Refactored code (simulated):', code.toUpperCase());

    res.json({ refactoredCode: code.toUpperCase() });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});