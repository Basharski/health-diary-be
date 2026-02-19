// src/index.js
import express from 'express';
// PÄIVITETTY RIVI: Tuodaan nyt kaikki kolme funktiota
import { getItems, getItemById, postItem, deleteItem } from './items.js'; 
import { getUserById, postUser, loginUser } from './users.js';

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.use(express.json());

// 1. READ ALL DATA (GET)
app.get('/api/items', getItems);

// 1.5. READ ONE SPECIFIC DATA (GET by ID) - Tämä puuttui aiemmin!
app.get('/api/items/:id', getItemById);

// 2. SEND DATA (POST) - Korvattiin vanha koodi tällä lyhyellä versiolla!
app.post('/api/items', postItem);


// 3. MODIFY DATA (PUT) - Dummy functionality to update an item
app.put('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  const updatedData = req.body;
  
  // Dummy error testing: if someone tries to update ID 999, send an error
  if (itemId === '999') {
    return res.status(400).json({ error: 'Cannot update this specific item.' });
  }

  // 200 OK for successful update
  res.status(200).json({
    message: `Item ${itemId} updated successfully!`,
    newData: updatedData
  });
});

// 4. DELETE DATA
app.delete('/api/items/:id', deleteItem);

// --- USERS ROUTES ---

// Hae käyttäjä ID:llä
app.get('/api/users/:id', getUserById);

// Luo uusi käyttäjä
app.post('/api/users', postUser);

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