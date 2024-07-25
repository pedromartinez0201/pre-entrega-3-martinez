// peliculas desde json
fetch('peliculas.json')
    .then(response => response.json())
    .then(data => {
        peliculas = data;
        mostrarPeliculas();
    })
    .catch(error => {
        console.error('Error al cargar las películas:', error);
        document.getElementById('peliculas-container').innerHTML = '<p>Error al cargar las películas. Por favor, inténtalo de nuevo más tarde.</p>';
    });

// Inicializar carrito desde localStorage (o vacío si no existe)
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// mostrar y carrito
function mostrarPeliculas() {
    const peliculasContainer = document.getElementById("peliculas-container");
    peliculasContainer.innerHTML = ""; 

    const peliculasList = document.createElement("ul"); // Crear lista desordenada
    peliculas.forEach(pelicula => {
        const peliculaItem = document.createElement("li");
        peliculaItem.innerHTML = `
            <h3>${pelicula.titulo}</h3>
            <p>Precio: $${pelicula.precio}</p>
            <input type="number" class="cantidad-input" value="1" min="1">
            <button class="agregar-btn" data-id="${pelicula.id}">Agregar al carrito</button>
        `;
        peliculasList.appendChild(peliculaItem);
    });
    peliculasContainer.appendChild(peliculasList); // Agregar la lista al contenedor
}

function mostrarCarrito() {
    const carritoContainer = document.getElementById("carrito-container");
    carritoContainer.innerHTML = ""; // Limpiar el contenedor

    const carritoList = document.createElement("ul"); // Crear lista desordenada
    let precioTotal = 0;
    carrito.forEach(item => {
        const pelicula = peliculas.find(p => p.id === item.id);
        if (pelicula) {
            const peliculaItem = document.createElement("li");
            peliculaItem.innerHTML = `
                <h3>${pelicula.titulo} x ${item.cantidad}</h3>
                <p>Precio unitario: $${pelicula.precio}</p>
                <p>Subtotal: $${(pelicula.precio * item.cantidad)}</p>
                <button class="eliminar-btn" data-id="${pelicula.id}">Eliminar</button>
            `;
            carritoList.appendChild(peliculaItem);
            precioTotal += pelicula.precio * item.cantidad;
        }
    });

    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `<h3>Precio total: $${precioTotal}</h3>`;
    carritoList.appendChild(totalDiv); // Agregar el total a la lista

    carritoContainer.appendChild(carritoList); // Agregar la lista al contenedor
}

//botones de agregar y eliminar 
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("agregar-btn")) {
        const peliculaId = parseInt(event.target.dataset.id);
        const cantidadInput = event.target.previousElementSibling;
        const cantidad = parseInt(cantidadInput.value);
        agregarAlCarrito(peliculaId, cantidad);
    } else if (event.target.classList.contains("eliminar-btn")) {
        const peliculaId = parseInt(event.target.dataset.id);
        eliminarDelCarrito(peliculaId);
    }
});

//agregar y elmimnar
function agregarAlCarrito(peliculaId, cantidad) {
    const itemExistente = carrito.find(item => item.id === peliculaId);
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({ id: peliculaId, cantidad });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    actualizarBotonComprar();
}

function eliminarDelCarrito(peliculaId) {
    carrito = carrito.filter(item => item.id !== peliculaId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    actualizarBotonComprar();
}


document.getElementById("comprar-btn").addEventListener("click", function() {
    // Lógica para procesar la compra (puedes mostrar un resumen, enviar datos a un servidor, etc.)
    alert(`¡Compra realizada! Total a pagar: $${calcularTotalCarrito()}`);

    // Vaciar el carrito después de la compra
    carrito = [];
    localStorage.removeItem('carrito');
    mostrarCarrito();
    actualizarBotonComprar();
});

// como ayuda para realizarlo
function calcularTotalCarrito() {
    return carrito.reduce((total, item) => {
        const pelicula = peliculas.find(p => p.id === item.id);
        return total + (pelicula ? pelicula.precio * item.cantidad : 0);
    }, 0);
}

function actualizarBotonComprar() {
    const comprarBtn = document.getElementById("comprar-btn");
    comprarBtn.disabled = carrito.length === 0;
}

// Mostrar películas y carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarPeliculas();
    mostrarCarrito();
    actualizarBotonComprar();
});
