import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

export const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.query('SELECT * FROM tokens WHERE token = ?', [token]);
    if (rows.length === 0) return res.status(403).json({ error: 'Token invalide ou expiré' });

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};
