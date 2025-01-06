/* eslint-disable */

import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface ClientCache {
  client: any | null; // Type of client can be modified based on the client you are using.
  promise: Promise<any> | null;
}

/* eslint-disable no-var */
declare global {
  var mongoose: MongooseCache | undefined;
  var clientPromise: ClientCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };
const cachedClient: ClientCache = global.clientPromise || {
  client: null,
  promise: null,
};

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;

  return cached.conn;
}

// Example of adding a clientPromise logic (it can be any other client e.g., Prisma, custom Mongo client)
async function connectClient() {
  if (cachedClient.client) {
    return cachedClient.client;
  }

  if (!cachedClient.promise) {
    // Simulate a client connection or use actual client connection logic here
    cachedClient.promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ client: "client-connected" }); // Replace with actual client connection logic
      }, 1000); // Example delay
    });
  }

  cachedClient.client = await cachedClient.promise;
  global.clientPromise = cachedClient;

  return cachedClient.client;
}

export { connect, connectClient };
