let cache = [];

export function setHistorial(nuevoHistorial) {
  cache = nuevoHistorial;
}

export default function handler(req, res) {
  const ultima = cache.length > 0 ? cache[cache.length - 1] : null;
  res.status(200).json({ senal: ultima });
}
