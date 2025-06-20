const { analizarMercado } = require('./indicadores');
const { enviarSenalTelegram } = require('./telegram');

// Ejecutar una vez al iniciar
ejecutarBot();

// Ejecutar automáticamente cada 5 minutos
setInterval(ejecutarBot, 5 * 60 * 1000); // 5 minutos

async function ejecutarBot() {
  const senal = await analizarMercado();
  console.log("⚠️ Señal generada:", senal);
  if (senal) {
    await enviarSenalTelegram(senal);
  } else {
    console.log("❌ No se generó ninguna señal.");
  }
}
