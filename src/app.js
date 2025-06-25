const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve index.html from root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Serve static files from src (for main.js)
app.use('/src', express.static(__dirname));
app.use(express.json());

const HISTORY_FILE = path.join(__dirname, 'history.json');

// Get recent input history
app.get('/api/history', (req, res) => {
  let history = [];
  if (fs.existsSync(HISTORY_FILE)) {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
  }
  res.json(history);
});

// Add a new input to history
app.post('/api/history', (req, res) => {
  let history = [];
  if (fs.existsSync(HISTORY_FILE)) {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
  }
  history.unshift(req.body.input);
  history = history.slice(0, 3); // Keep only the latest 3 records
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history));
  res.json({ ok: true });
});

// Delete a history record by index
app.delete('/api/history/:idx', (req, res) => {
  let history = [];
  if (fs.existsSync(HISTORY_FILE)) {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
  }
  history.splice(req.params.idx, 1);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history));
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
}); 