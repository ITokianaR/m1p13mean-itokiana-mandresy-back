import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import databaseConnection from "./config/database.js";
import { configDotenv } from "dotenv";

import route from "./routes/route.js";

configDotenv();
await databaseConnection();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', route);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});