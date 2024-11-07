import Inventario from "./Inventario.js";

// Inicializar el inventario
const inventario = new Inventario();

//Agregar algunas categorias por defecto
inventario.agregarCategoria("-");
inventario.agregarCategoria("Electronica");
inventario.agregarCategoria("Alimentos");
inventario.agregarCategoria("Ropa");

// Agregar evento al formulario para añadir productos
document
  .getElementById("producto-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const cantidad = document.getElementById("cantidad").value;
    const precio = document.getElementById("precio").value;
    const categoriaId = document.getElementById("categoria").value;
    const mensajeError = document.getElementById("mensaje-error");

    // Validación de cantidad y precio
    if (cantidad < 0) {
      mensajeError.textContent = "La cantidad no puede ser negativa.";
      mensajeError.style.display = "block";
      return;
    } else if (precio < 0) {
      mensajeError.textContent = "El precio no puede ser negativo.";
      mensajeError.style.display = "block";
      return;
    } else {
      mensajeError.style.display = "none"; // Ocultar el mensaje de error si todo está bien
    }

    // Si la validación pasa, agregar el producto
    inventario.agregarProducto(nombre, cantidad, precio, categoriaId);

    // Limpiar campos del formulario
    this.reset();
  });
 document
 .getElementById("importar")
 .addEventListener("change",importarCSV)
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


// Función para eliminar un producto (se llama desde el botón)
/*document.getElementById("")
 .addEventListener("click",eliminarProducto)
function eliminarProducto(id) {
  inventario.eliminarProducto(id);
}*/

// Función para editar un producto (se llama desde el botón)
function editarProducto(id) {
  const producto = inventario.productos.find((p) => p.id === id);
  if (producto) {
    // Llenar el formulario con los datos del producto para editar
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("cantidad").value = producto.cantidad;
    document.getElementById("precio").value = producto.precio;

    // Cambiar el texto del botón de "Agregar Producto" a "Guardar Cambios"
    const boton = document.querySelector('button[type="submit"]');
    boton.textContent = "Guardar Cambios";

    // Cambiar el evento de envío para que guarde los cambios en lugar de agregar un nuevo producto
    document.getElementById("producto-form").onsubmit = function (e) {
      e.preventDefault();
      const nuevoNombre = document.getElementById("nombre").value;
      const nuevaCantidad = document.getElementById("cantidad").value;
      const nuevoPrecio = document.getElementById("precio").value;

      // Validación de cantidad y precio
      if (nuevaCantidad < 0) {
        mensajeError.textContent = "La cantidad no puede ser negativa.";
        mensajeError.style.display = "block";
        return;
      } else if (nuevoPrecio < 0) {
        mensajeError.textContent = "El precio no puede ser negativo.";
        mensajeError.style.display = "block";
        return;
      } else {
        mensajeError.style.display = "none";
      }

      inventario.editarProducto(id, nuevoNombre, nuevaCantidad, nuevoPrecio);

      // Restaurar el formulario a su estado original
      this.reset();
      boton.textContent = "Agregar Producto";
      this.onsubmit = function (e) {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const cantidad = document.getElementById("cantidad").value;
        const precio = document.getElementById("precio").value;

        // Validación de cantidad y precio
        if (cantidad < 0) {
          mensajeError.textContent = "La cantidad no puede ser negativa.";
          mensajeError.style.display = "block";
          return;
        } else if (precio < 0) {
          mensajeError.textContent = "El precio no puede ser negativo.";
          mensajeError.style.display = "block";
          return;
        } else {
          mensajeError.style.display = "none";
        }

        inventario.agregarProducto(nombre, cantidad, precio);
        this.reset();
      };
    };
  }
}

// Función para exportar a CSV
function exportarCSV() {
  const productos = inventario.productos;
  if (productos.length === 0) {
    alert("No hay productos para exportar.");
    return;
  }
  let csvContent =
    "data:text/csv;charset=utf-8," +
    "ID,Nombre,Cantidad,Precio,Categoria\n" +
    productos
      .map(
        (p) => `${p.id},${p.nombre},${p.cantidad},${p.precio},${p.categoria}`
      )
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "inventario.csv");
  document.body.appendChild(link); // Necesario para Firefox
  link.click();
  document.body.removeChild(link); // Limpia después de la descarga
}

// Agregar un botón para exportar
const botonExportar = document.createElement("button");
botonExportar.textContent = "Exportar Inventario";
botonExportar.onclick = exportarCSV;
document.body.appendChild(botonExportar);



document.addEventListener('DOMContentLoaded', () => {
  importarProductosDesdeAPI();
});

// Tu función para importar productos desde la API
function importarProductosDesdeAPI() {
  fetch('http://localhost:3000/') // Cambia la URL por la de tu API
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la red al obtener los productos');
      }
      return response.json();
    })
    .then(productos => {
      productos.forEach(producto => {
        const { id, nombre, cantidad, precio, categoria } = producto;

        // Verificamos que los datos sean válidos antes de agregar
        if (
          !isNaN(id) &&
          !isNaN(cantidad) &&
          !isNaN(precio) &&
          cantidad >= 0 &&
          precio >= 0
        ) {
          inventario.agregarProducto(nombre, cantidad, precio, categoria);
        } else {
          console.warn(`Datos inválidos para el producto: ${JSON.stringify(producto)}`);
        }
      });
    })
    .catch(error => {
      console.error('Hubo un problema con la solicitud:', error);
    });
};
