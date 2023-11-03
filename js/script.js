const productos = document.querySelectorAll('.agregar');
const listaProductos = document.getElementById('lista-productos');
const total = document.getElementById('total');
const imagenProducto = document.querySelector('.imagen-producto');
let carrito = [];

productos.forEach(producto => {
    producto.addEventListener('click', agregarAlCarrito);
});

function agregarAlCarrito(event) {
    const boton = event.target;
    const nombre = boton.getAttribute('data-nombre');
    const precio = parseFloat(boton.getAttribute('data-precio'));
    const duracionSelect = boton.parentElement.querySelector('.duracion');
    const duracion = duracionSelect ? duracionSelect.options[duracionSelect.selectedIndex].value : '';

    // Obtener los atributos de precio por mes y precio por trimestre
    const precioPorMesAttr = boton.getAttribute('data-precio-mes');
    const precioPorTrimestreAttr = boton.getAttribute('data-precio-trimestre');
    const precioPorMesAttrEntreyDieta = boton.getAttribute('data-precio-mes-entreydieta');
    const precioPorTrimestreAttrEntreyDieta = boton.getAttribute('data-precio-trimestre-entreydieta');
    

    // Verificar si los atributos existen antes de convertirlos a números
    const precioPorMes = precioPorMesAttr ? parseFloat(precioPorMesAttr) : 6000;
    const precioPorTrimestre = precioPorTrimestreAttr ? parseFloat(precioPorTrimestreAttr) : 15000;
    const precioPorMesEntreyDieta = precioPorMesAttr ? parseFloat(precioPorMesAttrEntreyDieta) : 8000;
    const precioPorTrimestreEntreyDieta = precioPorTrimestreAttr ? parseFloat(precioPorTrimestreAttrEntreyDieta) : 20000;

    // Calcular el precio del producto según la duración
    const precioProducto = duracion === 'mes' ? precioPorMes : duracion === 'trimestre' ? precioPorTrimestre : precio;
    const precioProductoEntreyDieta = duracion === 'mes' ? precioPorMesEntreyDieta : duracion === 'trimestre' ? precioPorTrimestreEntreyDieta : precio;


    const tallaSelect = boton.parentElement.querySelector('.talla');
    const colorSelect = boton.parentElement.querySelector('.color');

    const talla = tallaSelect ? tallaSelect.options[tallaSelect.selectedIndex].value : 'Sin Talla';
    const color = colorSelect ? colorSelect.options[colorSelect.selectedIndex].value : 'Sin Color';

    const productoEnCarrito = carrito.find(item => item.nombre === nombre && item.talla === talla && item.color === color && item.duracion === duracion);
    

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else if (nombre == 'Plan Entrenamiento y Dieta'){
        carrito.push({ nombre, precio: precioProductoEntreyDieta, talla, color, cantidad: 1, duracion });
    } else{
        carrito.push({ nombre, precio: precioProducto, talla, color, cantidad: 1, duracion });
    }


    

    actualizarImagenProducto(boton);
    actualizarCarrito();
}

function actualizarImagenProducto(boton) {
    // Código para actualizar la imagen del producto según el color (como lo tenías antes)
}

function eliminarUnidadDelCarrito(nombre, talla, color, duracion) {
    const productoIndex = carrito.findIndex(item => item.nombre === nombre && item.talla === talla && item.color === color && item.duracion === duracion);

    if (productoIndex !== -1) {
        if (carrito[productoIndex].cantidad > 1) {
            carrito[productoIndex].cantidad--;
        } else {
            carrito.splice(productoIndex, 1);
        }
        actualizarCarrito();
    }
}


function actualizarImagenProducto(boton) {
    const imagenProducto = boton.parentElement.parentElement.querySelector('.imagen-producto');
    const colorSelect = boton.parentElement.querySelector('.color');

    if (colorSelect) {
        const color = colorSelect.options[colorSelect.selectedIndex].value;

        // Definir un objeto que mapea los colores a las rutas de las imágenes
        const imagenesPorColor = {
            negro: '../img/remeranegra.png',
            rosa: '../img/remerarosa.png',
            gris: '../img/remeragris.png',
            'verde-oscuro': '../img/remeraverde.png'
            // Agrega más colores y rutas de imágenes aquí
        };

        // Verificar si el color está en el objeto y actualizar la imagen
        if (color in imagenesPorColor) {
            imagenProducto.src = imagenesPorColor[color];
        }
    }
}

