import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONDODB_URI is not defined");
}
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var mongoClient: Promise<MongoClient> | undefined;
}

if (!global.mongoClient) {
  client = new MongoClient(uri, options);
  global.mongoClient = client.connect();
}

clientPromise = global.mongoClient;
export default clientPromise;
