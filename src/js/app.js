// Adapted module from original Js/app.js
// Exports initApp() which sets up listeners for the existing DOM structure.

const REGISTRATION_FORM_ID = "registroForm";
const LOGIN_FORM_ID = "loginForm";
const CONTACT_FORM_ID = "contactForm";

const REGISTER_NAME_ID = "nombre";
const REGISTER_EMAIL_ID = "email";
const REGISTER_PASSWORD_ID = "password";
const REGISTER_CONFIRM_PASSWORD_ID = "confirmPassword";
const REGISTER_MESSAGE_ID = "mensaje";

const LOGIN_EMAIL_ID = "loginEmail";
const LOGIN_PASSWORD_ID = "loginPassword";
const LOGIN_MESSAGE_ID = "loginMessage";

const CONTACT_NAME_ID = "contactName";
const CONTACT_EMAIL_ID = "contactEmail";
const CONTACT_MESSAGE_INPUT_ID = "contactMessageInput";
const CONTACT_MESSAGE_ID = "contactMessage";

const WELCOME_MESSAGE_ID = "welcomeMessage";
const STORAGE_USER_KEY = "gympro_usuario";
const FIELD_ERROR_CLASS = "field-error-message";

const usuariosRegistrados = [];
const mensajesContacto = [];
const carrito = [];
const CART_MESSAGE_ID = "cartMessage";

function validarDatos(campos) {
    for (const campo of campos) {
        const elemento = document.getElementById(campo.id);
        if (!elemento) {
            return { mensaje: `Error interno: campo ${campo.nombre} no encontrado.`, elemento: null, nombre: campo.nombre };
        }
        elemento.classList.remove("input-error", "success");
        elemento.setAttribute("aria-invalid", "false");
        const errorElemento = elemento.parentElement.querySelector(`.${FIELD_ERROR_CLASS}`);
        if (errorElemento) {
            errorElemento.remove();
        }

        const valor = elemento.value.trim();
        if (valor === "") {
            mostrarErrorCampo(elemento, `El campo ${campo.nombre} es obligatorio.`);
            return { mensaje: `Revisa el campo ${campo.nombre}: está vacío.`, elemento, nombre: campo.nombre };
        }

        if (campo.maxLength && valor.length > campo.maxLength) {
            mostrarErrorCampo(elemento, `El campo ${campo.nombre} no debe exceder ${campo.maxLength} caracteres.`);
            return { mensaje: `Revisa el campo ${campo.nombre}: tiene más de ${campo.maxLength} caracteres.`, elemento, nombre: campo.nombre };
        }

        if (campo.validar && !campo.validar(valor)) {
            mostrarErrorCampo(elemento, campo.mensajeError);
            return { mensaje: `Revisa el campo ${campo.nombre}: ${campo.mensajeError}`, elemento, nombre: campo.nombre };
        }
    }

    return null;
}

function mostrarErrorCampo(elemento, mensaje) {
    if (!elemento) return;
    elemento.classList.add("input-error");
    elemento.setAttribute("aria-invalid", "true");

    let errorElemento = elemento.parentElement.querySelector(`.${FIELD_ERROR_CLASS}`);
    if (!errorElemento) {
        errorElemento = document.createElement("p");
        errorElemento.className = `${FIELD_ERROR_CLASS} error`;
        elemento.parentElement.appendChild(errorElemento);
    }
    errorElemento.textContent = mensaje;
}

function limpiarErrores(campos, mensajeId = null) {
    campos.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        if (elemento) {
            elemento.classList.remove("input-error");
            elemento.classList.remove("success");
            elemento.setAttribute("aria-invalid", "false");
            const errorElemento = elemento.parentElement.querySelector(`.${FIELD_ERROR_CLASS}`);
            if (errorElemento) {
                errorElemento.remove();
            }
        }
    });
    if (mensajeId) {
        const mensajeElemento = document.getElementById(mensajeId);
        if (mensajeElemento) {
            mensajeElemento.textContent = "";
            mensajeElemento.classList.remove("error", "success");
        }
    }
}

function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email) && email.length <= 254;
}

function validarNombre(nombre) {
    const regex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    return regex.test(nombre) && nombre.length >= 2 && nombre.length <= 80;
}

function validarPassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password) && password.length <= 128;
}

