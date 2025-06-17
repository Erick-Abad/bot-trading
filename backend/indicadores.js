const axios = require('axios');
const { RSI, EMA, MACD } = require('technicalindicators');

async function analizarMercado() {
  try {
    const { data } = await axios.get(
      'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=100'
    );

    const precios = data.map(candle => parseFloat(candle[4])); // precios de cierre

    const rsi = RSI.calculate({ values: precios, period: 14 });
    const ema9 = EMA.calculate({ values: precios, period: 9 });
    const ema21 = EMA.calculate({ values: precios, period: 21 });
    const macd = MACD.calculate({
      values: precios,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    });

    const rsiActual = rsi.at(-1);
    const ema9Actual = ema9.at(-1);
    const ema21Actual = ema21.at(-1);
    const macdActual = macd.at(-1);
    const macdAnterior = macd.at(-2);

    console.log(`RSI: ${rsiActual?.toFixed(2)} | EMA9: ${ema9Actual?.toFixed(2)} | EMA21: ${ema21Actual?.toFixed(2)}`);
    console.log(`MACD: ${macdActual?.MACD.toFixed(2)} | Signal: ${macdActual?.signal.toFixed(2)}`);

    if (!rsiActual || !ema9Actual || !ema21Actual || !macdActual || !macdAnterior) return { senal: "NEUTRAL", confianza: "🔴 Baja" };

    // Evaluar condiciones
    const tendenciaAlcista =
      rsiActual < 50 &&
      macdAnterior.MACD < macdAnterior.signal &&
      macdActual.MACD > macdActual.signal &&
      ema9Actual > ema21Actual;

    const tendenciaBajista =
      rsiActual > 50 &&
      macdAnterior.MACD > macdAnterior.signal &&
      macdActual.MACD < macdActual.signal &&
      ema9Actual < ema21Actual;

    let confianza = "🔴 Baja";
    let senal = "NEUTRAL";

    if (tendenciaAlcista) {
      senal = "CALL";
      confianza = rsiActual < 35 ? "🟢 Alta" : rsiActual < 45 ? "🟡 Media" : "🔴 Baja";
    } else if (tendenciaBajista) {
      senal = "PUT";
      confianza = rsiActual > 65 ? "🟢 Alta" : rsiActual > 55 ? "🟡 Media" : "🔴 Baja";
    } else {
      // predicción ligera a favor de EMA o RSI si no hay cruce MACD
      senal = ema9Actual > ema21Actual ? "CALL" : "PUT";
      confianza = "🔴 Baja";
    }

    return { senal, confianza };

  } catch (error) {
    console.error("❌ Error al analizar mercado:", error.message);
    return { senal: "NEUTRAL", confianza: "🔴 Baja" };
  }
}

module.exports = { analizarMercado };
