// src/items.js

const items = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' }
];

// 1. Hakee kaikki itemit
const getItems = (req, res) => {
  res.json(items);
};

// 2. UUSI: Hakee vain yhden itemin ID:n perusteella
const getItemById = (req, res) => {
  const id = req.params.id; // Napataan ID url-osoitteesta (esim. /api/items/1)
  
  // Etsitään taulukosta item, jonka id täsmää (käytetään == koska urlin id on merkkijono)
  const item = items.find(item => item.id == id);

  if (item) {
    res.json(item); // Jos löytyi, palautetaan se
  } else {
    res.status(404).json({ error: 'Item not found' }); // Jos ei löytynyt, palautetaan 404
  }
};

// 3. UUSI: Lisää uuden itemin taulukkoon
const postItem = (req, res) => {
  const newItem = req.body; // Napataan käyttäjän lähettämä data (esim. { "name": "Orange" })
  
  // Generoidaan uudelle itemille ID (katsotaan mikä on listan viimeinen ID ja lisätään 1)
  newItem.id = items.length > 0 ? items[items.length - 1].id + 1 : 1;
  
  // Lisätään (push) uusi item meidän mock data -taulukkoon!
  items.push(newItem);
  
  // Palautetaan 201 Created ja tieto siitä mitä lisättiin
  res.status(201).json({
    message: 'Item created successfully!',
    item: newItem
  });
};

// 4. UUSI: Poistaa oikeasti itemin listalta
const deleteItem = (req, res) => {
  const id = req.params.id;
  
  // Etsitään, monennellako sijalla (indeksi) poistettava item on taulukossa
  const index = items.findIndex(item => item.id == id);

  if (index !== -1) {
    // splice() on JavaScriptin tapa poistaa alkio taulukosta tietystä kohdasta
    const deletedItem = items.splice(index, 1);
    
    res.json({ 
      message: `Item ${id} deleted successfully!`,
      deleted: deletedItem[0] 
    });
  } else {
    // Jos annettua ID:tä ei löydy listalta
    res.status(404).json({ error: 'Item not found to delete.' });
  }
};

export { getItems, getItemById, postItem, deleteItem };