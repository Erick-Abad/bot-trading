// api/start-bot.js
import { analizarMercado } from '../../backend/indicadores.js';
import { enviarSenalTelegram } from '../../backend/telegram.js';

let intervalo = null;
let historial = [];

export default async function handler(req, res) {
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
          const haceUnaHora = Date.now() - 3600000;
          historial = historial.filter(s => {
            const partes = s.hora.split(":");
            const fecha = new Date();
            fecha.setHours(parseInt(partes[0]));
            fecha.setMinutes(parseInt(partes[1]));
            fecha.setSeconds(parseInt(partes[2]));
            return fecha.getTime() >= haceUnaHora;
          });
        }
      }, 60000); // cada 60 segundos
    }

    return res.status(200).json({ mensaje: 'Bot iniciado' });
  } else {
    return res.status(405).json({ error: 'Método no permitido' });
  }
}