import Categoria from "./Categoria.js";

import Producto from "./producto.js";


const categoriasMap = {
    0: 'Sin Categoria',
    1: 'Electrónica',
    2: 'Alimentos',
    3: 'Ropa',

}

// Clase Inventario
class Inventario {
    constructor() {
        this.productos = [];
        this.categorias = [];
        this.idActualProdcuto = 1; // Para asignar un ID único a cada producto
        this.idActualCategoria = 0; // Para Asignar un ID unico a cada categoria    
    }

    agregarProducto(nombre, cantidad, precio, categoria) {
        const producto = new Producto(this.idActualProdcuto++, nombre, cantidad, parseFloat(precio).toFixed(2), categoria);
        this.productos.push(producto);
        this.mostrarProductos();
    }

    agregarCategoria(nombre) {
        const categoria = new Categoria(this.idActualCategoria++, nombre)
        this.categorias.push(categoria);
        this.mostrarCategorias();
    }

    eliminarProducto(id) {
        // Filtrar el producto con el ID correspondiente
        this.productos = this.productos.filter(producto => producto.id !== id);
        this.mostrarProductos();
    }


    mostrarProductos() {
        const tabla = document.getElementById('tabla-productos');
        tabla.innerHTML = ''; // Limpiar la tabla antes de renderizar

        this.productos.forEach((producto) => {
            const fila = document.createElement('tr');
            // Resaltar si la cantidad está por debajo de 5
            if (producto.cantidad < 5) {
                fila.style.backgroundColor = '#f8d7da'; // Color de fondo para bajo stock
            }
            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio}</td>
                <td>${producto.categoria ? categoriasMap[producto.categoria] : 'Sin categoria'}</td>
                <td>
                    <button onclick="editarProducto(${producto.id})">Editar</button>
                    <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }


    mostrarCategorias() {
        const selectCategorias = document.getElementById('categoria');
        selectCategorias.innerHTML = ''; // Limpiar el select antes de agregar opciones

        this.categorias.forEach((categoria) => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            selectCategorias.appendChild(option);
        });
    }
}


export default Inventario;