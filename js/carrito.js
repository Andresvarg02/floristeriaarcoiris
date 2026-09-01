document.addEventListener("DOMContentLoaded", () => {
    let carrito = [];
    const numeroWhatsApp = "573004022461";

    // Elementos del DOM
    const modalCarrito = document.getElementById("modalCarrito");
    const listaCarrito = document.getElementById("listaProductosCarrito");
    const totalCarritoElem = document.getElementById("totalPrecioCarrito");
    const contadorElem = document.getElementById("cartBadge"); 
    const btnAbrirCarrito = document.getElementById("navCartBtn"); 
    const btnCerrar = document.getElementById("cerrarCarrito");
    const btnEnviarWA = document.getElementById("btnEnviarWhatsApp");
    const notaPedido = document.getElementById("notaPedido");

    // === 1. AGREGAR PRODUCTO DESDE EL BOTÓN MAS ===
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-añadir");
        if (btn) {
            const tarjeta = btn.closest(".tarjeta-producto");
            const nombre = tarjeta.querySelector("h4").innerText;
            const precioTexto = tarjeta.querySelector(".precio").innerText;
            
            // Extraer solo los números del texto de precio
            const precio = parseInt(precioTexto.replace(/[^0-9]/g, "")) || 0;

            agregarAlCarrito(nombre, precio, precioTexto);
        }
    });

    function agregarAlCarrito(nombre, precio, precioTexto) {
        carrito.push({ nombre, precio, precioTexto });
        actualizarCarritoUI();
        modalCarrito.style.display = "flex";
    }

    // === 2. ACTUALIZAR INTERFAZ Y CONTADORES ===
    function actualizarCarritoUI() {
        listaCarrito.innerHTML = "";
        let total = 0;

        if (carrito.length === 0) {
            listaCarrito.innerHTML = "<p style='text-align:center; color:#888; margin:20px 0;'>El carrito está vacío.</p>";
        } else {
            carrito.forEach((prod, index) => {
                total += prod.precio;
                listaCarrito.innerHTML += `
                    <div class="item-carrito">
                        <div class="info-item">
                            <h5>${prod.nombre}</h5>
                            <span>${prod.precioTexto}</span>
                        </div>
                        <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
            });
        }

        // Actualizar el valor total y el contador superior del header
        totalCarritoElem.innerText = "$" + total.toLocaleString("es-CO");
        if (contadorElem) {
            contadorElem.innerText = carrito.length;
        }
    }

    // === 3. ELIMINAR ARTÍCULO DEL CARRITO ===
    window.eliminarDelCarrito = function(index) {
        carrito.splice(index, 1);
        actualizarCarritoUI();
    };

    // === 4. CONTROL DEL MODAL (ABRIR/CERRAR) ===
    if (btnAbrirCarrito) {
        btnAbrirCarrito.addEventListener("click", (e) => {
            e.preventDefault();
            modalCarrito.style.display = "flex";
        });
    }

    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            modalCarrito.style.display = "none";
        });
    }

    // Cerrar el modal al hacer clic en el fondo oscuro exterior
    window.addEventListener("click", (e) => {
        if (e.target === modalCarrito) {
            modalCarrito.style.display = "none";
        }
    });

    // === 5. ENVIAR PEDIDO A WHATSAPP ===
    if (btnEnviarWA) {
        btnEnviarWA.addEventListener("click", () => {
            if (carrito.length === 0) {
                alert("Por favor selecciona al menos un arreglo para realizar el pedido.");
                return;
            }

            let mensaje = "¡Hola! Quisiera realizar el siguiente pedido en *Floristería Arcoíris*:\n\n";
            
            carrito.forEach((item) => {
                mensaje += `• *${item.nombre}* - ${item.precioTexto}\n`;
            });

            const totalFormateado = totalCarritoElem.innerText;
            mensaje += `\n*Total estimado:* ${totalFormateado}\n`;

            const comentario = notaPedido.value.trim();
            if (comentario !== "") {
                mensaje += `\n*Nota/Comentario opcional:* ${comentario}\n`;
            }

            mensaje += "\nQuedo atento(a) para confirmar la disponibilidad y acordar los detalles de entrega.";

            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
            window.open(urlWhatsApp, "_blank");
        });
    }
});