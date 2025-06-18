import { analizarMercado } from '../../backend/indicadores.js';
import { enviarSenalTelegram } from '../../backend/telegram.js';

export default async function handler(req, res) {
  try {
    const resultado = await analizarMercado();

    if (resultado) {
      const senal = {
        tipo: resultado.senal,
        confianza: resultado.confianza,
        hora: new Date().toISOString()
      };

      await enviarSenalTelegram(senal);

      return res.status(200).json({ mensaje: '✅ Bot iniciado y señal enviada', senal });
    } else {
      return res.status(200).json({ mensaje: '⚠️ Sin señales por ahora' });
    }

  } catch (err) {
    console.error('❌ Error en el handler:', err);
    return res.status(500).json({ error: '❌ Error al iniciar el bot', detalle: err.message });
  }
}
