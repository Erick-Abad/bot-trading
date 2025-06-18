import axios from 'axios';
import { RSI, EMA, MACD } from 'technicalindicators';

export async function analizarMercado() {
  try {
    const { data } = await axios.get(
      'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=100'
    );
    const precios = data.map(candle => parseFloat(candle[4]));

    const rsi = RSI.calculate({ values: precios, period: 14 });
    const ema9 = EMA.calculate({ values: precios, period: 9 });
    const ema21 = EMA.calculate({ values: precios, period: 21 });
    const macd = MACD.calculate({
      values: precios,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    });

    const rsiActual = rsi.at(-1);
    const ema9Actual = ema9.at(-1);
    const ema21Actual = ema21.at(-1);
    const macdActual = macd.at(-1);
    const macdAnterior = macd.at(-2);

    if (!rsiActual || !ema9Actual || !ema21Actual || !macdActual || !macdAnterior) return null;

    if (
      rsiActual < 35 &&
      macdAnterior.MACD < macdAnterior.signal &&
      macdActual.MACD > macdActual.signal &&
      ema9Actual > ema21Actual
    ) return { senal: "CALL", confianza: "🟢 Alta" };

    if (
      rsiActual > 65 &&
      macdAnterior.MACD > macdAnterior.signal &&
      macdActual.MACD < macdActual.signal &&
      ema9Actual < ema21Actual
    ) return { senal: "PUT", confianza: "🔴 Alta" };

    return { senal: "null", confianza: "⚪ Baja" };
  } catch (e) {
    console.error("Error en analizarMercado:", e);
    return null;
  }
}
