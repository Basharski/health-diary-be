// src/index.js
import express from 'express';
import cors from 'cors';
import { getItems, getItemById, postItem, putItem, deleteItem } from './items.js';
import { getUsers, getUserById, postUser, deleteUser, loginUser } from './users.js';
import { getEntries, getEntryById, postEntry, deleteEntry } from './entries.js';

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.use(cors());
app.use(express.json());

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
app.get('/api/entries', getEntries);
app.get('/api/entries/:id', getEntryById);
app.post('/api/entries', postEntry);
app.delete('/api/entries/:id', deleteEntry);

// --- USERS ROUTES ---

// Hae kaikki käyttäjät
app.get('/api/users', getUsers);

// Hae käyttäjä ID:llä
app.get('/api/users/:id', getUserById);

// Luo uusi käyttäjä
app.post('/api/users', postUser);

// Poista käyttäjä ID:llä
app.delete('/api/users/:id', deleteUser);

// Kirjaudu sisään (Huom: Kirjautuminen on yleensä POST, koska lähetämme salasanoja piilossa)
app.post('/api/users/login', loginUser);

// 5. 404 RESPONSE - Catch-all for non-existing resources
app.use((req, res) => {
  // If the user visits a URL that isn't defined above, they get this.
  res.status(404).json({ error: '404 - Resource not found' });
});

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});