function esUrlImagenValida(url) {
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== 'https:') {
            return false;
        }
        const extensionesValidas = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        return extensionesValidas.some(ext => parsedUrl.pathname.toLowerCase().endsWith(ext));
    } catch {
        return false;
    }
}

function mostrarMensaje(id, texto, esError = false) {
    const elemento = document.getElementById(id);
    if (!elemento) return;

    elemento.textContent = texto;
    elemento.classList.toggle("error", esError);
    elemento.classList.toggle("success", !esError);
}

function actualizarDOM(id, texto, esError = false) {
    mostrarMensaje(id, texto, esError);
}

function crearUsuario(nombre, email, password) {
    return { nombre, email, password };
}

function obtenerParametroConsulta(nombre) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(nombre);
}

function guardarUsuarioEnLocalStorage(usuario) {
    try {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(usuario));
    } catch (error) {
        console.warn("No se pudo guardar el usuario en localStorage:", error);
    }
}

function obtenerUsuarioGuardado() {
    try {
        const usuarioJSON = localStorage.getItem(STORAGE_USER_KEY);
        return usuarioJSON ? JSON.parse(usuarioJSON) : null;
    } catch (error) {
        console.warn("No se pudo leer el usuario desde localStorage:", error);
        return null;
    }
}

function mostrarBienvenidaUsuario(nombre) {
    const mensajeBienvenida = document.getElementById(WELCOME_MESSAGE_ID);
    if (!mensajeBienvenida) return;

    mensajeBienvenida.textContent = `Bienvenido${nombre ? ", " + nombre : ""}! Gracias por registrarte.`;
    mensajeBienvenida.classList.add("success");
}

function inicializarBienvenida() {
    const nombreDesdeQuery = obtenerParametroConsulta("welcome");
    const usuarioGuardado = obtenerUsuarioGuardado();

    if (nombreDesdeQuery) {
        mostrarBienvenidaUsuario(decodeURIComponent(nombreDesdeQuery));
    } else if (usuarioGuardado && usuarioGuardado.nombre) {
        mostrarBienvenidaUsuario(usuarioGuardado.nombre);
    }
}

function manejarEnvioRegistro(event) {
    event.preventDefault();

    const campos = [
        { id: REGISTER_NAME_ID, nombre: "Nombre", validar: validarNombre, mensajeError: "El nombre debe tener entre 2 y 80 caracteres y solo letras, espacios o apóstrofes.", maxLength: 80 },
        { id: REGISTER_EMAIL_ID, nombre: "Email", validar: validarEmail, mensajeError: "Ingresa un email válido (ej. usuario@dominio.com).", maxLength: 254 },
        { id: REGISTER_PASSWORD_ID, nombre: "Contraseña", validar: validarPassword, mensajeError: "La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo especial.", maxLength: 128 },
        { id: REGISTER_CONFIRM_PASSWORD_ID, nombre: "Confirmar contraseña", validar: validarPassword, mensajeError: "La confirmación debe cumplir los requisitos de contraseña.", maxLength: 128 }
    ];

    limpiarErrores(campos, REGISTER_MESSAGE_ID);
    const error = validarDatos(campos);
    if (error) {
        actualizarDOM(REGISTER_MESSAGE_ID, error.mensaje, true);
        if (error.elemento) {
            error.elemento.focus();
        }
        return;
    }

    const passwordValue = document.getElementById(REGISTER_PASSWORD_ID).value.trim();
    const confirmPasswordValue = document.getElementById(REGISTER_CONFIRM_PASSWORD_ID).value.trim();
    if (passwordValue !== confirmPasswordValue) {
        const confirmElement = document.getElementById(REGISTER_CONFIRM_PASSWORD_ID);
        mostrarErrorCampo(confirmElement, "Las contraseñas no coinciden.");
        actualizarDOM(REGISTER_MESSAGE_ID, "Revisa el campo Confirmar contraseña: las contraseñas no coinciden.", true);
        confirmElement.focus();
        return;
    }

    const usuario = crearUsuario(
        document.getElementById(REGISTER_NAME_ID).value.trim(),
        document.getElementById(REGISTER_EMAIL_ID).value.trim(),
        passwordValue
    );

    registrarUsuario(usuario);
    event.target.reset();
}