function eliminarUnidadDelCarrito(nombre, talla, color, duracion) {
    const productoIndex = carrito.findIndex(item => item.nombre === nombre && item.talla === talla && item.color === color && item.duracion === duracion);

    if (productoIndex !== -1) {
        if (carrito[productoIndex].cantidad > 1) {
            carrito[productoIndex].cantidad--; // Disminuir la cantidad en 1
        } else {
            carrito.splice(productoIndex, 1); // Eliminar el producto si la cantidad es 1
        }
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    listaProductos.innerHTML = '';
    let totalPrecio = 0;

    carrito.forEach(producto => {
        const item = document.createElement('li');
        const precioProducto = producto.precio * producto.cantidad;
        item.textContent = `${producto.nombre} - Talla: ${producto.talla} - Color: ${producto.color} - Duración: ${producto.duracion} - Cantidad: ${producto.cantidad} - $${precioProducto.toFixed(2)}`;

        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.addEventListener('click', () => eliminarUnidadDelCarrito(producto.nombre, producto.talla, producto.color, producto.duracion));

        item.appendChild(eliminarBtn);
        listaProductos.appendChild(item);
        totalPrecio += precioProducto;
    });

    total.textContent = totalPrecio.toFixed(2);
}

function enviarMensajeWhatsApp() {
    if (carrito.length === 0) {
        alert('Selecciona primero los productos que quieras comprar antes de comprar por WhatsApp.');
        return;
    }

    const numeroWhatsApp = '541124733221'; // Tu número de WhatsApp sin espacios ni caracteres especiales

    let mensajeWhatsApp = '¡Hola! Estoy interesado en comprar los siguientes productos:\n';

    carrito.forEach(producto => {
        mensajeWhatsApp += `\nNombre: ${producto.nombre}\nTalla: ${producto.talla}\nColor: ${producto.color}\nDuración: ${producto.duracion}\nCantidad: ${producto.cantidad}\nPrecio unitario: $${producto.precio.toFixed(2)}\n--------------------------`;
    });

    // Calcular el total de la compra
    const totalCompra = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    mensajeWhatsApp += `\nTotal de la compra: $${totalCompra.toFixed(2)}`;

    mensajeWhatsApp = encodeURIComponent(mensajeWhatsApp);

    let urlWhatsApp;

    // Verificar si el usuario está en un dispositivo móvil
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Si es un dispositivo móvil, construir el enlace de WhatsApp de manera diferente
        urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeWhatsApp}`;
    } else {
        // Para otros dispositivos, como escritorio, utiliza el formato tradicional
        urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`;
    }

    window.location.href = urlWhatsApp;
}

// Agrega un evento click al botón "Comprar por WhatsApp"
document.getElementById('comprar').addEventListener('click', function() {
    enviarMensajeWhatsApp(carrito); // Pasa el carrito como argumento
});

function filtrarProductos() {
    // Obtén el texto ingresado en el campo de búsqueda
    var filtro = document.getElementById("filtro").value.toLowerCase();

    // Obtén la lista de productos
    var productos = document.querySelectorAll(".producto");

    // Recorre la lista de productos y muestra u oculta según el filtro
    productos.forEach(function (producto) {
        var nombre = producto.querySelector("h2").textContent.toLowerCase();
        if (nombre.includes(filtro)) {
            producto.style.display = "block"; // Mostrar producto
        } else {
            producto.style.display = "none"; // Ocultar producto
        }
    });
}





document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector(".slider");
    const arrowLeft = document.querySelector(".slider-nav-left");
    const arrowRight = document.querySelector(".slider-nav-right");

    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.style.display = "block";
            } else {
                slide.style.display = "none";
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    arrowLeft.addEventListener("click", prevSlide);
    arrowRight.addEventListener("click", nextSlide);
    

    // Iniciar el slider mostrando la primera diapositiva
    showSlide(currentIndex);
});


const slider = document.querySelector(".slider");
const sliderInner = document.querySelector(".slider-inner");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev-slide");
const nextBtn = document.querySelector(".next-slide");

let currentIndex = 0;

function goToSlide(index) {
    currentIndex = index;
    const translateX = -currentIndex * 100 + "%";
    sliderInner.style.transform = `translateX(${translateX})`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(currentIndex);
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Cambio automático de slide cada 4 segundos
setInterval(nextSlide, 4000);
