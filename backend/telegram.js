// backend/telegram.js
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

export async function enviarSenalTelegram(resultado) {
  const mensaje = `
📊 Señal Cripto IDX (Binomo)
👉 Señal: ${resultado.tipo}
🎯 Confianza: ${resultado.confianza}
🕒 Hora: ${(new Date()).toLocaleTimeString('es-EC')}
⚠️ Ejecutar después de que termine la vela actual de 1 minuto.
  `;
  await bot.sendMessage(process.env.CHAT_ID, mensaje);
}