function registrarUsuario(usuario) {
    usuariosRegistrados.push(usuario);
    guardarUsuarioEnLocalStorage(usuario);
    console.table(usuariosRegistrados);
    actualizarDOM(REGISTER_MESSAGE_ID, `Registro exitoso. Redirigiendo a la tienda...`, false);

    setTimeout(() => {
        window.history.replaceState(null, '', '/?welcome=' + encodeURIComponent(usuario.nombre));
        inicializarBienvenida();
    }, 800);
}

function manejarEnvioLogin(event) {
    event.preventDefault();

    const campos = [
        { id: LOGIN_EMAIL_ID, nombre: "Email", validar: validarEmail, mensajeError: "Ingresa un email válido.", maxLength: 254 },
        { id: LOGIN_PASSWORD_ID, nombre: "Contraseña", validar: validarPassword, mensajeError: "La contraseña debe ser segura y tener al menos 8 caracteres.", maxLength: 128 }
    ];

    limpiarErrores(campos, LOGIN_MESSAGE_ID);
    const error = validarDatos(campos);
    if (error) {
        actualizarDOM(LOGIN_MESSAGE_ID, error.mensaje, true);
        if (error.elemento) error.elemento.focus();
        return;
    }

    const emailValue = document.getElementById(LOGIN_EMAIL_ID).value.trim();
    const passwordValue = document.getElementById(LOGIN_PASSWORD_ID).value.trim();

    if (usuariosRegistrados.length === 0) {
        actualizarDOM(LOGIN_MESSAGE_ID, "No hay usuarios registrados aún. Regístrate primero.", true);
        return;
    }

    iniciarSesion(emailValue, passwordValue);
    event.target.reset();
}

function iniciarSesion(email, password) {
    let usuarioExistente = usuariosRegistrados.find(usuario => usuario.email === email && usuario.password === password);
    if (!usuarioExistente) {
        const usuarioGuardado = obtenerUsuarioGuardado();
        if (usuarioGuardado && usuarioGuardado.email === email && usuarioGuardado.password === password) {
            usuarioExistente = usuarioGuardado;
            usuariosRegistrados.push(usuarioGuardado);
        }
    }

    if (!usuarioExistente) {
        actualizarDOM(LOGIN_MESSAGE_ID, "Usuario o contraseña incorrectos.", true);
        return;
    }

    actualizarDOM(LOGIN_MESSAGE_ID, `Bienvenido de nuevo, ${usuarioExistente.nombre}.`, false);
}

function manejarEnvioContacto(event) {
    event.preventDefault();

    const campos = [
        { id: CONTACT_NAME_ID, nombre: "Nombre", validar: validarNombre, mensajeError: "El nombre debe ser válido.", maxLength: 80 },
        { id: CONTACT_EMAIL_ID, nombre: "Email", validar: validarEmail, mensajeError: "Ingresa un email válido.", maxLength: 254 },
        { id: CONTACT_MESSAGE_INPUT_ID, nombre: "Mensaje", validar: valor => valor.length >= 10, mensajeError: "El mensaje debe tener al menos 10 caracteres.", maxLength: 500 }
    ];

    limpiarErrores(campos, CONTACT_MESSAGE_ID);
    const error = validarDatos(campos);
    if (error) {
        actualizarDOM(CONTACT_MESSAGE_ID, error.mensaje, true);
        if (error.elemento) error.elemento.focus();
        return;
    }

    const mensaje = {
        nombre: document.getElementById(CONTACT_NAME_ID).value.trim(),
        email: document.getElementById(CONTACT_EMAIL_ID).value.trim(),
        mensaje: document.getElementById(CONTACT_MESSAGE_INPUT_ID).value.trim()
    };

    mensajesContacto.push(mensaje);
    console.table(mensajesContacto);
    actualizarDOM(CONTACT_MESSAGE_ID, "Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.", false);
    event.target.reset();
}

