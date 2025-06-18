import { analizarMercado } from '../../backend/indicadores.js';
import { enviarSenalTelegram } from '../../backend/telegram.js';

export default async function handler(req, res) {
  try {
    const resultado = await analizarMercado();

    if (resultado?.senal !== "null") {
      await enviarSenalTelegram(resultado);
      return res.status(200).json({ mensaje: '✅ Señal enviada', senal: resultado });
    } else {
      return res.status(200).json({ mensaje: '⚠️ No se generó señal útil' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Error al iniciar el bot', detalle: err.message });
  }
}
