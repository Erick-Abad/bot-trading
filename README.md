# Bot de Señales Cripto IDX (Binomo)

## Requisitos

- Node.js
- MySQL (base de datos llamada `tradingbot`)
- Token de Telegram y Chat ID

## Uso

1. Instala dependencias:
```
npm install
```

2. Configura tu archivo `.env` con el token y chat ID de Telegram.

3. Ejecuta el bot:
```
npm start
```

El bot analizará el mercado cada 5 minutos y enviará una señal por Telegram si encuentra una oportunidad.
