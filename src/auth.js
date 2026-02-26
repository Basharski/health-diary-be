import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

import { findUserByUsername, toPublicUser } from './users.js';

const postLogin = async (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Missing request body' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const user = findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET is not set on server' });
  }

  const tokenPayload = {
    userId: user.id,
    username: user.username,
    email: user.email
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });

  res.json({
    message: 'Login successful!',
    user: toPublicUser(user),
    token
  });
};

const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({ message: 'token ok', user: req.user });
};

export { postLogin, getMe };
