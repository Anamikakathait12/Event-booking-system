import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { createAuthToken } from '../utils/jwt.js';

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function register(req, res, next) {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    return res.status(201).json({
      user: publicUser(user),
      token: createAuthToken(user.id),
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    return res.status(200).json({
      user: publicUser(user),
      token: createAuthToken(user.id),
    });
  } catch (error) {
    return next(error);
  }
}

export function getCurrentUser(req, res) {
  return res.status(200).json({ user: publicUser(req.user) });
}

export function getAdminAccess(req, res) {
  return res.status(200).json({
    message: 'Administrator access granted.',
    user: publicUser(req.user),
  });
}
