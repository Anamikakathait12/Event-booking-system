import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getJwtSecret } from '../utils/jwt.js';

export async function authenticate(req, res, next) {
  const authorization = req.get('authorization');
  const match = authorization?.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'A bearer token is required.' });
  }

  let payload;
  try {
    payload = jwt.verify(match[1], getJwtSecret());
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    return next(error);
  }

  if (typeof payload === 'string' || typeof payload.sub !== 'string') {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  try {
    const user = await User.findById(payload.sub).select('name email role');

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Administrator access is required.' });
  }

  return next();
}
