import { MongoClient, Db } from "mongodb";

let cachedConnection: MongoClient | null = null;

function isConnected(connection: any) {
  if (connection && connection.topology && connection.topology.isConnected()) {
    return true;
  }
  return false;
}

/**
 *
 * @param {string} URI
 * @param {string} dbName
 * @returns
 */
async function connectToDatabase(): Promise<MongoClient> {
  if (cachedConnection) {
    console.log("Use existing connection");
    return cachedConnection;
  } else {
    console.log("creating new connection")
    let connection = await MongoClient.connect("mongodb+srv://21f1003498:pk03PaybRk45QsfK@cluster0.ksziady.mongodb.net/?retryWrites=true&w=majority", {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedConnection = connection;
    return cachedConnection;
  }
}

async function getDb(): Promise<Db> {
  let connection = await connectToDatabase();
  return connection.db(process.env.dbName);
}

async function closeConnection() {
  if (cachedConnection) {
    await cachedConnection.close();
  }
}

export const MongoClientService = { connectToDatabase, closeConnection, getDb };
