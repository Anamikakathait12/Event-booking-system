import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { getJwtSecret } from './utils/jwt.js';

const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI;

async function startServer() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required. Copy .env.example to .env and configure it.');
  }

  getJwtSecret();
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exitCode = 1;
});
