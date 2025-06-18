// api/ejecutar.js
import { ejecutarBot } from '../../backend/bot';

export default async function handler(req, res) {
  await ejecutarBot();
  res.status(200).json({ mensaje: 'Ejecutado correctamente' });
}
