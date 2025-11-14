import mongoose from "mongoose";

export default async function connectDb(uri: string) {
  if (!uri) throw new Error("MONGO_URI not provided");
  await mongoose.connect(uri, {
    // options handled by mongoose 7+
  });
  console.log("MongoDB connected");
}
