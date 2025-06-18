setInterval(() => {
  fetch('/api/bot')
    .then(res => res.json())
    .then(data => {
      console.log('Señal:', data.senal);
    });
}, 5 * 60 * 1000); // cada 5 min