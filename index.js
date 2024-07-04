import express from "express";
import dotenv from "dotenv";
import { databaseConnect } from "./utils/database.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({
  path: "./.env",
});

const app = express();
const port = process.env.PORT;
const databaseUrl = process.env.DB_URL;

databaseConnect(databaseUrl);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API Working Well");
});

app.listen(port, () => {
  console.log("Server Running Successfully");
});
