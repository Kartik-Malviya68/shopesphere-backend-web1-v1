import mongoose from "mongoose";

// Cache the connection across serverless invocations to avoid opening a new
// connection on every request (and exhausting the MongoDB connection pool).
let cached = global.mongooseConn;
if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(`${process.env.MONGODB_URI}/shop-sphere`)
      .then((instance) => {
        console.log(
          `\n MongoDB connected !! DB HOST: ${instance.connection.host}`
        );
        return instance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset so the next request can retry instead of caching a rejected promise.
    cached.promise = null;
    console.log("MONGODB connection FAILED ", error);
    throw error;
  }

  return cached.conn;
};

export default connectDB;
