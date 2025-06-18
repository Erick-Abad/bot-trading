// api/ultima-senal.js
let cache = [];

export function setHistorial(nuevoHistorial) {
  cache = nuevoHistorial;
}

export default function handler(req, res) {
  res.status(200).json({ historial: cache });
}
