import express from 'express';

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

// Middleware to read JSON data from the request body
app.use(express.json());

// 1. READ DATA (GET) - Sends a response in JSON format
app.get('/api/items', (req, res) => {
  const dummyData = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' }
  ];
  // 200 OK is sent automatically with res.json()
  res.json(dummyData); 
});

// 2. SEND DATA (POST) - Receives data and creates something new
app.post('/api/items', (req, res) => {
  const receivedData = req.body;
  // 201 Created is the correct status code for creating a resource
  res.status(201).json({
    message: 'Item created successfully!',
    yourData: receivedData
  });
});

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

// 4. DELETE DATA (DELETE) - Dummy functionality to delete an item
app.delete('/api/items/:id', (req, res) => {
  const itemId = req.params.id;

  // Dummy error testing: if ID is 999, fail to delete
  if (itemId === '999') {
    return res.status(404).json({ error: 'Item not found to delete.' });
  }

  // 200 OK for successful deletion (or 204 No Content if sending no body)
  res.status(200).json({ message: `Item ${itemId} deleted successfully!` });
});

// 5. 404 RESPONSE - Catch-all for non-existing resources
app.use((req, res) => {
  // If the user visits a URL that isn't defined above, they get this.
  res.status(404).json({ error: '404 - Resource not found' });
});

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});