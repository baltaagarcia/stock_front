import Categoria from "./Categoria.js";

import Producto from "./producto.js";

const categoriasMap = {
  0: "Sin Categoria",
  1: "Electrónica",
  2: "Alimentos",
  3: "Ropa",
};

// Clase Inventario
class Inventario {
  constructor() {
    this.productos = [];
    this.categorias = [];
    this.idActualProdcuto = 1; // Para asignar un ID único a cada producto
    this.idActualCategoria = 0; // Para Asignar un ID unico a cada categoria
  }
/**
 * 
 * @param {number} id 
 * @param {string} nombre 
 * @param {number} cantidad 
 * @param {number} precio 
 * @param {number} categoria 
 * @returns un Producto
 */
  agregarProducto(id,nombre, cantidad, precio, categoria) {
    const producto = new Producto(
      id,
      nombre,
      cantidad,
      parseFloat(precio).toFixed(2),
      categoria
    );
    this.productos.push(producto);
    this.mostrarProductos();
    return producto;
  }
/**
 * agrega una categoria
 * @param {string} nombre 
 */
  agregarCategoria(nombre) {
    const categoria = new Categoria(this.idActualCategoria++, nombre);
    this.categorias.push(categoria);
    this.mostrarCategorias();
  }
/**
 * Elimina un producto
 * @param {number} id 
 */
  eliminarProducto(id) {
    // Filtrar el producto con el ID correspondiente
    this.productos = this.productos.filter((producto) => producto.id !== id);
    this.mostrarProductos();
    this.eliminarProductoAPI(id);
  }
/**
 * Muestra los productos mediante una tabla
 */
  mostrarProductos() {
    const tabla = document.getElementById("tabla-productos");
    tabla.innerHTML = ""; 

    this.productos.forEach((producto) => {
      const fila = document.createElement("tr");
    
      if (producto.cantidad < 5) {
        fila.style.backgroundColor = "#f8d7da"; 
      }
      fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio}</td>
                <td>${
                  producto.categoria
                    ? categoriasMap[producto.categoria]
                    : "Sin categoria"
                }</td>
                <td>
                    <button class= "boton-editar" id="btn-editar-${
                      producto.id
                    }">Editar</button>
                    <button class= "boton-eliminar" id ="btn-eliminar-${
                      producto.id
                    }">Eliminar</button>
                </td>
            `;
      tabla.appendChild(fila);
    });
    this.agregarFuncionalidades();
  }
/**
 * edita el producto a elegir
 * @param {number} id del producto a editar 
 */
  editarProducto(id) {
    const producto = this.productos.find((p) => p.id === id);
    console.log(this.productos);
  
    if (producto) {

      document.getElementById("nombre").value = producto.nombre;
      document.getElementById("cantidad").value = producto.cantidad;
      document.getElementById("precio").value = producto.precio;
      document.getElementById("categoria").value = producto.categoria;
  

      const boton = document.querySelector('button[type="submit"]');
      boton.textContent = "Guardar Cambios";
  

      document.getElementById("producto-form").onsubmit = async function (e) {
        e.preventDefault();
  
        const nuevoNombre = document.getElementById("nombre").value;
        const nuevaCantidad = document.getElementById("cantidad").value;
        const nuevoPrecio = document.getElementById("precio").value;
        const nuevaCategoria = document.getElementById("categoria").value;

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
  

        try {
          await editarProductoAPI(id, {
            nombre: nuevoNombre,
            cantidad: nuevaCantidad,
            precio: nuevoPrecio,
            categoria: nuevaCategoria,
          });
  
          console.log("Producto editado correctamente en la API");
  

          this.reset();
          boton.textContent = "Agregar Producto";
          this.onsubmit = function (e) {
            e.preventDefault();
            const nombre = document.getElementById("nombre").value;
            const cantidad = document.getElementById("cantidad").value;
            const precio = document.getElementById("precio").value;
            const categoria = document.getElementById("categoria").value;
  
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
  
            inventario.agregarProducto(nombre, cantidad, precio, categoria);
            this.reset();
          };
        } catch (error) {
          console.error("Error al editar el producto en la API:", error);
        }
      };
    }
  };
  /**
   * MUESTRA las categorias del producto
   */
  mostrarCategorias() {
    const selectCategorias = document.getElementById("categoria");
    selectCategorias.innerHTML = ""; 

    this.categorias.forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria.id;
      option.textContent = categoria.nombre;
      selectCategorias.appendChild(option);
    });
  }
/**
 * Funcionalidades de botones para eliminar y editar
 */
  agregarFuncionalidades() {
    document.querySelectorAll(".boton-editar").forEach((btnEditar) => {
      btnEditar.addEventListener("click", (e) => {
        const id = parseInt(e.target.id.split("-").pop()); 
        this.editarProducto(id);
      });
    });
    document.querySelectorAll(".boton-eliminar").forEach((btnEliminar) => {
      btnEliminar.addEventListener("click", (e) => {
        const id = parseInt(e.target.id.split("-").pop()); 
        this.eliminarProducto(id);
      });
    });
  }
  /**
   * manda la informacion del producto a agregar
   * @param {Producto} producto a agregar 
   * @returns 
   */
  agregarProductoAPI = async (producto) => {
    console.log("Producto a enviar:", producto);
  
    if (!producto.nombre || !producto.precio || !producto.cantidad || !producto.categoria) {
      console.error("Faltan campos necesarios para el producto.");
      return;
    }
  
    if (isNaN(producto.precio) || isNaN(producto.cantidad)) {
      console.error("Precio y cantidad deben ser números válidos.");
      return;
    }
  
    const data = {
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      precio: producto.precio,
      categoria: producto.categoria,
    };
  
    try {
      const response = await fetch("http://localhost:3000/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const resultado = await response.json();
      console.log("Producto agregado:", resultado);
      return resultado.id;  
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
};

  
  /**
   * Realiza la solicitud para eliminar producto
   * @param {number} id 
   */
  eliminarProductoAPI = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/productos/${id}`, {
        method: "DELETE",
      });

      const resultado = await response.json();
      console.log("Producto eliminado:", resultado);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };
   editarProductoAPI = async (id, productoActualizado) => {
    try {
      const response = await fetch(`http://localhost:3000/productos/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productoActualizado),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }
  
      const resultado = await response.json();
      console.log("Producto editado:", resultado);
      return resultado;
    } catch (error) {
      console.error("Error al editar el producto:", error);
      throw error;
    }
  };
  
}




export default Inventario;
