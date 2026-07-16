import mongoose from "mongoose";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalForMongoose.mongooseCache ?? {
  connection: null,
  promise: null,
};

globalForMongoose.mongooseCache = cache;

function databaseUri() {
  if (process.env.NODE_ENV === "production") {
    const productionUri =
      process.env.MONGODB_URI_PRODUCTION ?? process.env.MONGODB_URI;
    if (!productionUri) {
      throw new Error("MONGODB_URI_PRODUCTION is required in production");
    }
    return productionUri;
  }

  return (
    process.env.MONGODB_URI_LOCAL ??
    "mongodb://127.0.0.1:27017/poolad-saghf"
  );
}

export async function connectDB() {
  if (cache.connection) return cache.connection;

  cache.promise ??= mongoose.connect(databaseUri(), {
    serverSelectionTimeoutMS: 5_000,
  });

  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}
