const { analizarMercado } = require('../backend/indicadores');
const { enviarSenalTelegram } = require('../backend/telegram');

let historial = [];

export default async function handler(req, res) {
  const resultado = await analizarMercado();

  if (resultado) {
    const senal = {
      tipo: resultado.senal,
      confianza: resultado.confianza,
      hora: new Date().toLocaleTimeString('es-EC'),
    };

    historial.push(senal);
    await enviarSenalTelegram(senal);

    // Eliminar señales mayores a 1 hora
    const unaHora = 1000 * 60 * 60;
    const ahora = Date.now();
    historial = historial.filter(s => {
      const partes = s.hora.split(":");
      const fecha = new Date();
      fecha.setHours(parseInt(partes[0]));
      fecha.setMinutes(parseInt(partes[1]));
      fecha.setSeconds(parseInt(partes[2]));
      return ahora - fecha.getTime() < unaHora;
    });

    return res.json({ senal });
  } else {
    return res.json({ senal: null });
  }
}