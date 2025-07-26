import { MongoClient } from "mongodb";

let client: MongoClient | null = null;

const uri = process.env.MONGODB_URI as string;

client = new MongoClient(uri);
const clientPromise: Promise<MongoClient> = client.connect();

export async function connect(): Promise<MongoClient> {
  if (!client) {
    client = await clientPromise;
  }
  return client;
}

export default clientPromise;
