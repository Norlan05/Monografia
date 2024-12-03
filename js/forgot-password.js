// Función para enviar el restablecimiento de contraseña
function sendPasswordReset() {
  // Obtener el valor del correo electrónico
  const email = document.getElementById("email").value;

  // Validación básica de correo (puedes ajustar esto según sea necesario)
  if (email === "usuario@ejemplo.com") {
    Swal.fire({
      icon: "success",
      title: "¡Correo enviado!",
      text: "Se le envió su nueva contraseña al correo.",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Correo incorrecto",
      text: "Digite el correo correcto.",
    });
  }
}
