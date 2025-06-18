import { analizarMercado } from '../backend/indicadores.js';
import { enviarSenalTelegram } from '../backend/telegram.js';

globalThis.historial = globalThis.historial || [];

export default async function handler(req, res) {
  const resultado = await analizarMercado();
  const hora = new Date();

  if (resultado && resultado.senal) {
    const señal = { ...resultado, hora: hora.toISOString() };
    globalThis.historial.push(señal);

    // Borrar señales después de 1 hora
    globalThis.historial = globalThis.historial.filter(s =>
      new Date(s.hora).getTime() > Date.now() - 60 * 60 * 1000
    );

    await enviarSenalTelegram(resultado);
    return res.status(200).json({ exito: true, resultado });
  }

  res.status(200).json({ exito: false, mensaje: "Sin señal técnica" });
}
