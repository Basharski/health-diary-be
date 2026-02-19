// src/users.js

// Opettajan antama testidata
const users = [
  { id: 1, username: "johndoe", password: "password1", email: "johndoe@example.com" },
  { id: 2, username: "janedoe", password: "password2", email: "janedoe@example.com" },
  { id: 3, username: "bobsmith", password: "password3", email: "bobsmith@example.com" }
];

// 1. Hae tietty käyttäjä ID:llä (GET)
const getUserById = (req, res) => {
  const id = req.params.id;
  const user = users.find(u => u.id == id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

// 2. Luo uusi käyttäjä (POST)
const postUser = (req, res) => {
  const newUser = req.body;
  
  // Generoidaan uusi ID
  newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  users.push(newUser);
  
  res.status(201).json({
    message: 'User created successfully!',
    user: newUser
  });
};

// 3. Dummy-kirjautuminen (POST)
const loginUser = (req, res) => {
  // Puretaan (destructuring) req.body:stä username ja password
  const { username, password } = req.body;
  
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
export { getUserById, postUser, loginUser };