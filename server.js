import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/dataBase/index.js";
import productRouter from "./src/router/productRouter.js";
import cors from "cors";
dotenv.config({
  path: "./.env",
});

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  next();
});
async function main() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "*",
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Specify the origin of your frontend application
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
import userRouter from "./src/router/userRoutes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/products`, productRouter);

app.use(
  cors({
    origin: ["http://localhost:3000", "https://shopsphere-web-v1.vercel.app"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

connectDB().then(() => {
  app.listen(4000, () => {
    console.log(`⚙️ Server is running at port : 4000`);
  });
});

main();
