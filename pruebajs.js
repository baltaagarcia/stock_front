console.log("pruebaaa");

// Función para importar CSV
function importarCSV(event) {
    const archivo = event.target.files[0];
    if (!archivo) {
      alert("No se ha seleccionado ningún archivo.");
      return;
    }
  
    const lector = new FileReader();
  
    lector.onload = function (e) {
      const contenido = e.target.result;
      const lineas = contenido.split("\n");
  
      // Omitir la primera línea (encabezados)
      for (let i = 1; i < lineas.length; i++) {
        const datos = lineas[i].split(",");
        if (datos.length === 5) {
          const id = parseInt(datos[0]);
          const nombre = datos[1].trim();
          const cantidad = parseInt(datos[2]);
          const precio = parseFloat(datos[3]);
          const categoria = parseInt(datos[4]);
  
          // Verificamos que los datos sean válidos antes de agregar
          if (
            !isNaN(id) &&
            !isNaN(cantidad) &&
            !isNaN(precio) &&
            cantidad >= 0 &&
            precio >= 0
          ) {
            inventario.agregarProducto(nombre, cantidad, precio,categoria);
          } else {
            console.warn(`Datos inválidos en la línea ${i + 1}: ${lineas[i]}`);
          }
        }
      }
    };
  
    lector.readAsText(archivo);
  }