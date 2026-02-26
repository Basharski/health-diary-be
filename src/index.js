// src/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getItems, getItemById, postItem, putItem, deleteItem } from './items.js';
import { getUsers, getUserById, postUser, putUser, deleteUser } from './users.js';
import { getEntries, getEntryById, postEntry, putEntry, deleteEntry } from './entries.js';
import { postLogin, getMe } from './auth.js';
import { authenticateToken } from './middlewares/authentication.js';

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.use(cors());
app.use(express.json());

// Return JSON for invalid JSON request bodies
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  next(err);
});

// 1. READ ALL DATA (GET)
app.get('/api/items', getItems);

// 1.5. READ ONE SPECIFIC DATA (GET by ID) - Tämä puuttui aiemmin!
app.get('/api/items/:id', getItemById);

// 2. SEND DATA (POST) - Korvattiin vanha koodi tällä lyhyellä versiolla!
app.post('/api/items', postItem);

// 3. MODIFY DATA (PUT)
app.put('/api/items/:id', putItem);

// 4. DELETE DATA
app.delete('/api/items/:id', deleteItem);

// --- ENTRIES ROUTES ---
app.get('/api/entries', authenticateToken, getEntries);
app.get('/api/entries/:id', authenticateToken, getEntryById);
app.post('/api/entries', authenticateToken, postEntry);
app.put('/api/entries/:id', authenticateToken, putEntry);
app.delete('/api/entries/:id', authenticateToken, deleteEntry);

// --- USERS ROUTES ---

// Hae kaikki käyttäjät
app.get('/api/users', getUsers);

// Hae käyttäjä ID:llä
app.get('/api/users/:id', getUserById);

// Luo uusi käyttäjä
app.post('/api/users', postUser);

// Päivitä käyttäjä (vain oma)
app.put('/api/users/:id', authenticateToken, putUser);

// Poista käyttäjä ID:llä
app.delete('/api/users/:id', deleteUser);

// --- AUTH ROUTES ---
app.post('/api/auth/login', postLogin);
app.get('/api/auth/me', authenticateToken, getMe);

// Backwards-compatible login alias
app.post('/api/users/login', postLogin);

// 5. 404 RESPONSE - Catch-all for non-existing resources
app.use((req, res) => {
  // If the user visits a URL that isn't defined above, they get this.
  res.status(404).json({ error: '404 - Resource not found' });
});

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});