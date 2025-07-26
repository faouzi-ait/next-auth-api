/* eslint-disable */
import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface ClientCache {
  client: any | null;
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

async function connectClient() {
  if (cachedClient.client) {
    return cachedClient.client;
  }

  if (!cachedClient.promise) {
    cachedClient.promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ client: "client-connected" });
      }, 1000);
    });
  }

  cachedClient.client = await cachedClient.promise;
  global.clientPromise = cachedClient;

  return cachedClient.client;
}

export { connect, connectClient };
