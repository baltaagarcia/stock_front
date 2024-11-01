fetch('http://localhost:3000/')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la red');
    }
    return response.json(); // O response.text() si es texto
  })
  .then(data => {
    console.log(data); // Manejar los datos aquí
  })
  .catch(error => {
    console.error('Hubo un problema con la solicitud:', error);
  });
