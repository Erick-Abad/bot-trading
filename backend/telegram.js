require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

async function enviarSenalTelegram({ senal, confianza }) {
  const ahora = new Date();
  const ejecutarDespues = new Date(ahora.getTime() + 60000); // +1 min

  const formato = h => h.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const mensaje = `📊 Señal Cripto IDX (Binomo)
👉 Señal: ${senal}
🎯 Confianza: ${confianza}
⏱️ Duración: 1 minuto
🕒 Hora: ${formato(ahora)}
⚠️ Ejecutar después de terminar la vela actual (~${formato(ejecutarDespues)})`;

  await bot.sendMessage(process.env.CHAT_ID, mensaje);
  console.log("✅ Señal enviada:", senal);
}

module.exports = { enviarSenalTelegram };
