// /api/start-bot.js
import { analizarMercado } from '../../backend/indicadores.js';
import { enviarSenalTelegram } from '../../backend/telegram.js';

export default async function handler(req, res) {
  try {
    const resultado = await analizarMercado();

    if (resultado && resultado.senal && resultado.senal !== "null") {
      await enviarSenalTelegram(resultado);

      return res.status(200).json({
        mensaje: '✅ Señal enviada correctamente',
        senal: resultado
      });
    } else {
      return res.status(200).json({
        mensaje: '⚠️ No se generó señal útil'
      });
    }

  } catch (error) {
    console.error("❌ Error interno:", error);
    return res.status(500).json({
      error: '❌ Error interno del servidor',
      detalle: error.message
    });
  }
}
