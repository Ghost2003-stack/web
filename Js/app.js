// Archivo JavaScript principal de la página.
// Contiene la lógica de validación, registro, inicio de sesión, bienvenida, carrusel y carrito.

// Constantes de IDs de formularios y campos para la lógica modular
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

const BACKGROUND_IMAGE_ID = "backgroundImage";
const SET_BACKGROUND_BUTTON_ID = "setBackground";
const WELCOME_MESSAGE_ID = "welcomeMessage";
const STORAGE_USER_KEY = "gympro_usuario";
const FIELD_ERROR_CLASS = "field-error-message";

const usuariosRegistrados = [];
const mensajesContacto = [];
const carrito = [];
const CART_MESSAGE_ID = "cartMessage";

// Validación genérica de campos con soporte de regex y longitudes máximas.
// Recorre un conjunto de reglas para validar cada campo del formulario.
// Devuelve un objeto de error con mensaje y referencia al elemento si falla.
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

// Elimina estado visual de error de los campos especificados y limpia el mensaje de estado opcional.
// Muestra un mensaje de error específico junto al campo donde ocurrió el problema.
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

// Elimina los estilos de error y los mensajes asociados en los campos indicados.
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

// Valida que el email tenga formato correcto y no exceda longitud permitida.
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email) && email.length <= 254;
}

// Valida que el nombre solo incluya letras, espacios y apóstrofes.
function validarNombre(nombre) {
    const regex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    return regex.test(nombre) && nombre.length >= 2 && nombre.length <= 80;
}

// Valida la contraseña según requisitos básicos de longitud y caracteres.
function validarPassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password) && password.length <= 128;
}

// Verifica si una URL es una imagen válida con protocolo HTTPS y extensión soportada.
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

// Muestra un mensaje dinámico en el DOM dentro del elemento identificado por id.
// Muestra un mensaje general en un elemento con el id indicado.
function mostrarMensaje(id, texto, esError = false) {
    const elemento = document.getElementById(id);
    if (!elemento) return;

    elemento.textContent = texto;
    elemento.classList.toggle("error", esError);
    elemento.classList.toggle("success", !esError);
}

// Función modular para actualizar el DOM con mensajes.
function actualizarDOM(id, texto, esError = false) {
    mostrarMensaje(id, texto, esError);
}

// Crea un objeto usuario que representa al inscrito.
function crearUsuario(nombre, email, password) {
    return { nombre, email, password };
}

// Lee parámetros de consulta de la URL para mostrar datos en la página de bienvenida.
function obtenerParametroConsulta(nombre) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(nombre);
}

// Guarda información del usuario en localStorage para mantener sesión entre páginas.
function guardarUsuarioEnLocalStorage(usuario) {
    try {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(usuario));
    } catch (error) {
        console.warn("No se pudo guardar el usuario en localStorage:", error);
    }
}

// Recupera el usuario guardado en localStorage si existe.
function obtenerUsuarioGuardado() {
    try {
        const usuarioJSON = localStorage.getItem(STORAGE_USER_KEY);
        return usuarioJSON ? JSON.parse(usuarioJSON) : null;
    } catch (error) {
        console.warn("No se pudo leer el usuario desde localStorage:", error);
        return null;
    }
}

// Coloca el mensaje de bienvenida con el nombre del usuario en la página principal.
function mostrarBienvenidaUsuario(nombre) {
    const mensajeBienvenida = document.getElementById(WELCOME_MESSAGE_ID);
    if (!mensajeBienvenida) return;

    mensajeBienvenida.textContent = `Bienvenido${nombre ? ", " + nombre : ""}! Gracias por registrarte.`;
    mensajeBienvenida.classList.add("success");
}

// Inicializa el mensaje de bienvenida usando parámetros de URL o datos guardados.
function inicializarBienvenida() {
    const nombreDesdeQuery = obtenerParametroConsulta("welcome");
    const usuarioGuardado = obtenerUsuarioGuardado();

    if (nombreDesdeQuery) {
        mostrarBienvenidaUsuario(decodeURIComponent(nombreDesdeQuery));
    } else if (usuarioGuardado && usuarioGuardado.nombre) {
        mostrarBienvenidaUsuario(usuarioGuardado.nombre);
    }
}

