const botonModo = document.getElementById("modo");

botonModo.addEventListener("click", () => {
  document.body.classList.toggle("light");

  botonModo.textContent = document.body.classList.contains("light")
    ? "🌙 Modo oscuro"
    : "☀️ Modo claro";
});

const form = document.getElementById('form1');
const passwordInput = document.getElementById("password");
const bars = [
  document.getElementById("bar1"),
  document.getElementById("bar2"),
  document.getElementById("bar3"),
  document.getElementById("bar4")
];
const emailInput = form.querySelector("input[name='email']");

// Función para validar fuerza de contraseña y actualizar barras
function checkPasswordStrength() {
    const value = passwordInput.value;
    let score = 0;

    const lengthValid = value.length >= 8;
    const upperValid = /[A-Z]/.test(value);
    const numberValid = /\d/.test(value);
    const symbolValid = /[\W_]/.test(value);

    if(lengthValid) score++;
    if(upperValid) score++;
    if(numberValid) score++;
    if(symbolValid) score++;

    bars.forEach(bar => bar.className = "bar");

    for(let i = 0; i < score; i++){
        if(score <= 2) bars[i].classList.add("active", "weak");
        else if(score === 3) bars[i].classList.add("active", "medium");
        else if(score === 4) bars[i].classList.add("active", "strong");
    }

    if(score < 4){
        passwordInput.setCustomValidity("La contraseña debe tener 8+ caracteres, mayúscula, número y símbolo.");
    } else {
        passwordInput.setCustomValidity("");
    }
}

// Ejecutar al escribir en el password
passwordInput.addEventListener("input", checkPasswordStrength);

// Ejecutar al enviar el formulario
form.addEventListener('submit', function(event){
    const nombreInput = form.querySelector("input[name='nombre']");
    const confirmInput = form.querySelector("input[name='confirm']");
    const nombre = nombreInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    const emailInput = form.querySelector("input[name='email']");

    emailInput.addEventListener("input", function() {
    if(emailInput.value.trim().toLowerCase().endsWith("@empresa.com")) {
        emailInput.setCustomValidity(""); // email correcto, borramos el mensaje
    } else {
        emailInput.setCustomValidity("El correo debe ser de la empresa"); // opcional mientras escribe
    }
});

nombreInput.addEventListener("input", function() {
    const nombre = nombreInput.value.trim();
    if(/^[A-Za-z][A-Za-z0-9]*$/.test(nombre)) {
        nombreInput.setCustomValidity(""); // nombre válido, borramos error
    } else {
        nombreInput.setCustomValidity("El nombre debe empezar con una letra y solo contener letras y números");
    }
});
    // Validación de nombre
  if(!/^[A-Za-z][A-Za-z0-9]*$/.test(nombreInput.value.trim())) {
    nombreInput.setCustomValidity("El nombre debe empezar con una letra y solo contener letras y números");
} else {
    nombreInput.setCustomValidity("");
}

    // Validación de email
if(!emailInput.value.trim().toLowerCase().endsWith("@empresa.com")) {
    emailInput.setCustomValidity("El correo debe ser de la empresa");
} else {
    emailInput.setCustomValidity("");
}

    // Validación de contraseñas
    if(password !== confirm){
        confirmInput.setCustomValidity("Las contraseñas no coinciden.");
    } else {
        confirmInput.setCustomValidity("");
    }

    // Validar fuerza de contraseña antes de enviar
    checkPasswordStrength();

    // Bloquear envío si no es válido
    if(!form.checkValidity()){
        event.preventDefault();
        form.reportValidity();
    }
});


