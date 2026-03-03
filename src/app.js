import express from "express";
import cors from "cors";
import passport from "passport";
import databaseConnection from "./config/database.js";
import { configDotenv } from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";
import cartRouter  from './controllers/cart_controller.js';
import orderRouter from './controllers/order_controller.js';

configDotenv();

import route from "./routes/route.js";
import { initPassport } from "./controllers/auth.controller.js"; 

await databaseConnection();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIDDLEWARES
// ✅ CORS mis à jour : accepte localhost en dev ET le domaine Vercel en prod
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://m1p13meanitokianamandresyfront.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/storages', express.static(path.join(__dirname, '../storages')));
app.use('/api/cart',   cartRouter);
app.use('/api/orders', orderRouter);

initPassport();
app.use(passport.initialize());

// ROUTES 
app.use('/api', route);

// GESTION DES ERREURS 
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});