function agregarCarrito(producto) {
    // Persist carrito en localStorage para que React pueda leerlo desde otros componentes
    const current = obtenerCarritoLocal();
    // Normalizar datos
    producto.precio = Number(producto.precio) || 0;
    producto.cantidad = Math.max(1, Number(producto.cantidad) || 1);
    const normalize = (s) => {
        if (!s) return '';
        return s.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    };
    // Buscar si ya existe el producto por nombre normalizado y sumar cantidades en vez de duplicar
    const key = normalize(producto.nombre);
    const existenteIndex = current.findIndex(p => normalize(p.nombre) === key);
    if (existenteIndex !== -1) {
        // Reemplazar la cantidad por la cantidad seleccionada (no acumular)
        current[existenteIndex].cantidad = producto.cantidad;
        // actualizar precio/imagen si es necesario
        current[existenteIndex].precio = producto.precio || current[existenteIndex].precio;
        if (producto.imagen) current[existenteIndex].imagen = producto.imagen;
    } else {
        current.push(producto);
    }
    guardarCarritoLocal(current);
    console.table(current);
    actualizarDOM(CART_MESSAGE_ID, `Producto "${producto.nombre}" agregado al carrito.`, false);
}

function mostrarMensajeDeFondo(texto) {
    const mensajeElemento = document.getElementById(REGISTER_MESSAGE_ID);
    if (mensajeElemento) {
        mensajeElemento.textContent = texto;
    }
}

function setBackgroundImage() {
    const imageInput = document.getElementById('backgroundImage');
    if (!imageInput) return;

    const imageUrl = imageInput.value.trim();
    if (imageUrl) {
        if (!esUrlImagenValida(imageUrl)) {
            mostrarMensajeDeFondo("Por favor, ingresa una URL válida de imagen con HTTPS y extensión .jpg, .png, etc.");
            return;
        }
        document.body.style.backgroundImage = `url(${imageUrl})`;
        document.body.style.backgroundSize = "auto";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        mostrarMensajeDeFondo("Imagen de fondo establecida correctamente.");
    } else {
        document.body.style.backgroundImage = "none";
        mostrarMensajeDeFondo("Imagen de fondo removida.");
    }
}

let carouselItems = [];
let carouselIndicators = [];
let indiceActual = 0;
let intervaloCarrusel = null;

function cambiarImagen() {
    if (!carouselItems.length) return;
    
    carouselItems.forEach((item, index) => {
        item.classList.toggle("active", index === indiceActual);
    });
    
    carouselIndicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === indiceActual);
        if (index === indiceActual) {
            indicator.setAttribute("aria-current", "true");
        } else {
            indicator.removeAttribute("aria-current");
        }
    });
}

function cambiarSlide(delta) {
    if (!carouselItems.length) return;
    indiceActual = (indiceActual + delta + carouselItems.length) % carouselItems.length;
    cambiarImagen();
}

function iniciarCarruselAutomatico() {
    if (intervaloCarrusel) {
        clearInterval(intervaloCarrusel);
    }
    intervaloCarrusel = setInterval(() => {
        cambiarSlide(1);
    }, 5000);
}

function detenerCarruselAutomatico() {
    if (intervaloCarrusel) {
        clearInterval(intervaloCarrusel);
        intervaloCarrusel = null;
    }
}

function manejarCambioCarrusel(delta) {
    cambiarSlide(delta);
    detenerCarruselAutomatico();
    iniciarCarruselAutomatico();
}

function cambiarPestana(nombrePestana) {
    const secciones = document.querySelectorAll(".form-section");
    const botones = document.querySelectorAll(".tab-button");
    
    secciones.forEach(seccion => seccion.classList.remove("active"));
    botones.forEach(boton => boton.classList.remove("active"));
    
    if (nombrePestana === "registro") {
        const rs = document.getElementById("registro-section");
        const tR = document.getElementById("tabRegistro");
        if (rs) rs.classList.add("active");
        if (tR) tR.classList.add("active");
    } else if (nombrePestana === "login") {
        const ls = document.getElementById("login-section");
        const tL = document.getElementById("tabLogin");
        if (ls) ls.classList.add("active");
        if (tL) tL.classList.add("active");
    }
}

