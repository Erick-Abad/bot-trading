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

    // Eliminar señales con más de 1 hora
    const unaHora = 1000 * 60 * 60;
    const ahora = Date.now();
    historial = historial.filter(s => ahora - new Date('1970-01-01T' + s.hora + 'Z').getTime() < unaHora);

    return res.json({ senal });
  } else {
    return res.json({ senal: null });
  }
}
