import jwt from 'jsonwebtoken';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 bytes.');
  }

  return secret;
}

export function createAuthToken(userId) {
  return jwt.sign({}, getJwtSecret(), {
    subject: userId,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}
