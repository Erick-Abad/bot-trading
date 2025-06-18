const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { analizarMercado } = require('./indicadores');
const { enviarSenalTelegram } = require('./telegram');

let ultimaSenal = null; // guarda la señal en memoria

const app = express();
app.use(cors());
app.use(express.static('frontend'));

// API para frontend
app.get('/api/ultima-senal', (req, res) => {
  res.json({ senal: ultimaSenal });
});

// API para forzar señal
app.get('/forzar-senal', async (req, res) => {
  const senal = await analizarMercado();
  ultimaSenal = senal;
  if (senal) {
    await enviarSenalTelegram(senal);
    res.send(`✅ Señal enviada: ${senal}`);
  } else {
    res.send("❌ No se generó señal (sin confirmación técnica)");
  }
});

app.listen(8080, () => {
  console.log("🚀 Servidor activo en http://localhost:8080");
});
