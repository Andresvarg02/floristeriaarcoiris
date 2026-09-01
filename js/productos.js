document.addEventListener("DOMContentLoaded", () => {
    const filtros = document.querySelectorAll(".filtro-item");
    // Cambiamos el selector a [data-cat] para incluir tarjetas y el banner informativo
    const productos = document.querySelectorAll("[data-cat]");
    const selectFooter = document.getElementById("categoriasSelect");
    const btnSelector = document.getElementById("btnSelectorFooter");

    // === FUNCIÓN PRINCIPAL DE FILTRADO ===
    function filtrarCategoria(categoriaTarget) {
        if (!categoriaTarget) return;

        // 1. Activar botón visual de la barra lateral (si existe en esta página)
        filtros.forEach(filtro => {
            if (filtro.getAttribute("data-categoria") === categoriaTarget) {
                filtro.classList.add("activo");
            } else {
                filtro.classList.remove("activo");
            }
        });

        // 2. Mostrar/Ocultar productos y elementos del catálogo (banners, avisos)
        productos.forEach(producto => {
            const catProducto = producto.getAttribute("data-cat");
            if (categoriaTarget === "todos" || catProducto === categoriaTarget) {
                // El banner requiere display: block, las tarjetas usan display: flex
                if (producto.classList.contains("banner-informativo-funebres")) {
                    producto.style.display = "block";
                } else {
                    producto.style.display = "flex";
                }
            } else {
                producto.style.display = "none";
            }
        });
    }

    // === EVENTO 1: Clics en la Barra Lateral del Catálogo ===
    if (filtros.length > 0) {
        filtros.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const cat = btn.getAttribute("data-categoria");
                filtrarCategoria(cat);
            });
        });
    }

    // === FUNCIÓN DE REDIRECCIÓN Y NAVEGACIÓN ===
    function procesarNavegacionFooter() {
        if (!selectFooter) return;
        const destino = selectFooter.value;

        if (destino) {
            // Si ya estamos en la página del catálogo, se filtra dinámicamente
            if (window.location.pathname.includes("catalogo.html")) {
                filtrarCategoria(destino);
            } else {
                // Verificar si la página actual se encuentra dentro de /pages/
                const estaEnPages = window.location.pathname.includes("/pages/");
                
                const rutaDestino = estaEnPages
                    ? `catalogo.html?cat=${destino}`
                    : `pages/catalogo.html?cat=${destino}`;

                window.location.href = rutaDestino;
            }
        }
    }

    // === EVENTO 2: Clic en el botón rosa de flecha en el Footer ===
    if (btnSelector) {
        btnSelector.addEventListener("click", (e) => {
            e.preventDefault();
            procesarNavegacionFooter();
        });
    }

    // === EVENTO 2.1: Redirección inmediata al cambiar el Select ===
    if (selectFooter) {
        selectFooter.addEventListener("change", () => {
            procesarNavegacionFooter();
        });
    }

    // === EVENTO 3: Lectura de parámetros de la URL (?cat=...) al cargar la página ===
    const parametros = new URLSearchParams(window.location.search);
    const catUrl = parametros.get("cat");
    
    if (catUrl) {
        filtrarCategoria(catUrl);
    } else if (window.location.pathname.includes("catalogo.html")) {
        filtrarCategoria("todos");
    }
});