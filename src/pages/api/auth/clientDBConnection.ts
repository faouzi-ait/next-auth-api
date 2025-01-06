import { MongoClient } from "mongodb";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

const uri = process.env.MONGODB_URI as string;

// if (!clientPromise) {
client = new MongoClient(uri);
clientPromise = client.connect();
// }

export async function connect(): Promise<MongoClient> {
  if (!client) {
    client = await clientPromise;
  }
  return client;
}

export default clientPromise;
