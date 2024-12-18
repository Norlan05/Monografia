// Función para validar los datos del formulario
function validarFormulario(event) {
  // Obtener los valores del formulario
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("telefono").value;
  const cedula = document.getElementById("cedula").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const direccion = document.getElementById("direccion").value;

  // Validación de nombre (solo letras)
  const nombreRegex = /^[A-Za-záéíóúÁÉÍÓÚ]+$/;
  if (!nombre || !nombreRegex.test(nombre)) {
    alert("Por favor, ingrese un nombre válido (solo letras).");
    event.preventDefault();
    return false;
  }

  // Validación de apellido (solo letras)
  const apellidoRegex = /^[A-Za-záéíóúÁÉÍÓÚ]+$/;
  if (!apellido || !apellidoRegex.test(apellido)) {
    alert("Por favor, ingrese un apellido válido (solo letras).");
    event.preventDefault();
    return false;
  }

  // Validación de correo electrónico
  const correoRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!correo || !correoRegex.test(correo)) {
    alert("Por favor, ingrese un correo electrónico válido.");
    event.preventDefault();
    return false;
  }

  // Validación de teléfono (solo números, mínimo 8 dígitos)
  const telefonoRegex = /^[0-9]{8,}$/;
  if (!telefono || !telefonoRegex.test(telefono)) {
    alert("Por favor, ingrese un número de teléfono válido (8 dígitos).");
    event.preventDefault();
    return false;
  }

  // Validación de cédula (solo números, 12 dígitos)
  const cedulaRegex = /^[0-9]{12}$/;
  if (!cedula || !cedulaRegex.test(cedula)) {
    alert("Por favor, ingrese una cédula válida (12 dígitos).");
    event.preventDefault();
    return false;
  }

  // Validación de fecha de nacimiento (no mayor que la fecha actual)
  const hoy = new Date();
  const fechaNacimientoDate = new Date(fechaNacimiento);
  if (!fechaNacimiento || fechaNacimientoDate >= hoy) {
    alert(
      "Por favor, ingrese una fecha de nacimiento válida (debe ser antes de la fecha actual)."
    );
    event.preventDefault();
    return false;
  }

  // Validación de dirección (no puede estar vacía)
  if (!direccion) {
    alert("Por favor, ingrese una dirección.");
    event.preventDefault();
    return false;
  }

  // Si todas las validaciones son correctas, enviar el formulario
  return true;
}

// Asignar el evento de validación al enviar el formulario
document
  .getElementById("registro-form")
  .addEventListener("submit", validarFormulario);
