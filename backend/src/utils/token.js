import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const makeToken = (user) =>
  jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: '14d' });

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);
