let historial = []; // Solo para pruebas locales; en Vercel esto se reinicia

export default function handler(req, res) {
  res.json(historial);
}
