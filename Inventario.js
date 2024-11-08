import Categoria from "./Categoria.js";

import Producto from "./Producto.js";

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
   * @param {string} nombre del producto a agregar
   * @param {number} cantidad del producto a agregar
   * @param {*number} precio del  produco a agregar
   * @param {number} categoria del producto a agregar
   * @returns un Producto
   */
  agregarProducto(nombre, cantidad, precio, categoria) {
    const producto = new Producto(
      this.idActualProdcuto++,
      nombre,
      cantidad,
      parseFloat(precio).toFixed(2),
      categoria
    );
    this.productos.push(producto);
    this.mostrarProductos();
    return producto
  }

  /**
   * 
   * @param {string} nombre 
   */
  agregarCategoria(nombre) {
    const categoria = new Categoria(this.idActualCategoria++, nombre);
    this.categorias.push(categoria);
    this.mostrarCategorias();
  }

  eliminarProducto(id) {
    // Filtrar el producto con el ID correspondiente
    this.productos = this.productos.filter((producto) => producto.id !== id);
    this.mostrarProductos();
    this.eliminarProductoAPI(id);
  }

  /**
   * muestra los productos mediante una tabla
   */
  mostrarProductos() {
    const tabla = document.getElementById("tabla-productos");
    tabla.innerHTML = ""; // Limpiar la tabla antes de renderizar

    this.productos.forEach((producto) => {
      const fila = document.createElement("tr");
      // Resaltar si la cantidad está por debajo de 5
      if (producto.cantidad < 5) {
        fila.style.backgroundColor = "#f8d7da"; // Color de fondo para bajo stock
      }
      fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio}</td>
                <td>${producto.categoria
          ? categoriasMap[producto.categoria]
          : "Sin categoria"
        }</td>
                <td>
                    <button class= "boton-editar" id="btn-editar-${producto.id
        }">Editar</button>
                    <button class= "boton-eliminar" id ="btn-eliminar-${producto.id
        }">Eliminar</button>
                </td>
            `;
      tabla.appendChild(fila);
    });
    this.agregarFuncionalidades();
  }

  /**
   * edita el produco a elegir
   * @param {number} id del producto a editar 
   */
  editarProducto(id) {
    const producto = this.productos.find((p) => p.id === id);
    console.log(this.productos);

    if (producto) {
      // Llenar el formulario con los datos del producto para editar
      document.getElementById("nombre").value = producto.nombre;
      document.getElementById("cantidad").value = producto.cantidad;
      document.getElementById("precio").value = producto.precio;
      document.getElementById("categoria").value = producto.categoria;

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

        this.editarProducto(id, nuevoNombre, nuevaCantidad, nuevoPrecio);

        // Restaurar el formulario a su estado original
        this.reset();
        boton.textContent = "Agregar Producto";
        this.onsubmit = function (e) {
          e.preventDefault();
          const nombre = document.getElementById("nombre").value;
          const cantidad = document.getElementById("cantidad").value;
          const precio = document.getElementById("precio").value;
          const categoria = document.getElementById("categoria").value;

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

          inventario.agregarProducto(nombre, cantidad, precio, categoria);
          this.reset();
        };
      };
    }
  }
  /**
   * Muestra las categorias del producto
   */
  mostrarCategorias() {
    const selectCategorias = document.getElementById("categoria");
    selectCategorias.innerHTML = ""; // Limpiar el select antes de agregar opciones

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
        const id = parseInt(e.target.id.split("-").pop()); // Extraer el ID del botón
        this.editarProducto(id);
      });
    });
    document.querySelectorAll(".boton-eliminar").forEach((btnEliminar) => {
      btnEliminar.addEventListener("click", (e) => {
        const id = parseInt(e.target.id.split("-").pop()); // Extraer el ID del botón
        this.eliminarProducto(id);
      });
    });
  }
  /**
   * manda la informacion del producto a agregar
   * @param {Producto} producto a agregar
   */
  agregarProductoAPI = async (producto) => {
    const data = {
      id: producto.id,
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      precio: producto.precio,
      categoria: producto.categoria

    };

    try {
      const response = await fetch('http://localhost:3000/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const resultado = await response.json();
      console.log('Producto agregado:', resultado);
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  };
  /**
   * realiza la solicitud para eliminar producto
   * @param {number} id del producto a eliminar 
   */
  eliminarProductoAPI = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/productos/${id}`, {
        method: 'DELETE'
      });

      const resultado = await response.json();
      console.log('Producto eliminado:', resultado);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

}




export default Inventario;
