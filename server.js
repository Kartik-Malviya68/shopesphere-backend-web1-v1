import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/dataBase/index.js";
import userRouter from "./src/router/userRoutes.js";
import productRouter from "./src/router/productRouter.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["POST", "PUT", "GET", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check (no DB required) so the root URL confirms the function is alive.
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "ShopSphere backend is running" });
});

// Ensure the database is connected before handling any API request.
// In serverless the connection is created once and reused across invocations.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

// Centralized error handler so failures return JSON instead of crashing the function.
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

// Only start a listening server when running locally (not on Vercel).
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`⚙️  Server is running at port : ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error);
    });
}

export default app;
