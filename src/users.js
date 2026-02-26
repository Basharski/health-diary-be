// src/users.js

import bcrypt from 'bcryptjs';

// Opettajan antama testidata (salasanat hashattu)
const salt = bcrypt.genSaltSync(10);
const users = [
  {
    id: 1,
    username: 'johndoe',
    password: bcrypt.hashSync('password1', salt),
    email: 'johndoe@example.com'
  },
  {
    id: 2,
    username: 'janedoe',
    password: bcrypt.hashSync('password2', salt),
    email: 'janedoe@example.com'
  },
  {
    id: 3,
    username: 'bobsmith',
    password: bcrypt.hashSync('password3', salt),
    email: 'bobsmith@example.com'
  }
];

const toPublicUser = (user) => {
  if (!user) return user;
  const { password, ...publicUser } = user;
  return publicUser;
};

const findUserByUsername = (username) => users.find((u) => u.username === username);

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

  if (findUserByUsername(username)) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  
  // Hashataan salasana ennen tallennusta
  const passwordHash = bcrypt.hashSync(password, 10);

  // Generoidaan uusi ID
  const createdUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    username,
    password: passwordHash,
    email
  };

  users.push(createdUser);
  
  res.status(201).json({
    message: 'User created successfully!',
    user: toPublicUser(createdUser)
  });
};

// 2.8 Päivitä käyttäjä (PUT) - vain oma käyttäjä
const putUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const id = req.params.id;
  const tokenUserId = String(req.user.userId);

  if (String(id) !== tokenUserId) {
    return res.status(403).json({ error: 'forbidden' });
  }

  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Missing request body' });
  }

  const index = users.findIndex((u) => u.id == id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { username, email, password } = req.body;
  if (username && username !== users[index].username && findUserByUsername(username)) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const updatedUser = {
    ...users[index],
    ...(username ? { username } : {}),
    ...(email ? { email } : {})
  };

  if (password) {
    updatedUser.password = bcrypt.hashSync(password, 10);
  }

  users[index] = updatedUser;

  res.json({
    message: `User ${id} updated successfully!`,
    user: toPublicUser(updatedUser)
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

export { toPublicUser, findUserByUsername, getUsers, getUserById, postUser, putUser, deleteUser };