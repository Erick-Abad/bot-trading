// api/start-bot.js
import { analizarMercado } from '../../backend/indicadores.js';
import { enviarSenalTelegram } from '../../backend/telegram.js';

let intervalo = null;
let historial = [];

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (!intervalo) {
        intervalo = setInterval(async () => {
          const resultado = await analizarMercado();
          if (resultado) {
            const senal = {
              tipo: resultado.senal,
              confianza: resultado.confianza,
              hora: new Date().toLocaleTimeString('es-EC'),
            };

            historial.push(senal);
            await enviarSenalTelegram(senal);

            // Eliminar señales con más de 1 hora
            const unaHora = 3600000;
            const ahora = Date.now();
            historial = historial.filter(s => {
              const [h, m, s] = s.hora.split(":").map(n => parseInt(n));
              const fecha = new Date();
              fecha.setHours(h, m, s);
              return ahora - fecha.getTime() < unaHora;
            });
          }
        }, 60000);
      }

      res.status(200).json({ mensaje: 'Bot iniciado correctamente ✅' });
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error("Error en el bot:", error);
    res.status(500).json({ error: 'Error al iniciar el bot', detalle: error.message });
  }
}
