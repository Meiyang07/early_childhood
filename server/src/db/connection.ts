// src/db/connection.ts
import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(uri: string) {
  if (isConnected) return mongoose.connection;

  mongoose.set('strictQuery', true);
  mongoose.set('sanitizeFilter', true); // protects against operator injection

  await mongoose.connect(uri, {
    maxPoolSize: 20,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    autoIndex: process.env.NODE_ENV !== 'production', // build indexes manually in prod
  });

  isConnected = true;
  console.log('✅ MongoDB connected');
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  isConnected = false;
}