// Maneja el envío del formulario de registro, valida los campos y crea el usuario si todo es correcto.
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

// Guarda el usuario registrado, lo almacena localmente y redirige a la página de productos.
function registrarUsuario(usuario) {
    usuariosRegistrados.push(usuario);
    guardarUsuarioEnLocalStorage(usuario);
    console.table(usuariosRegistrados);
    actualizarDOM(REGISTER_MESSAGE_ID, `Registro exitoso. Redirigiendo a la tienda...`, false);

    setTimeout(() => {
        window.location.href = `SuplementosGymPro.html?welcome=${encodeURIComponent(usuario.nombre)}`;
    }, 800);
}

// Maneja el envío del formulario de login e intenta autenticar al usuario.
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

// Busca un usuario registrado con email y contraseña y muestra un mensaje de bienvenida si coincide.
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

// Maneja el envío del formulario de contacto y almacena el mensaje enviado por el usuario.
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

// Agrega un producto al carrito en memoria y muestra un mensaje de confirmación.
function agregarCarrito(producto) {
    carrito.push(producto);
    console.table(carrito);
    actualizarDOM(CART_MESSAGE_ID, `Producto "${producto.nombre}" agregado al carrito.`, false);
}

function mostrarMensajeDeFondo(texto) {
    const mensajeElemento = document.getElementById(REGISTER_MESSAGE_ID);
    if (mensajeElemento) {
        mensajeElemento.textContent = texto;
    }
}

function setBackgroundImage() {
    const imageInput = document.getElementById(BACKGROUND_IMAGE_ID);
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

// Actualiza el carrusel en el DOM marcando la diapositiva activa y el indicador correspondiente.
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

// Cambia la diapositiva actual del carrusel en base al delta (+1 o -1) y actualiza el DOM.
function cambiarSlide(delta) {
    if (!carouselItems.length) return;
    indiceActual = (indiceActual + delta + carouselItems.length) % carouselItems.length;
    cambiarImagen();
}

// Inicia la rotación automática del carrusel cada 5 segundos.
function iniciarCarruselAutomatico() {
    if (intervaloCarrusel) {
        clearInterval(intervaloCarrusel);
    }
    intervaloCarrusel = setInterval(() => {
        cambiarSlide(1);
    }, 5000);
}

// Detiene la rotación automática del carrusel.
function detenerCarruselAutomatico() {
    if (intervaloCarrusel) {
        clearInterval(intervaloCarrusel);
        intervaloCarrusel = null;
    }
}

// Maneja el cambio manual del carrusel y reinicia el temporizador automático.
function manejarCambioCarrusel(delta) {
    cambiarSlide(delta);
    detenerCarruselAutomatico();
    iniciarCarruselAutomatico();
}

// Cambia de pestaña entre Registro e Iniciar sesión en Registro.html.
function cambiarPestana(nombrePestana) {
    const secciones = document.querySelectorAll(".form-section");
    const botones = document.querySelectorAll(".tab-button");
    
    secciones.forEach(seccion => seccion.classList.remove("active"));
    botones.forEach(boton => boton.classList.remove("active"));
    
    if (nombrePestana === "registro") {
        document.getElementById("registro-section").classList.add("active");
        document.getElementById("tabRegistro").classList.add("active");
    } else if (nombrePestana === "login") {
        document.getElementById("login-section").classList.add("active");
        document.getElementById("tabLogin").classList.add("active");
    }
}

// Configura todos los listeners cuando el DOM esté cargado.
document.addEventListener("DOMContentLoaded", () => {
    // Listeners para los botones de pestaña (si existen en la página).
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

    const setBackgroundButton = document.getElementById(SET_BACKGROUND_BUTTON_ID);
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
            const producto = {
                nombre,
                precio,
                cantidad: 1
            };
            agregarCarrito(producto);
        });
    });

    // Inicializa la rotación automática del carrusel.
    cambiarImagen();
    iniciarCarruselAutomatico();
});
