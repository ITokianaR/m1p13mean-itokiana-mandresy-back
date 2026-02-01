import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import databaseConnection from "./config/database.js";
import { configDotenv } from "dotenv";

configDotenv();
await databaseConnection();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});