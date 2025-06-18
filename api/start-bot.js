import { iniciarBot } from '../backend/bot.js';

export default async function handler(req, res) {
  await iniciarBot();
  res.status(200).json({ status: 'bot iniciado' });
}
