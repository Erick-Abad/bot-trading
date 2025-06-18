// pages/api/start-bot.js

import { analizarMercado } from '../../backend/indicadores.js';
import { enviarSenalTelegram } from '../../backend/telegram.js';

let intervalo = null;
let historial = [];

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Método no permitido' });
    }

    if (!intervalo) {
      intervalo = setInterval(async () => {
        try {
          const resultado = await analizarMercado();

          if (resultado) {
            const senal = {
              tipo: resultado.senal,
              confianza: resultado.confianza,
              hora: new Date().toLocaleTimeString('es-EC'),
            };

            historial.push(senal);
            await enviarSenalTelegram(senal);

            // Limpiar historial > 1 hora
            const unaHora = 1000 * 60 * 60;
            const ahora = Date.now();
            historial = historial.filter(s => {
              const [h, m, s] = s.hora.split(":").map(Number);
              const fecha = new Date();
              fecha.setHours(h, m, s);
              return ahora - fecha.getTime() < unaHora;
            });
          }
        } catch (error) {
          console.error("Error interno en intervalo:", error.message);
        }
      }, 300000); // Cada 5 minutos
    }

    return res.status(200).json({ mensaje: 'Bot iniciado correctamente ✅' });

  } catch (error) {
    console.error("Fallo al iniciar bot:", error.message);
    return res.status(500).json({ error: 'Error interno al iniciar el bot', detalle: error.message });
  }
}
