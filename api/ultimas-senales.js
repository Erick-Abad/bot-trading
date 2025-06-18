export default function handler(req, res) {
  globalThis.historial = globalThis.historial || [];
  const activas = globalThis.historial.filter(s =>
    new Date(s.hora).getTime() > Date.now() - 60 * 60 * 1000
  );
  res.status(200).json(activas);
}
