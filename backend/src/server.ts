import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./utils/connectDb";
import authRoutes from "./routes/auth";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/auth", authRoutes);

app.use((req, res) => res.status(404).json({ message: "Not found" }));

const PORT = process.env.PORT || 4000;
connectDb(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