export function initApp() {
    const tabRegistro = document.getElementById("tabRegistro");
    const tabLogin = document.getElementById("tabLogin");
    if (tabRegistro) {
        tabRegistro.addEventListener("click", () => cambiarPestana("registro"));
    }
    if (tabLogin) {
        tabLogin.addEventListener("click", () => cambiarPestana("login"));
    }

    carouselItems = Array.from(document.querySelectorAll("#carouselExampleCaptions .carousel-item"));
    carouselIndicators = Array.from(document.querySelectorAll("#carouselExampleCaptions .carousel-indicators button"));
    carouselIndicators.forEach((button, index) => {
        button.addEventListener("click", () => {
            indiceActual = index;
            cambiarImagen();
            detenerCarruselAutomatico();
            iniciarCarruselAutomatico();
        });
    });

    const registroForm = document.getElementById(REGISTRATION_FORM_ID);
    if (registroForm) {
        registroForm.addEventListener("submit", manejarEnvioRegistro);
    }

    const usuarioGuardado = obtenerUsuarioGuardado();
    if (usuarioGuardado) {
        usuariosRegistrados.push(usuarioGuardado);
    }

    const loginForm = document.getElementById(LOGIN_FORM_ID);
    if (loginForm) {
        loginForm.addEventListener("submit", manejarEnvioLogin);
    }

    const contactForm = document.getElementById(CONTACT_FORM_ID);
    if (contactForm) {
        contactForm.addEventListener("submit", manejarEnvioContacto);
    }

    inicializarBienvenida();

    const setBackgroundButton = document.getElementById('setBackground');
    if (setBackgroundButton) {
        setBackgroundButton.addEventListener("click", setBackgroundImage);
    }

    const botonAnterior = document.getElementById("anterior");
    if (botonAnterior) {
        botonAnterior.addEventListener("click", () => manejarCambioCarrusel(-1));
    }

    const botonSiguiente = document.getElementById("siguiente");
    if (botonSiguiente) {
        botonSiguiente.addEventListener("click", () => manejarCambioCarrusel(1));
    }

    const productButtons = document.querySelectorAll(".producto button[data-product]");
    productButtons.forEach(button => {
        button.addEventListener("click", () => {
            const nombre = button.dataset.product || button.textContent.trim();
            const precio = button.dataset.price ? Number(button.dataset.price) : 0;
            // buscar input de cantidad dentro del mismo artículo (.producto)
            let cantidad = 1;
            const productoElem = button.closest('.producto');
            if (productoElem) {
                const inputQty = productoElem.querySelector('.cantidad-input');
                if (inputQty) {
                    const val = Number(inputQty.value);
                    if (!Number.isNaN(val) && val > 0) cantidad = Math.max(1, Math.floor(val));
                }
            }
            // obtener imagen desde la ficha del producto si existe
            const imgElem = productoElem ? productoElem.querySelector('img') : null;
            const imagen = imgElem ? (imgElem.src || imgElem.getAttribute('src')) : null;
            const producto = { nombre, precio, cantidad, imagen };
            agregarCarrito(producto);
        });
    });

    cambiarImagen();
    iniciarCarruselAutomatico();
}

// LocalStorage helpers and cart API for React components
function obtenerCarritoLocal() {
    try {
        const raw = localStorage.getItem('gympro_cart');
        const parsed = raw ? JSON.parse(raw) : [];
        // Dedupe y normalizar: unir entradas que representen el mismo producto
        const normalize = (s) => {
            if (!s) return '';
            // remover espacios iniciales/finales, minusculas y normalizar acentos
            return s.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
        };
        const map = new Map();
        for (const item of parsed) {
            const key = normalize(item.nombre || '');
            const precio = Number(item.precio) || 0;
            const cantidad = Math.max(0, Math.floor(Number(item.cantidad) || 0));
            if (map.has(key)) {
                const existing = map.get(key);
                existing.cantidad = (existing.cantidad || 0) + cantidad;
                // keep precio and imagen from latest
                existing.precio = precio || existing.precio;
                if (item.imagen) existing.imagen = item.imagen;
            } else {
                map.set(key, { nombre: item.nombre, precio, cantidad, imagen: item.imagen });
            }
        }
        return Array.from(map.values());
    } catch (e) {
        console.warn('Error leyendo carrito:', e);
        return [];
    }
}

function guardarCarritoLocal(cart) {
    try {
        localStorage.setItem('gympro_cart', JSON.stringify(cart));
    } catch (e) {
        console.warn('Error guardando carrito:', e);
    }
}

export function getCart() {
    return obtenerCarritoLocal();
}

export function removeFromCart(index) {
    const cart = obtenerCarritoLocal();
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        guardarCarritoLocal(cart);
    }
    return cart;
}

export function updateQuantity(index, cantidad) {
    const cart = obtenerCarritoLocal();
    if (index >= 0 && index < cart.length) {
        cart[index].cantidad = cantidad;
        guardarCarritoLocal(cart);
    }
    return cart;
}

export function clearCart() {
    guardarCarritoLocal([]);
}
