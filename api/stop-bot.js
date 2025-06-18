import { detenerBot } from '../backend/bot.js';

export default async function handler(req, res) {
  await detenerBot();
  res.status(200).json({ status: 'bot detenido' });
}
