import express from 'express';
import path from 'path';
import cors from 'cors';
import * as dotenv from "dotenv";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

// Configurações de ambiente
dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});


const app = express();
const BASE_URL = process.env.VITE_EXPRESS_BASE_URL || "localhost";
const PORT = process.env.VITE_EXPRESS_PORT || 5000;

// Use CORS middleware
app.use(cors());

// Serve os arquivos estáticos do build do React
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Rota para a página inicial
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on ${BASE_URL}:${PORT}`);
});