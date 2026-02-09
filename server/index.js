const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001; // Using 5001 because React uses 3000

app.use(cors());
app.use(express.json());

// This is the first "Route"
app.get('/', (req, res) => {
  res.send('RefactorBot Server is Running!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});