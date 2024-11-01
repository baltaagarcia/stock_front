

const categoriasMap = {
    0: 'Sin Categoria',
    1: 'Electrónica',
    2: 'Ropa',
    3: 'Alimentos'

}



// Clase Producto
class Producto {
    constructor(id, nombre, cantidad, precio, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.precio = precio;
        this.categoria = categoria;
    }
}

//Clase Categoria
class Categoria {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
    }
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




// Inicializar el inventario
const inventario = new Inventario();

//Agregar algunas categorias por defecto
inventario.agregarCategoria('-')
inventario.agregarCategoria('Electronica')
inventario.agregarCategoria('Alimentos')
inventario.agregarCategoria('Ropa')

// Agregar evento al formulario para añadir productos
document.getElementById('producto-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;
    const categoriaId = document.getElementById('categoria').value;
    const mensajeError = document.getElementById('mensaje-error');

    // Validación de cantidad y precio
    if (cantidad < 0) {
        mensajeError.textContent = 'La cantidad no puede ser negativa.';
        mensajeError.style.display = 'block';
        return;
    } else if (precio < 0) {
        mensajeError.textContent = 'El precio no puede ser negativo.';
        mensajeError.style.display = 'block';
        return;
    } else {
        mensajeError.style.display = 'none'; // Ocultar el mensaje de error si todo está bien
    }

    // Si la validación pasa, agregar el producto
    inventario.agregarProducto(nombre, cantidad, precio, categoriaId);

    // Limpiar campos del formulario
    this.reset();
});

// Función para eliminar un producto (se llama desde el botón)
function eliminarProducto(id) {
    inventario.eliminarProducto(id);
}

// Función para editar un producto (se llama desde el botón)
function editarProducto(id) {
    const producto = inventario.productos.find(p => p.id === id);
    if (producto) {
        // Llenar el formulario con los datos del producto para editar
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('cantidad').value = producto.cantidad;
        document.getElementById('precio').value = producto.precio;

        // Cambiar el texto del botón de "Agregar Producto" a "Guardar Cambios"
        const boton = document.querySelector('button[type="submit"]');
        boton.textContent = 'Guardar Cambios';

        // Cambiar el evento de envío para que guarde los cambios en lugar de agregar un nuevo producto
        document.getElementById('producto-form').onsubmit = function (e) {
            e.preventDefault();
            const nuevoNombre = document.getElementById('nombre').value;
            const nuevaCantidad = document.getElementById('cantidad').value;
            const nuevoPrecio = document.getElementById('precio').value;

            // Validación de cantidad y precio
            if (nuevaCantidad < 0) {
                mensajeError.textContent = 'La cantidad no puede ser negativa.';
                mensajeError.style.display = 'block';
                return;
            } else if (nuevoPrecio < 0) {
                mensajeError.textContent = 'El precio no puede ser negativo.';
                mensajeError.style.display = 'block';
                return;
            } else {
                mensajeError.style.display = 'none';
            }

            inventario.editarProducto(id, nuevoNombre, nuevaCantidad, nuevoPrecio);

            // Restaurar el formulario a su estado original
            this.reset();
            boton.textContent = 'Agregar Producto';
            this.onsubmit = function (e) {
                e.preventDefault();
                const nombre = document.getElementById('nombre').value;
                const cantidad = document.getElementById('cantidad').value;
                const precio = document.getElementById('precio').value;

                // Validación de cantidad y precio
                if (cantidad < 0) {
                    mensajeError.textContent = 'La cantidad no puede ser negativa.';
                    mensajeError.style.display = 'block';
                    return;
                } else if (precio < 0) {
                    mensajeError.textContent = 'El precio no puede ser negativo.';
                    mensajeError.style.display = 'block';
                    return;
                } else {
                    mensajeError.style.display = 'none';
                }

                inventario.agregarProducto(nombre, cantidad, precio);
                this.reset();
            };
        };
    }
}
function filtrarProductos() {
    const query = document.getElementById('buscar').value.toLowerCase();
    console.log('Buscando:', query);
    const tabla = document.getElementById('tabla-productos');
    const filas = tabla.getElementsByTagName('tr');

    for (let i = 1; i < filas.length; i++) { // Comenzar en 1 para omitir el encabezado
        const celdas = filas[i].getElementsByTagName('td');
        let encontrado = false;

        for (let j = 0; j < celdas.length; j++) {
            if (celdas[j].textContent.toLowerCase().includes(query)) {
                encontrado = true;
                break;
            }
        }

        filas[i].style.display = encontrado ? '' : 'none'; // Mostrar u ocultar la fila
    }
}


// Función para exportar a CSV
function exportarCSV() {
    const productos = inventario.productos;
    if (productos.length === 0) {
        alert('No hay productos para exportar.');
        return;
    }
    let csvContent = "data:text/csv;charset=utf-8,"
        + "ID,Nombre,Cantidad,Precio,Categoria\n"
        + productos.map(p => `${p.id},${p.nombre},${p.cantidad},${p.precio},${p.categoria}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventario.csv");
    document.body.appendChild(link); // Necesario para Firefox
    link.click();
    document.body.removeChild(link); // Limpia después de la descarga
}

// Agregar un botón para exportar
const botonExportar = document.createElement('button');
botonExportar.textContent = 'Exportar Inventario';
botonExportar.onclick = exportarCSV;
document.body.appendChild(botonExportar);


// Función para importar CSV
function importarCSV(event) {
    const archivo = event.target.files[0];
    if (!archivo) {
        alert('No se ha seleccionado ningún archivo.');
        return;
    }

    const lector = new FileReader();

    lector.onload = function (e) {
        const contenido = e.target.result;
        const lineas = contenido.split('\n');

        // Omitir la primera línea (encabezados)
        for (let i = 1; i < lineas.length; i++) {
            const datos = lineas[i].split(',');
            if (datos.length === 5) {
                const id = parseInt(datos[0]);
                const nombre = datos[1].trim();
                const cantidad = parseInt(datos[2]);
                const precio = parseFloat(datos[3]);
                const categoria = parseInt(datos[4]);

                // Verificamos que los datos sean válidos antes de agregar
                if (!isNaN(id) && !isNaN(cantidad) && !isNaN(precio) && cantidad >= 0 && precio >= 0) {
                    inventario.agregarProducto(nombre, cantidad, precio);
                } else {
                    console.warn(`Datos inválidos en la línea ${i + 1}: ${lineas[i]}`);
                }
            }
        }
    };

    lector.readAsText(archivo);
}
