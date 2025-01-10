import express from 'express';
import path from 'path';
import * as dotenv from "dotenv";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

// Configurações de ambiente
dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});

const app = express();
const port = process.env.WEB_API_PORT || 4000;

// Serve os arquivos estáticos do build do React
app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});