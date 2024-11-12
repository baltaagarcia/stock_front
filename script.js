import Inventario from "./Inventario.js";
import Producto from "./producto.js";

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
  .addEventListener("submit",async function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const cantidad = document.getElementById("cantidad").value;
    const precio = document.getElementById("precio").value;
    const categoriaId = document.getElementById("categoria").value;
    const mensajeError = document.getElementById("mensaje-error");

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
    console.log({
      nombre: nombre,
      cantidad: cantidad,
      precio: parseFloat(precio).toFixed(2),
      categoriaId: categoriaId
    });
    const producto = new Producto(
      this.idActualProducto++,
      nombre,
      cantidad,
      parseFloat(precio).toFixed(2),
      categoriaId
    );
    const id = await inventario.agregarProductoAPI(producto);
    inventario.agregarProducto(id,nombre, cantidad, precio, categoriaId);
    this.reset();
  });

document.getElementById("importar").addEventListener("change", importarCSV);
/**
 * importa archivo CSV de producto a la tabla de la interfaz
 * @param {InputEvent} event al importar archivo CSV 
 * @returns la alerta de error si no se ha seleccionaod ningun archivo
 */
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

    for (let i = 1; i < lineas.length; i++) {
      const datos = lineas[i].split(",");
      if (datos.length === 5) {
        const id = parseInt(datos[0]);
        const nombre = datos[1].trim();
        const cantidad = parseInt(datos[2]);
        const precio = parseFloat(datos[3]);
        const categoria = parseInt(datos[4]);

        if (
          !isNaN(id) &&
          !isNaN(cantidad) &&
          !isNaN(precio) &&
          cantidad >= 0 &&
          precio >= 0
        ) {
          inventario.agregarProducto(nombre, cantidad, precio, categoria);
        } else {
          console.warn(`Datos inválidos en la línea ${i + 1}: ${lineas[i]}`);
        }
      }
    }
  };

  lector.readAsText(archivo);
}

/**
 * exporta la taba de productos en archivo
 * @returns la alerrta de error si no hay productos para exportar
 */
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
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); 
}

const botonExportar = document.createElement("button");
botonExportar.textContent = "Exportar Inventario";
botonExportar.onclick = exportarCSV;
document.body.appendChild(botonExportar);

document.addEventListener("DOMContentLoaded", () => {
  importarProductosDesdeAPI();
});

/**
 * para importar productos desde la API
 */
function importarProductosDesdeAPI() {
  fetch("http://localhost:3000/") 
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la red al obtener los productos");
      }
      return response.json();
    })
    .then((productos) => {
      productos.forEach((producto) => {
        const { id, precio, nombre, cantidad, categoria } = producto;

        if (
          !isNaN(id) &&
          !isNaN(cantidad) &&
          !isNaN(precio) &&
          cantidad >= 0 &&
          precio >= 0
        ) {
          inventario.agregarProducto(precio, nombre, cantidad, categoria);
        } else {
          console.warn(
            `Datos inválidos para el producto: ${JSON.stringify(producto)}`
          );
        }
      });
    })
    .catch((error) => {
      console.error("Hubo un problema con la solicitud:", error);
    });
}
