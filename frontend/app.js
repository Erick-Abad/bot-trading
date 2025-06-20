fetch('/api/ultima-senal')
  .then(res => res.json())
  .then(data => {
    document.getElementById('senal').innerText = data.senal || "Sin señal aún";
  });
