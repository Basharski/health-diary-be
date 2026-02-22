// src/users.js

// Opettajan antama testidata
const users = [
  { id: 1, username: "johndoe", password: "password1", email: "johndoe@example.com" },
  { id: 2, username: "janedoe", password: "password2", email: "janedoe@example.com" },
  { id: 3, username: "bobsmith", password: "password3", email: "bobsmith@example.com" }
];

const toPublicUser = (user) => {
  if (!user) return user;
  const { password, ...publicUser } = user;
  return publicUser;
};

// 0. Hae kaikki käyttäjät (GET)
const getUsers = (req, res) => {
  res.json(users.map(toPublicUser));
};

// 1. Hae tietty käyttäjä ID:llä (GET)
const getUserById = (req, res) => {
  const id = req.params.id;
  const user = users.find(u => u.id == id);

  if (user) {
    res.json(toPublicUser(user));
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

// 2. Luo uusi käyttäjä (POST)
const postUser = (req, res) => {
  const newUser = req.body;

  if (!newUser || typeof newUser !== 'object') {
    return res.status(400).json({ error: 'Missing request body' });
  }

  const { username, password, email } = newUser;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'username, password and email are required' });
  }
  
  // Generoidaan uusi ID
  newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  users.push(newUser);
  
  res.status(201).json({
    message: 'User created successfully!',
    user: toPublicUser(newUser)
  });
};

// 2.5 Poista käyttäjä (DELETE)
const deleteUser = (req, res) => {
  const id = req.params.id;
  const index = users.findIndex(u => u.id == id);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found to delete.' });
  }

  const deletedUser = users.splice(index, 1);
  res.json({
    message: `User ${id} deleted successfully!`,
    deleted: toPublicUser(deletedUser[0])
  });
};

// 3. Dummy-kirjautuminen (POST)
const loginUser = (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Missing request body' });
  }

  // Puretaan (destructuring) req.body:stä username ja password
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  
  // Etsitään käyttäjä, jolla on täsmälleen sama tunnus JA salasana
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // 200 OK: Kirjautuminen onnistui
    res.status(200).json({ 
      message: 'Login successful!', 
      userId: user.id 
    });
  } else {
    // 401 Unauthorized: Väärä tunnus tai salasana
    res.status(401).json({ error: 'Invalid username or password' });
  }
};

// Viedään funktiot, jotta index.js voi käyttää niitä
export { getUsers, getUserById, postUser, deleteUser, loginUser };